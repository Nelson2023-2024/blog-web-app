import React from "react";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import useBlogData from "../hooks/useBlogData";

const LatestNews = () => {
  const { data: authUser } = useAuth();

  const { data: blogData, isLoading, isError } = useBlogData();

   // Improved loading state
   if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <p className="text-red-500 text-xl">Error loading blogs</p>
      </div>
    );
  }


  return (
    <section className="min-h-screen bg-gray-200 px-11 pt-[100px] pb-20">
      <div className="mb-20">
        <h1 className="text-8xl mb-10 text-blue-700">Latest News</h1>
        <hr className="border-blue-700" />
      </div>

      {/* News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogData?.length > 0 ? (
          blogData.map((blog) => (
            <div key={blog.id} className="overflow-hidden">
              <img
                src={blog.featuredImg || "https://via.placeholder.com/400"}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-bold text-blue-700">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  {blog.content?.slice(0, 100)}...
                </p>
                <div className="mt-3 text-gray-500 text-xs">
                  By {blog.author.fullName} ({blog.author.userName})
                </div>
                <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
                  <button className="cursor-pointer flex items-center gap-2 text-pink-500">
                    <AiOutlineLike size={20} /> {blog._count.likes}
                  </button>
                  {authUser.id === blog.author.id && (
                    <button className="cursor-pointer flex items-center gap-2 text-pink-500">
                      <MdOutlineDelete size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-500">
            No blogs available at the moment.
          </p>
        )}
      </div>
    </section>
  );
};

export default LatestNews;
