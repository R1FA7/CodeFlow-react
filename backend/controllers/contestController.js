import Contest from '../models/contest.js';
import Problem from '../models/problem.js';
import TestCase from '../models/testcase.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { contestSchema } from '../validations/contest.validation.js';

export const getContest = asyncHandler(async(req,res)=>{
  const contestData = await Contest.findOne({round:req.params.id}).populate('problems')
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
  }).populate('problems')
  const past = info.map((contest)=>({
    round: contest.round,
    contestName: `Codeflow ${contest.level} Contest ${contest.round}`,
    problems: contest.problems.map(({ _id, title }) => ({
        _id,
        title,
    })),
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
    round: contest.round,
    contestName: `Codeflow ${contest.level} Contest ${contest.round}`,
    problems: contest.problems.map(({ _id, title }) => ({ _id, title })),
  }))

  res.status(200).json(new ApiResponse(200,currentContests, 'Fetched current contests successfully'))
})

export const getUpcomingContests = asyncHandler(async(req,res)=>{
  const currentDate = new Date()
  const info = await Contest.find({
    contestDate:{$gt: currentDate}
  }).select('level round contestDate duration').sort({contestDate:1})
  const upcoming = info.map(({ level, round, contestDate, duration }) => ({
      round,
      contestName: `Codeflow ${level} Contest ${round}`,
      contestDate,
      duration,
  }));
  res.status(200).json(new ApiResponse(200,upcoming, 'Fetched upcoming contests successfully'));
})

export const createContest = asyncHandler(async(req,res)=>{
  const {level, problems, contestDate, duration} = contestSchema.parse(req.body)

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