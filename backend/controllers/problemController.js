import Problem from '../models/problem.js';
import Submission from '../models/submission.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPastProblem = asyncHandler(async(req,res)=>{
  console.log('from problem cont',req.params)
  let problem = await Problem.findById(req.params.id).populate('testCases')
  if(!problem) throw new ApiError(404,'Problem not found')
  problem.testCases = problem.testCases.splice(0,2)
  res.status(200).json(new ApiResponse(200,problem,'Problem fetched successfully'))
})

export const getAllPastProblems = asyncHandler(async(req,res)=>{
  let problems = await Problem.find({
    // contest: {$ne: null}
  }).populate("contest");
  let result = [];
  const currentDate = new Date();
  for (let i = 0; i < problems.length; i++) {
    const { contestDate, duration } = problems[i].contest;
    if (problems[i].contest.published && new Date(contestDate).getTime() + duration < currentDate) {
      const solvedBy = await Submission.find({ problem: problems[i]._id, message: "Accepted" }).countDocuments();
      let r = {
          _id: problems[i]._id,
          id: problems[i].id,
          title: problems[i].title,
          rating: problems[i].rating,
          round: problems[i].contest.round,
          solvedBy,
      };
      result.push(r);
    }
  }
  res.status(200).json(new ApiResponse(200,result,'Problems fetched successfully'))
})