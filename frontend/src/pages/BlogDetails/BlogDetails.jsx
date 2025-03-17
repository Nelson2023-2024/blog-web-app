import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineDelete, MdArrowBack } from "react-icons/md";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useLikeBlog } from "../../hooks/useLikeBlog";
import { useDeleteBlog } from "../../hooks/useDeleteBlog";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: authUser } = useAuth();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likingBlogId, setLikingBlogId] = useState(null);

  const { mutate: likeBlog } = useLikeBlog();
  const { mutate: deleteBlog, isPending } = useDeleteBlog();

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/blog/get-blog/${id}`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch blog details");
        }
        
        setBlog(data.data);
      } catch (error) {
        toast.error(error.message || "Failed to fetch blog details");
        console.error("Error fetching blog details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlogDetails();
    }
  }, [id]);

  const handleLikeBlog = (blogId) => {
    setLikingBlogId(blogId);
    likeBlog(blogId, {
      onSuccess: () => {
        // Refresh blog data after liking
        refreshBlogData();
      },
      onSettled: () => {
        setLikingBlogId(null);
      }
    });
  };

  const handleDeleteBlog = (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteBlog(blogId, {
        onSuccess: () => {
          toast.success("Blog deleted successfully");
          navigate("/"); // Navigate back to blog list after deletion
        }
      });
    }
  };

  const refreshBlogData = async () => {
    try {
      const response = await fetch(`/api/get-blog/${id}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setBlog(data.data);
      }
    } catch (error) {
      console.error("Error refreshing blog data:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
        <p className="text-red-500 text-xl mb-4">Blog not found</p>
        <button 
          className="px-4 py-2 bg-blue-700 text-white rounded flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <MdArrowBack /> Back to Latest News
        </button>
      </div>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="min-h-screen bg-gray-200 px-4 md:px-11 pt-[100px] pb-20">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          className="m-4 px-4 py-2 bg-blue-700 text-white rounded flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <MdArrowBack /> Back to Latest News
        </button>
        
        {/* Featured Image */}
        <img
          src={blog.featuredImg || "https://via.placeholder.com/1200x400"}
          alt={blog.title}
          className="w-full h-64 md:h-96 object-cover"
        />
        
        <div className="p-6">
          {/* Title and Author Info */}
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
            {blog.title}
          </h1>
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-600">
              By {blog.author.fullName} ({blog.author.userName})
            </div>
            <div className="text-gray-500">
              {formattedDate}
            </div>
          </div>
          
          {/* Content */}
          <div className="prose max-w-none mb-8">
            {blog.content}
          </div>
          
          {/* Actions */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
            <button
              className="flex items-center gap-2 text-pink-500"
              onClick={() => handleLikeBlog(blog.id)}
              disabled={likingBlogId === blog.id}
            >
              {likingBlogId === blog.id ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  <AiOutlineLike size={24} /> 
                  <span>{blog._count?.likes || 0} likes</span>
                </>
              )}
            </button>
            
            {authUser && authUser.id === blog.author.id && (
              <button
                onClick={() => handleDeleteBlog(blog.id)}
                disabled={isPending}
                className="flex items-center gap-2 text-pink-500"
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <>
                    <MdOutlineDelete size={24} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;