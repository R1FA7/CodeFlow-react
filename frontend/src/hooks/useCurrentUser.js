import { useQuery } from "@tanstack/react-query"
import { getMe } from "../api/auth"

//instead of context API
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
    retry: 1,
    staleTime: 1000*60*5
  })
}
