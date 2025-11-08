import Contest from '../models/contest.js';
import Problem from '../models/problem.js';
import TestCase from '../models/testcase.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { contestSchema } from '../validations/contest.validation.js';

export const getContest = asyncHandler(async(req,res)=>{
  const contestData = await Contest.findById(req.params.id).populate('problems');
  if(!contestData) throw new ApiError(404, 'contest not found')
  const contest = {
    contestName: `Codeflow ${contestData.level} Contest ${contestData.round}`,
    problems: contestData.problems.map(({ _id, id, title }) => ({
      _id,
      id,
      title,
    })),
    contestDate: contestData.contestDate,
    duration: contestData.duration,
  };
  res.status(200).json(new ApiResponse(200,contest,'Fetched contest successfully'));
})

export const getPastContests = asyncHandler(async(req,res)=>{
  const currentDate = new Date()
  const info = await Contest.find({
    contestDate:{$ne: null},
    $expr:{
      $lt: [
        {$add: ['$contestDate', '$duration']},
        currentDate
      ]
    }
  }).populate('problems').populate('setter')
  const past = info.map((contest)=>({
    id: contest._id,
    date: contest.contestDate,
    contestName: `Codeflow ${contest.level} Contest ${contest.round}`,
    problems: contest.problems.map(({ _id, title }) => ({
        _id,
        title,
    })),
    setter: contest.setter
  }))
  res.status(200).json(new ApiResponse(200,past,'Fetched past contests successfully'))
})

export const getCurrentContest = asyncHandler(async(req,res)=>{
  const currentDate = new Date()
  const info = await Contest.find({
    contestDate: {$ne: null},
    $expr:{
      $and:[
        {$gte:[{$add:['$contestDate','$duration']}, currentDate]},
        {$lte: ['$contestDate', currentDate]}
      ]
    }
  }).populate('problems')

  const currentContests = info.map(contest=>({
    id: contest._id,
    round: contest.round,
    contestName: `Codeflow ${contest.level} Contest`,// ${contest.round}`,
    problems: contest.problems.map(({ _id, title }) => ({ _id, title })),
    duration: contest.duration,
    contestDate: contest.contestDate
  }))

  res.status(200).json(new ApiResponse(200,currentContests, 'Fetched current contests successfully'))
})

export const getUpcomingContests = asyncHandler(async(req,res)=>{
  const currentDate = new Date()
  const info = await Contest.find({
    contestDate:{$gt: currentDate}
  }).select('level round contestDate duration').sort({contestDate:1}).populate('setter')
  const upcoming = info.map(({ level, round, contestDate, duration, setter }) => ({
      round,
      contestName: `Codeflow ${level} Contest ${round}`,
      date:contestDate,
      duration,
      setter
  }));
  res.status(200).json(new ApiResponse(200,upcoming, 'Fetched upcoming contests successfully'));
})

export const createContest = asyncHandler(async(req,res)=>{
  console.log(req.body)
  const {level, problems, contestDate, duration} = contestSchema.parse(req.body)
  console.log(level,problems,contestDate, duration)

  const round = await Contest.countDocuments()+1

  const insertedProblems = await Promise.all(
    problems.map(async(problem)=>{
      const testCases = problem.testCases.map(tc=>new TestCase(tc))
      const insertedTcs = await TestCase.insertMany(testCases)

      const newProblem = new Problem({
        ...problem,
        testCases: insertedTcs.map(tc=>tc._id)
      })

      return newProblem.save()
    })
  )
  const probIds = insertedProblems.map(p=>p._id)

  const contest = new Contest({
    level,
    contestDate,
    duration,
    round,
    problems: probIds,
    setter: req.user.id
  })

  await contest.save()
  await contest.populate('problems')
  res.status(201).json(new ApiResponse(201,contest,'Contest created successfully'))
})
