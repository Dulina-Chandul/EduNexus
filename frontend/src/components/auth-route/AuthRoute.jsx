import { useQuery } from "@tanstack/react-query";
import React from "react";
import { authenticateUserAPI } from "../../APIservices/users/userAPI";
import Login from "../user/Login";
import { Navigate } from "react-router-dom";
import AlertMessage from "../alerts/AlertMessage";
import AuthCheckingComponent from "../alerts/AuthCheckingComponent";

const AuthRoute = ({ children }) => {
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

  if (userData) {
    return children;
  }
};

export default AuthRoute;
