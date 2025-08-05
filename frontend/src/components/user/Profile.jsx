import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { authenticateUserAPI } from "../../APIservices/users/userAPI";
import { isAuthenticated } from "../../redux/slices/authSlices";
import { useDispatch } from "react-redux";

const Profile = () => {
  const {
    isError,
    isFetching,
    data: userData,
    error,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["authenticate-user"],
    queryFn: authenticateUserAPI,
  });

  //* Dispatch user data to the Redux store
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(isAuthenticated(userData));
  }, [userData]);

  return <div>Profile</div>;
};

export default Profile;
