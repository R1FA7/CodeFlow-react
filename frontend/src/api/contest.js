import { API_PATHS } from "../utils/apiPaths"
import { axiosInstance } from "../utils/axiosInstance"

export const getContest = async(id) => {
  const res = await axiosInstance.get(API_PATHS.CONTESTS.GET_CONTEST(id))
  return res?.data
}

export const getPastContests = async() => {
  const res = await axiosInstance.get(API_PATHS.CONTESTS.GET_PAST)
  return res?.data
}

export const getCurrentContest = async() => {
  const res = await axiosInstance.get(API_PATHS.CONTESTS.GET_CURRENT)
  return res?.data
}

export const getUpcomingContests = async() => {
  const res = await axiosInstance.get(API_PATHS.CONTESTS.GET_UPCOMING)
  return res?.data
}

export const createContest = async(formData) => {
  const res = await axiosInstance.post(API_PATHS.CONTESTS.CREATE,formData)
  return res?.data 
}