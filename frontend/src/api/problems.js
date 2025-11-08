import { API_PATHS } from "../utils/apiPaths"
import { axiosInstance } from "../utils/axiosInstance"

export const getProblems = async() => {
  const res = await axiosInstance.get(API_PATHS.PROBLEMS.GET_PROBLEMS)
  return res
}

export const getProblem = async(id) => {
  const res = await axiosInstance.get(API_PATHS.PROBLEMS.GET_PROBLEM(id))
  return res?.data
}