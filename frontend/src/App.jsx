import HomePage from "./components/home/HomePage";
import PublicNavBar from "./components/nav-bar/PublicNavBar";
import CreatePost from "./components/posts/CreatePost";
import PostDetails from "./components/posts/PostDetails";
import PostsList from "./components/posts/PostsList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UpdatePost from "./components/posts/UpdatePost";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
import PrivateNavbar from "./components/nav-bar/PrivateNavbar";
import { useDispatch, useSelector } from "react-redux";
import { authenticateUserAPI } from "./APIservices/users/userAPI";
import { isAuthenticated } from "./redux/slices/authSlices";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

function App() {
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

  //* Get the login user from store
  const { userAuth } = useSelector((state) => {
    return state.auth;
  });
  console.log(userAuth);

  return (
    <BrowserRouter>
      {userAuth ? <PrivateNavbar /> : <PublicNavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts" element={<PostsList />} />
        <Route path="post/:postId" element={<PostDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="post/:postId" element={<UpdatePost />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
