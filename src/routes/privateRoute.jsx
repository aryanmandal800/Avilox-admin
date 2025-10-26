import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, children }) => {
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
