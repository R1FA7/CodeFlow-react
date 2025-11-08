import { API_PATHS } from "../utils/apiPaths"
import { axiosInstance } from "../utils/axiosInstance"

export const getUnpublishedContests = async() => {
  const res = await axiosInstance.get(API_PATHS.ADMIN.GET_UNPUB_CONTESTS)
  return res
}

export const acceptContest = async(id,date) => {
  const res = await axiosInstance.post(API_PATHS.ADMIN.ACCEPT_CONTEST(id),{date})
  return res
}

export const rejectContest = async(id) => {
  const res = await axiosInstance.delete(API_PATHS.ADMIN.REJECT_CONTEST(id))
  return res
}