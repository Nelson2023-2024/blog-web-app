import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiLogOut, FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { IoCloudUpload } from "react-icons/io5";

const Navbar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: authUser } = useAuth();
  const fileInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    featuredImg: null,
    imagePreview: null
  });

  // Destructure form data for easier access
  const { title, content, featuredImg, imagePreview } = formData;

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      featuredImg: null,
      imagePreview: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Logout Mutation
  const { mutate: logoutMutation, isPending: isLogoutPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Logout failed");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      queryClient.removeQueries();
      navigate("/login");
      toast.success("Logged out successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  // Create Blog Mutation
  const { mutate: createBlog, isPending: isCreating } = useMutation({
    mutationFn: async (newBlog) => {
      const response = await fetch("/api/blog/create-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...newBlog,
          authorId: authUser?.id,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create blog");
      }
      
      return await response.json();
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
    if (!file) return;
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (PNG, JPG, or JPEG)");
      return;
    }
    
    if (file.size > maxSize) {
      toast.error("Image exceeds 5MB limit");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        featuredImg: reader.result,
        imagePreview: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }
    
    createBlog({ title, content, featuredImg });
  };

  const openModal = () => {
    document.getElementById("create_blog_modal")?.showModal();
  };

  const closeModal = () => {
    resetForm();
    document.getElementById("create_blog_modal")?.close();
  };

  return (
    <>
      <nav className="navbar bg-base-100 shadow-sm fixed top-0 left-0 right-0 z-50 px-4 md:px-11">
        <div className="flex-1">
          <Link to="/" className="font-bold text-xl md:text-2xl">
            TechPulse Daily
          </Link>
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {authUser && (
              <li>
                <button
                  onClick={openModal}
                  className="btn btn-ghost"
                  aria-label="Create new post"
                >
                  <FiPlus size={20} /> 
                  <span className="hidden sm:inline">Create Post</span>
                </button>
              </li>
            )}
            <li>
              {authUser && (
                <button
                  className="p-2 hover:bg-gray-100 rounded"
                  onClick={() => logoutMutation()}
                  disabled={isLogoutPending}
                  aria-label="Logout"
                >
                  {isLogoutPending ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    <FiLogOut size={20} />
                  )}
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Create Blog Modal */}
      <dialog id="create_blog_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-2xl mb-6">Create New Post</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text">Featured Image</span>
              </label>
              
              {!imagePreview ? (
                // Image upload area
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload featured image"
                >
                  <IoCloudUpload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">
                    Click to upload or drag and drop
                    <br />
                    <span className="text-sm">PNG, JPG, or JPEG (max 5MB)</span>
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </div>
              ) : (
                // Image preview
                <div className="mt-4 relative w-full">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          featuredImg: null,
                          imagePreview: null
                        }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-control w-full mb-4">
              <label htmlFor="title" className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Enter post title"
                className="input input-bordered w-full"
                value={title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label htmlFor="content" className="label">
                <span className="label-text">Content</span>
              </label>
              <textarea
                id="content"
                name="content"
                className="textarea textarea-bordered h-32 w-full"
                placeholder="Write your post content..."
                value={content}
                onChange={handleChange}
                required
              />
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
    </>
  );
};

export default Navbar;