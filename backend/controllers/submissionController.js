import { randomBytes } from 'crypto';
import { execa } from 'execa';
import { readFile, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path, { dirname } from 'path';
import Problem from '../models/problem.js';
import Submission from '../models/submission.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { submissionSchema } from '../validations/submission.validation.js';

export const getAllSubmissions = asyncHandler(async(req,res)=>{
  const submissions =await Submission.find({
    submittedBy: req.user.id
  }).populate('problem')
  res.status(200).json(new ApiResponse(200, submissions, 'All submissions fetched successfully' ))
})

const running = (contest) => {
  const endTime = new Date(contest.contestDate).getTime() + contest.duration
  return new Date().getTime() < endTime ? contest._id : null 
}

const createTempFile = async(code, language, className) => {
  const fileName = language==='java' && className ? className + '.java' : randomBytes(32).toString('hex') + '.' + language
  const tmpFile = path.join(tmpdir(), fileName)
  await writeFile(tmpFile, code)
  return tmpFile
}

const judgeCode = async(language, tmpFile, testCases) => {
  let className 
  if(language==='java'){
    const code = await readFile(tmpFile, 'utf-8')
    const match = code.match(/public\s+class\s+([a-zA-Z_$][a-zA-Z\d_$]*)/)
    if(!match) return {message: 'Public class not found'}
    className = match[1]
    tmpFile = await createTempFile(code, language, className)
  }

  try{
    if(language==='cpp') await execa('g++', [tmpFile, '-o', tmpFile+ '.bin'])
    if(language==='java') await execa('javac', [tmpFile], {cwd: dirname(tmpFile)})
  } catch{
    return {message: 'Compilation Error'}
  }

  for(let i=0;i<testCases.length; i++){
    const input = testCases[i].input + '\n'
    try {
      let cmd, args, options
      if(language==='cpp'){
        cmd = tmpFile + '.bin'
        args=[]
      } else if(language==='py'){
        cmd = 'python3'
        args = [tmpFile]
      } else if(language==='java'){
        cmd='java'
        args = [className]
        options = {cwd: dirname(tmpFile)}
      } else if(language==='js'){
        cmd='node'
        args=[tmpFile]
      }
      const {stdout} = await execa(cmd, args, {input, ...options, timeout:5000})
      if(stdout.trim()!==testCases[i].output.trim()) return {message:`Wrong answer on test case ${i + 1}`}
    } catch (err) {
      if (err.isCanceled) return { message: `Time limit exceeded on test case ${i + 1}` };
      return { message: `Runtime Error on test case ${i + 1}` };
    }
  }

  return {message:'Accepted'}
}

export const createSubmission = asyncHandler(async(req,res)=>{
  const {code, language, problem} = submissionSchema.parse(req.body)
  const prob =await Problem.findById(problem).populate('testCases').populate('contest')
  if(!prob) throw new ApiError(404, 'Problem not found')
  const contest = running(prob.contest)
  const tmpFile = await createTempFile(code, language)
  const result = await judgeCode(language, tmpFile, prob.testCases)

  const submission = new Submission({
    code,
    language,
    problem: prob._id,
    contest,
    submittedBy: req.user.id ,
    message: result.message,
  })
  await submission.save()
  res.status(201).json(new ApiResponse(201, submission, result.message))

})

export const runPlayground = asyncHandler(async(req,res)=>{
  const {code,  language, input} = submissionSchema.parse(req.body)
  const tmpFile = await createTempFile(code, language)
  const testCases = [{ input: input || "", output: input || "" }];
  const result = await judgeCode(language, tmpFile, testCases)

  res.status(200).json(new ApiResponse(200, null, result.message))
})