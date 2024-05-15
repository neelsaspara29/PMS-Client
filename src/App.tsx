import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./Pages/Login";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./Pages/Register";
import { useSelector } from "react-redux";
import Home from "./Pages/Home";
import Header from "./Component/Header";
import PatientDetail from "./Pages/PatientDetail";
import SubAdminList from "./Pages/Admin/SubAdminList";
import PatientPage from "./Pages/PatientPage";

function App() {
  const isLogin: boolean = useSelector((state: any) => state?.auth.isLoggedIn);
  const user: any = useSelector((state: any) => state?.auth.user);
  return (
    <>
      {isLogin && <Header />}
      {!isLogin ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patient" element={<PatientPage />} />

          <Route path="*" element={<Navigate to={"/login"} />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient/detail/:id" element={<PatientDetail />} />
          {user?.userRole == "admin" && (
            <Route path="/admin" element={<SubAdminList />} />
          )}
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      )}

      <Toaster position="top-right" />
    </>
  );
}

export default App;
