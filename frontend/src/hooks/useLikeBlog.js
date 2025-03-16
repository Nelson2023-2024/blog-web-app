import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useLikeBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/like-blog/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to like blog");
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogData"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};