import { Navigate, Route, Routes } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import SignUp from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import { useQuery } from "@tanstack/react-query";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (!response.ok || data.error)
          throw new Error(data.error || "Something went wrong");

        console.log(`Authuser:`, data);
        return data;
      } catch (error) {
        toast.error(error.message);
        return null;
      }
    },
  });

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center  bg-[#eee]">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  return (
    <>
      <div className="bg-[#eee] h-screen w-[90%] mx-auto">
        {authUser && <Navbar />}
        <Routes>
          <Route
            path="/signup"
            element={authUser ? <Navigate to={"/"} /> : <SignUp />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to={"/"} /> : <Login />}
          />
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to={"/login"} />}
          />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
