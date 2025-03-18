// components/CreateBlogModal.jsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const CreateBlogModal = () => {
  const queryClient = useQueryClient();
  const { data: authUser } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImg, setFeaturedImg] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { mutate: createBlog, isLoading: isCreating } = useMutation({
    mutationFn: async (newBlog) => {
      const response = await fetch("/api/create-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          ...newBlog,
          authorId: authUser.id,
        }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create blog");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      toast.success("Blog created successfully!");
      closeModal();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImg(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }
    createBlog({ title, content, featuredImg });
  };

  const closeModal = () => {
    setTitle("");
    setContent("");
    setFeaturedImg(null);
    setImagePreview(null);
    document.getElementById("create_blog_modal").close();
  };

  return (
    <dialog id="create_blog_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-2xl mb-6">Create New Blog Post</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              placeholder="Enter blog title"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Content</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-32"
              placeholder="Write your blog content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text">Featured Image</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={handleImageUpload}
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-40 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Creating...
                </>
              ) : (
                "Create Post"
              )}
            </button>
            <button
              type="button"
              className="btn"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      {/* Modal backdrop for closing when clicked outside */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  );
};

export default CreateBlogModal;