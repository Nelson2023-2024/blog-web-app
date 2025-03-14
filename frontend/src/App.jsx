import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/signup/Signup";
import Login from "./pages/login/Login";

function App() {
  return (
    <>
      <div className="bg-[#000] h-screen">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
