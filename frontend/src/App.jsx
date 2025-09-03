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
import { isAuthenticated, setRole } from "./redux/slices/authSlices";
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
import Users from "./components/user/Users";
import Unauthorized from "./components/user/Unauthorized";
import StudentDashboard from "./components/user/student/StudentDashboard";
import StudentAccountSummary from "./components/user/student/StudentAccountSummary";
import StudentMyFollowing from "./components/user/student/StudentMyFollowing";
import SmartDailyPlanner from "./components/user/student/SmartDailyPlanner";
import StudentProfileSettings from "./components/user/student/StudentProfileSettings";
import SmartQuiz from "./components/user/student/SmartQuiz";
import AIChatAssistant from "./components/user/student/AIChatAssistant";
import SmartFlashcards from "./components/user/student/SmartFlashCards";

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
  const theme = useSelector((state) => state.theme.mode);
  //* Apply the theme for the entire app
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && savedTheme !== theme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch, theme]);

  useEffect(() => {
    dispatch(isAuthenticated(userData));
    // console.log(userData);
    if (userData) {
      dispatch(setRole(userData.role));
    }
  }, [userData]);
  //* Get the login user from store
  const { userAuth } = useSelector((state) => {
    return state.auth;
  });
  console.log(userAuth);
  console.log("The current theme is:", theme);
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
              <AuthRoute requiredRoles={["teacher", "admin"]}>
                <AccountSummaryDashboard />
              </AuthRoute>
            }
          />
          {/* Create Post */}
          <Route
            path="create-post"
            element={
              <AuthRoute requiredRoles={["teacher", "admin"]}>
                <CreatePost />
              </AuthRoute>
            }
          />
          {/* My Posts */}
          <Route
            path="posts"
            element={
              <AuthRoute requiredRoles={["teacher", "admin"]}>
                <DashboardPosts />
              </AuthRoute>
            }
          />
          {/* My Followers */}
          <Route
            path="my-followers"
            element={
              <AuthRoute requiredRoles={["teacher", "admin"]}>
                <MyFollowers />
              </AuthRoute>
            }
          />
          {/* My Following */}
          <Route
            path="my-followings"
            element={
              <AuthRoute requiredRoles={["teacher", "admin", "student"]}>
                <MyFollowing />
              </AuthRoute>
            }
          />
          {/* Add Category */}
          <Route
            path="add-category"
            element={
              <AuthRoute requiredRoles={["admin"]}>
                <AddCategory />
              </AuthRoute>
            }
          />
          {/* Verify Account */}
          <Route
            path="verify-account/:token"
            element={
              <AuthRoute requiredRoles={["admin", "teacher", "student"]}>
                <AccountVerification />
              </AuthRoute>
            }
          />
          {/* Notification */}
          <Route
            path="notifications"
            element={
              <AuthRoute requiredRoles={["teacher", "admin", "student"]}>
                <Notifications />
              </AuthRoute>
            }
          />
          {/* Update Post */}
          <Route
            path="update-post/:postId"
            element={
              <AuthRoute requiredRoles={["teacher", "admin"]}>
                <UpdatePost />
              </AuthRoute>
            }
          />
          {/* Settings */}
          <Route
            path="settings"
            element={
              <AuthRoute requiredRoles={["teacher", "admin", "student"]}>
                <SettingsPage />
              </AuthRoute>
            }
          />
          {/* Update Email */}
          <Route
            path="add-email"
            element={
              <AuthRoute requiredRoles={["teacher", "admin", "student"]}>
                <AddEmailComponent />
              </AuthRoute>
            }
          />
          {/* Update Profile Picture */}
          <Route
            path="upload-profile-photo"
            element={
              <AuthRoute requiredRoles={["teacher", "admin", "student"]}>
                <UploadProfilePic />
              </AuthRoute>
            }
          />
          {/* List all Users */}
          <Route
            path="users"
            element={
              <AuthRoute requiredRoles={["admin"]}>
                <Users />
              </AuthRoute>
            }
          />
        </Route>
        {/* Student Dashboard */}
        <Route path="/student-dashboard" element={<StudentDashboard />}>
          <Route
            path=""
            element={
              <AuthRoute requiredRoles={["student", "admin", "teacher"]}>
                <StudentAccountSummary />
              </AuthRoute>
            }
          />
          <Route
            path="quiz"
            element={
              <AuthRoute requiredRoles={["student"]}>
                <SmartQuiz />
              </AuthRoute>
            }
          />
          <Route
            path="profile-settings"
            element={
              <AuthRoute requiredRoles={["student"]}>
                <StudentProfileSettings />
              </AuthRoute>
            }
          />
          <Route
            path="daily-planner"
            element={
              <AuthRoute requiredRoles={["student"]}>
                <SmartDailyPlanner />
              </AuthRoute>
            }
          />
          <Route
            path="ai-assistant"
            element={
              <AuthRoute requiredRoles={["student"]}>
                <AIChatAssistant />
              </AuthRoute>
            }
          />
          <Route
            path="flashcards"
            element={
              <AuthRoute requiredRoles={["student"]}>
                <SmartFlashcards />
              </AuthRoute>
            }
          />

          <Route
            path="my-followings"
            element={
              <AuthRoute requiredRoles={["student"]}>
                <StudentMyFollowing />
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
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/profile"
          element={
            <AuthRoute requiredRoles={["teacher", "admin", "student"]}>
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
