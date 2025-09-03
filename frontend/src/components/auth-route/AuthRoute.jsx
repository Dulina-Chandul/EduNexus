import { useQuery } from "@tanstack/react-query";
import React from "react";
import { authenticateUserAPI } from "../../APIservices/users/userAPI";
import Login from "../user/Login";
import { Navigate } from "react-router-dom";
import AlertMessage from "../alerts/AlertMessage";
import AuthCheckingComponent from "../alerts/AuthCheckingComponent";

const AuthRoute = ({ children, requiredRoles }) => {
  const {
    isError,
    isFetching,
    data: userData,
    error,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["authenticate-user"],
    queryFn: authenticateUserAPI,
  });

  if (isLoading) {
    return <AuthCheckingComponent />;
  }

  if (!userData) {
    return <Navigate to={"/login"} />;
  }

  if (requiredRoles && !requiredRoles.includes(userData.role)) {
    if (userData.role === "student") {
      return <Navigate to={"/student-dashboard"} />;
    }
    return <Navigate to={"/unauthorized"} />;
  }

  if (userData) {
    return children;
  }
};

export default AuthRoute;
