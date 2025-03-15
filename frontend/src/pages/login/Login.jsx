import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    error,
    mutate: loginMutation,
  } = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Something went wrong");
      }
      console.log(data);

      return data;
    },
    onSuccess: async () => {
      setFormData({
        email: "",
        password: "",
      });

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: async (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };
  return (
    <div className="flex flex-col items-center justify-center mx-auto min-w-96 h-full ">
      <div className="p-6 border w-[450px] mx-auto bg-gray-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border-gray-100">
        <h1 className="text-3xl font-semibold text-center mb-3">Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center flex-col">
            <label className="input mx-auto mb-2.5 w-[100%]">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </label>

            <label className="input mx-auto mb-2.5 w-[100%]">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle
                    cx="16.5"
                    cy="7.5"
                    r=".5"
                    fill="currentColor"
                  ></circle>
                </g>
              </svg>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </label>
          </div>
          {/* button */}
          <div className="flex justify-center flex-col">
            <button disabled={isPending} className="btn btn-info w-[100%]">
              {isPending ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                "Login"
              )}
            </button>

            {isError && (
              <p className="text-red-500 text-[12px] mt-2 text-center">
                {error.message}
              </p>
            )}
          </div>

          {/* text */}
          <div>
            <p className="text-center mt-3 text-[12px]">
              Don't have an account ?{" "}
              <Link to={"/signup"} className="text-purple-600">
                SignUp
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
