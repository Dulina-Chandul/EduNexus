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
import AuthRoute from "./components/auth-route/AuthRoute";
import UserDashboard from "./components/user/UserDashboard";
import AccountSummaryDashboard from "./components/user/AccountSummary";
import AddCategory from "./components/category/AddCategory";
import AccountVerification from "./components/user/AccountVerification";
import RequestResetPassword from "./components/user/RequestResetPassword";
import ResetPassword from "./components/user/ResetPassword";
import Notifications from "./components/notifications/NotificationLists";
import MyFollowers from "./components/user/MyFollowers";
import MyFollowing from "./components/user/MyFollowing";
import DashboardPosts from "./components/user/DashboardPosts";
import SettingsPage from "./components/user/SettingsPage";
import AddEmailComponent from "./components/user/UpdateEmail";
import UploadProfilePic from "./components/user/UploadProfilePic";

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
        <Route path="/dashboard" element={<UserDashboard />}>
          {/* Acoount Summery */}

          <Route
            path=""
            element={
              <AuthRoute>
                <AccountSummaryDashboard />
              </AuthRoute>
            }
          />

          {/* Create Post */}
          <Route
            path="create-post"
            element={
              <AuthRoute>
                <CreatePost />
              </AuthRoute>
            }
          />

          {/* My Posts */}
          <Route
            path="posts"
            element={
              <AuthRoute>
                <DashboardPosts />
              </AuthRoute>
            }
          />

          {/* My Followers */}
          <Route
            path="my-followers"
            element={
              <AuthRoute>
                <MyFollowers />
              </AuthRoute>
            }
          />

          {/* My Following */}
          <Route
            path="my-followings"
            element={
              <AuthRoute>
                <MyFollowing />
              </AuthRoute>
            }
          />

          {/* Add Category */}
          <Route
            path="add-category"
            element={
              <AuthRoute>
                <AddCategory />
              </AuthRoute>
            }
          />

          {/* Verify Account */}
          <Route
            path="verify-account/:token"
            element={
              <AuthRoute>
                <AccountVerification />
              </AuthRoute>
            }
          />

          {/* Notification */}
          <Route
            path="notifications"
            element={
              <AuthRoute>
                <Notifications />
              </AuthRoute>
            }
          />

          {/* Update Post */}
          <Route
            path="update-post/:postId"
            element={
              <AuthRoute>
                <UpdatePost />
              </AuthRoute>
            }
          />

          {/* Settings */}
          <Route
            path="settings"
            element={
              <AuthRoute>
                <SettingsPage />
              </AuthRoute>
            }
          />

          {/* Update Email */}
          <Route
            path="add-email"
            element={
              <AuthRoute>
                <AddEmailComponent />
              </AuthRoute>
            }
          />

          {/* Update Profile Picture */}
          <Route
            path="upload-profile-photo"
            element={
              <AuthRoute>
                <UploadProfilePic />
              </AuthRoute>
            }
          />
        </Route>

        <Route path="/posts" element={<PostsList />} />
        <Route path="post/:postId" element={<PostDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<RequestResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/profile"
          element={
            <AuthRoute>
              <Profile />
            </AuthRoute>
          }
        />
        {/* <Route path="post/:postId" element={<UpdatePost />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
