import { useQuery } from "@tanstack/react-query"
export const useAuth = () => {
    return useQuery({
      queryKey: ["authUser"],
      queryFn: async () => {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Auth failed");
        return data.user;
      },
      retry:false
    });
  };