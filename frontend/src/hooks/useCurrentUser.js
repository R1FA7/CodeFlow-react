import { useQuery } from "@tanstack/react-query"
import { getMe } from "../api/auth"

//instead of context API
export const useCurrentUser = () => {
  useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
    retry: 3,
    staleTime: 1000*60*5,
  })
}
