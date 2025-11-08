import { API_PATHS } from "../utils/apiPaths";
import { axiosInstance } from "../utils/axiosInstance";

export const storeCode = async({ code, language, stdin, description }) => {
  const res = await axiosInstance.post(API_PATHS.CODE_SHARE.CREATE, {
    code, 
    language, 
    stdin,
    description
  });
  return res;
}

export const getSharedCode = async(shareId) => {
  const res = await axiosInstance.get(API_PATHS.CODE_SHARE.GET(shareId));
  return res;
}

export const getMySharedCodes = async() => {
  const res = await axiosInstance.get(API_PATHS.CODE_SHARE.MY_SHARES);
  return res;
}

export const deleteSharedCode = async(shareId) => {
  const res = await axiosInstance.delete(API_PATHS.CODE_SHARE.DELETE(shareId));
  return res;
}