import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const deleteBlog = async (id) => {
  const response = await fetch(`/api/blog/delete-blog/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  
  if (!response.ok || data.error) {
    throw new Error(data.error || "Failed to delete blog");
  }
  return data;
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogData"]);
      toast.success("Blog deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};