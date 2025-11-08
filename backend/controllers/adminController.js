import Contest from "../models/contest.js";
import Problem from "../models/problem.js";
import TestCase from "../models/testcase.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { agenda } from "./ratingController.js";


export const getAllContests = asyncHandler(async (req, res) => {
  const contests = await Contest.find({ published: false }).populate("problems");

  const data = contests.map((contest) => ({
    contestName: `Codeflow ${contest.level} Contest ${contest.round}`,
    contestId: contest._id.toString(),
    problems: contest.problems.map((p) => ({
      charId: p.id,
      problemId: p._id,
      problemTitle: p.title,
    })),
  }));

  res.status(200).json(new ApiResponse(200, data, "Unpublished contests fetched successfully"));
});

export const acceptContest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const date = new Date(req.body.date).getTime();

  const contest = await Contest.findByIdAndUpdate(
    id,
    { published: true, contestDate: date },
    { new: true }
  );

  if (!contest) throw new ApiError(404, "Contest not found");

  await agenda.schedule(date + contest.duration, "rating", { contestId: contest._id });

  res.status(200).json(new ApiResponse(200, contest, "Contest accepted and scheduled"));
});


export const rejectContest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contest = await Contest.findById(id)
  if (!contest) throw new ApiError(404, "Contest not found");

  const problems = await Problem.find({
    _id: {
      $in:contest.problems
    }
  })
  const tcIds = problems.flatMap(p=>p.testCases || [])

  if (tcIds.length) await TestCase.deleteMany({ _id: { $in: tcIds } })

  if(problems.length) await Problem.deleteMany({contest: contest._id})

  await Contest.findByIdAndDelete(contest._id)


  res.status(200).json(new ApiResponse(200, null, "Contest rejected successfully"));
});
