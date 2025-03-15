import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const fetchBlogData = async () => {
  const response = await fetch('/api/blog/get-blogs');
  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

const useBlogData = () => {
  return useQuery({
    queryKey: ['blogData'],
    queryFn: fetchBlogData,
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export default useBlogData;
