import { API_PATHS } from "../utils/apiPaths"
import { axiosInstance } from "../utils/axiosInstance"

export const submitProblem = async({code, language, problemId}) => {
  const res = await axiosInstance.post(API_PATHS.SUBMISSION.CREATE_SUBMISSIONS,{code, language, problem:problemId})
  return res
}
// const wait = ms => new Promise(resolve=>setTimeout(resolve,ms))
export const getAllSubmissions = async() => {
  // await wait(5000)
  const res = await axiosInstance.get(API_PATHS.SUBMISSION.GET_SUBMISSIONS)
  return res
}

export const runPlaygroundCode = async({code, language,stdin}) => {
  const res  = await axiosInstance.post(API_PATHS.SUBMISSION.RUN_PLAYGROUND,{code, language, input:stdin})
  return res 
}