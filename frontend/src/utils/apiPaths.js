const BASE_API = '/api/v1'

export const API_PATHS  = {
  AUTH: {
    REGISTER: `${BASE_API}/auth/register`,
    LOGIN: `${BASE_API}/auth/login`,
    GET_USER_INFO: `${BASE_API}/auth`,
    LOGOUT :`${BASE_API}/auth/logout`,
    OVERVIEW : `${BASE_API}/auth/overview`,
    UPDATE: `${BASE_API}/auth/me`
  },
  PROBLEMS: {
    GET_PROBLEMS: `${BASE_API}/problems`,
    GET_PROBLEM: (id)=>`${BASE_API}/problems/${id}`,
  },
  SUBMISSION: {
    GET_SUBMISSIONS:`${BASE_API}/submission`,
    CREATE_SUBMISSIONS: `${BASE_API}/submission`,
    RUN_PLAYGROUND: `${BASE_API}/submission/playground`
  },
  CONTESTS: {
    GET_CONTEST: (id) => `${BASE_API}/contests/${id}`,
    GET_PAST: `${BASE_API}/contests/pastContests`,
    GET_CURRENT: `${BASE_API}/contests/currentContest`,
    GET_UPCOMING: `${BASE_API}/contests/upcomingContests`,
    CREATE: `${BASE_API}/contests`
  },
  ADMIN: {
    GET_UNPUB_CONTESTS: `${BASE_API}/admin`,
    ACCEPT_CONTEST: id => `${BASE_API}/admin/${id}`,
    REJECT_CONTEST: id => `${BASE_API}/admin/${id}`,
  },
  CODE_SHARE: {
    CREATE: `${BASE_API}/codeShare`,
    GET: (shareId) => `${BASE_API}/codeShare/${shareId}`,
    //MY_SHARES: '/my-shares',
    //DELETE: (shareId) => `/share/${shareId}`
  },
}