import { Navigate, Route, Routes } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import SignUp from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import { useQuery } from "@tanstack/react-query";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar";
import { useAuth } from "./hooks/useAuth";
import BlogDetails from "./pages/BlogDetails/BlogDetails";

function App() {
  const { data: authUser, isLoading } = useAuth();

  console.log("AuthUser", authUser);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center  bg-[#eee]">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  return (
    <>
      <div className="bg-[#eee] h-screen">
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
          <Route
            path="/blog/:id"
            element={authUser ? <BlogDetails /> : <Navigate to={"/login"} />}
          />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
