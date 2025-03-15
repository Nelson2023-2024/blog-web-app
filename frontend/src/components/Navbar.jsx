import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: logoutMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || data.error)
        throw new Error(data.error || "Something went wrong");
      console.log(data);
      return data;
    },
    onSuccess: async () => {
      // Immediately set auth user to null
      queryClient.setQueryData(["authUser"], null);

      // Remove all cached queries
      queryClient.removeQueries();
      
      // Redirect to login
      navigate("/login");
    },
    onError: async () => {
      toast.error(error.message);
    },
  });

  const handleLogout = () => {
    logoutMutation();
  };
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className=" text-xl">daisyUI</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Link</a>
            </li>
            <li>
              {isPending ? (
                <button
                className="p-2 hover:bg-gray-100 rounded"
              >
                <span className="loading loading-spinner loading-md"></span>
                </button>
              ) : (
                <button
                  disabled={isPending}
                  className="p-2 hover:bg-gray-100 rounded"
                  onClick={handleLogout}
                >
                  <FiLogOut size={20} />
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
