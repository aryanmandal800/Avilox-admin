import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../Auth/LoginPage";
import UserProfile from "../components/userProfile";
import HomePage from "../MainScreen/HomePage";
import RedemptionHistoryPage from "../MainScreen/RedemptionHistoryPage";
import UserLayout from "../MainScreen/userLayout";
import JobLayout from "../MainScreen/jobsLayout";
import CourseLayout from "../MainScreen/courseLayout";
import AdminPanel from "../MainScreen/AdminPanel";

export default function AppRoutes() {

  return (
    <Routes>

      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<HomePage />}/>

      <Route path="/Dashboard" element={<HomePage />}/>

      <Route path="/redemption-history" element={<RedemptionHistoryPage />}/>

      <Route path="/admin-panel" element={<AdminPanel />}/>

      <Route path="/profile" element={<UserProfile />}/>

      <Route path="/logout" element={<Navigate to={"/login"} replace />}/>

      <Route path="/user-management" element={<UserLayout/>}/>
      <Route path="/jobs" element={<JobLayout/>}/>
      <Route path="/courses" element={<CourseLayout/>}/>




      <Route path="*" element={<Navigate to={"/login"} replace />}/>
      
    </Routes>
  );
}
