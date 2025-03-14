import { Route, Routes } from "react-router-dom";
import {Toaster} from "react-hot-toast"
import SignUp from "./pages/signup/Signup";
import Login from "./pages/login/Login";

function App() {
  return (
    <>
      <div className="bg-[#eee] h-screen">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Toaster/>
      </div>
    </>
  );
}

export default App;
