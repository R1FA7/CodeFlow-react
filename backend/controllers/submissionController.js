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
import { playgroundSubmissionSchema, submissionSchema } from '../validations/submission.validation.js';

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

const judgeCode = async(language, tmpFileParam, testCases) => {
  let className 
  let tmpFile = tmpFileParam
  if (language === 'java') {
    const code = await readFile(tmpFile, 'utf-8');
    let match = code.match(/public\s+class\s+([A-Za-z_\$][A-Za-z0-9_\$]*)/);
    if (!match) {
      match = code.match(/class\s+([A-Za-z_\$][A-Za-z0-9_\$]*)/);
      if (!match) return { message: 'No class definition found' };
    }
    className = match[1];
    tmpFile = await createTempFile(code, 'java', className);
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
      if(language==='cpp' || language==='c++'){
        cmd = tmpFile + '.bin'
        args=[]
      } else if(language==='py' || language==='python'){
        cmd = process.platform === 'win32' ? 'py' : 'python3'
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
      console.log({stdout})
      if(stdout.trim()!==testCases[i].output.trim()) return {message:`Wrong answer on test case ${i + 1}`}
    } catch (err) {
      if (err.isCanceled) return { message: `Time limit exceeded on test case ${i + 1}` };
      return { message: `Runtime Error on test case ${i + 1}` };
    }
  }

  return {message:'Accepted'}
}

export const createSubmission = asyncHandler(async(req,res)=>{
  console.log("language",req.body.language)

  const {code, language, problem} = submissionSchema.parse(req.body)
  console.log(problem)
  const prob =await Problem.findById(problem).populate('testCases').populate('contest')
  console.log(prob)
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

const runOnce = async (language, tmpFileParam, stdin) => {
  let className;
  let tmpFile = tmpFileParam
  if (language === 'java') {
    const code = await readFile(tmpFile, 'utf-8');
    let match = code.match(/public\s+class\s+([A-Za-z_\$][A-Za-z0-9_\$]*)/);
    if (!match) {
      match = code.match(/class\s+([A-Za-z_\$][A-Za-z0-9_\$]*)/);
      if (!match) return { message: 'No class definition found' };
    }
    className = match[1];
    tmpFile = await createTempFile(code, 'java', className);
  }

  // compile step
  try {
    if (language === 'cpp' || language === 'c++') {
      await execa('g++', [tmpFile, '-o', tmpFile + '.bin']);
    } else if (language === 'java') {
      await execa('javac', [tmpFile], { cwd: dirname(tmpFile) });
    }
  } catch (compileErr) {
    const stdout = compileErr.stdout || '';
    const stderr = compileErr.stderr || '';
    return { error: true, message: 'Compilation Error', compileStdout: stdout, compileStderr: stderr };
  }

  // run step
  try {
    let cmd, args, options = {};
    
    if (language === 'cpp' || language === 'c++') {
      cmd = tmpFile + '.bin';
      args = [];
    } else if (language === 'python' || language === 'py') {
      cmd = process.platform === 'win32' ? 'py' : 'python3'
      args = [tmpFile];
    } else if (language === 'java') {
      cmd = 'java';
      args = [className];
      options = { cwd: dirname(tmpFile) };
    } else if (language === 'javascript' || language === 'js') {
      cmd = 'node';
      args = [tmpFile];
    } else {
      return { error: true, message: `Unsupported language: ${language}` };
    }
    const inputString = stdin != null ? String(stdin) : '';
    
    const execResult = await execa(cmd, args, { 
      input: inputString,
      ...options, 
      timeout: 5000,
      reject: false, 
      all: true,
      encoding: 'utf8',
      buffer: true
    });

    // Check exit code
    if (execResult.exitCode !== 0) {
      return {
        error: true,
        message: 'Runtime Error',
        runStdout: execResult.stdout || '',
        runStderr: execResult.stderr || ''
      };
    }

    return { 
      error: false, 
      stdout: execResult.stdout || '', 
      stderr: execResult.stderr || '' 
    };
    
  } catch (runErr) {
    if (runErr.timedOut || runErr.isCanceled) {
      return { 
        error: true, 
        message: 'Time limit exceeded', 
        runStdout: runErr.stdout || '', 
        runStderr: runErr.stderr || '' 
      };
    }
    return { 
      error: true, 
      message: 'Runtime Error', 
      runStdout: runErr.stdout || '', 
      runStderr: runErr.stderr || '' 
    };
  }
};
export const runPlayground = asyncHandler(async(req,res)=>{
  const {code, language, input} = playgroundSubmissionSchema.parse(req.body)
  const tmpFile = await createTempFile(code, language)
  const result = await runOnce(language, tmpFile, input || '');
  
  if (result.error) {
    return res.status(200).json(new ApiResponse(200, { 
      stdout: result.stdout || result.runStdout || '', 
      stderr: result.stderr || result.runStderr || '', 
      compileStdout: result.compileStdout || '', 
      compileStderr: result.compileStderr || '' 
    }, result.message || 'Error'));
  }

  return res.status(200).json(new ApiResponse(200, { 
    stdout: result.stdout || '', 
    stderr: result.stderr || '' 
  }, 'OK'));
});