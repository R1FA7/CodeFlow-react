import axios from "axios";

const axiosInstance = axios.create({
  baseURL : import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // console.log("FULL ERROR BREAKDOWN",error)
    const resp = error.response?.data
    const message = resp?.message || 'Something went wrong'
    const errors = resp?.errors || []
    const success = resp?.success ?? false 
    const statusCode = error?.status
    console.log(message, success, statusCode)
    if (error.response?.status === 401) {
      const publicPages = [
        "/",
        "/login",
        "/register",
        "/contests",
        "/problemset",
        "/playground",
        "/unauthorized",
        "/problems",
      ];
      const currentPath = window.location.pathname;

      // Check if current path starts with any of the public paths
      const isPublic = publicPages.some((path) => currentPath.startsWith(path));

      if (!isPublic) {
        window.location.href = "/login";
      }
    }
    return Promise.reject({
      message,
      errors,
      success,
      statusCode,
      data: error.response?.data,
    })
  }
)

export { axiosInstance };

