import { API_PATHS } from "../utils/apiPaths.js";
import { axiosInstance } from "../utils/axiosInstance.js";

export const registerUser = async(formData)=>{
  const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER,formData)
  return res
}

export const getMe = async() => {
  const res = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO)
  return res
}
