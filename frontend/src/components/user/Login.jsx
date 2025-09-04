import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { loginAPI } from "../../APIservices/users/userAPI";
import AlertMessage from "../alerts/AlertMessage";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { isAuthenticated, setRole } from "../../redux/slices/authSlices";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  //* User Mutation
  const userMutation = useMutation({
    mutationKey: ["login-user"],
    mutationFn: loginAPI,
  });

  //* Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      userMutation
        .mutateAsync(values)
        .then((loginResponse) => {
          console.log("Login response:", loginResponse);

          // Invalidate the authenticate-user query to force refetch
          queryClient.invalidateQueries({
            queryKey: ["authenticate-user"],
          });

          // Dispatch user data to Redux (based on your login response structure)
          if (loginResponse) {
            // Create user object from login response
            const userData = {
              _id: loginResponse._id,
              username: loginResponse.username,
              email: loginResponse.email,
              role: loginResponse.role,
            };

            dispatch(isAuthenticated(userData));
            dispatch(setRole(loginResponse.role));

            // Navigate based on role
            if (loginResponse.role === "student") {
              navigate("/student-dashboard");
            } else {
              navigate("/dashboard");
            }
          }
        })

        .catch((error) => {
          console.error("Error during registration:", error);
        });
    },
  });

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-bg dark:bg-bg-dark border border-primary/20 dark:border-primary-dark/20 rounded-3xl shadow-2xl p-8 backdrop-blur-sm relative overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary-dark/5 dark:to-accent-dark/5 pointer-events-none"></div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 text-accent/20 dark:text-accent-dark/20">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div className="absolute bottom-4 left-4 text-primary/20 dark:text-primary-dark/20">
            <div className="w-3 h-3 bg-primary/20 dark:bg-primary-dark/20 rounded-full animate-bounce"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent dark:from-primary-dark dark:to-primary-dark rounded-2xl mb-4 shadow-lg">
                <User className="h-8 w-8 text-bg dark:text-bg-dark" />
              </div>
              <h1 className="text-3xl font-bold text-text dark:text-text-dark mb-2">
                Welcome Back
              </h1>
              <p className="text-text/70 dark:text-text-dark/70">
                Sign in to continue your learning journey
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Navigation Link */}
              <div className="text-center">
                <Link
                  to="/register"
                  className="inline-flex items-center text-text/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-primary-dark transition-colors duration-300 group"
                >
                  <span>Don't have an account?</span>
                  <span className="font-bold ml-1 group-hover:translate-x-1 transition-transform duration-300">
                    Register Here
                  </span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {/* Alerts */}
              {userMutation.isPending && (
                <div className="relative">
                  <AlertMessage type="loading" message="Logging user..." />
                  <div className="absolute inset-0 flex items-center justify-center bg-bg/50 dark:bg-bg-dark/50 backdrop-blur-sm rounded-lg">
                    <Loader2 className="h-6 w-6 animate-spin text-primary dark:text-primary-dark" />
                  </div>
                </div>
              )}

              {userMutation.isSuccess && (
                <div className="animate-fade-in">
                  <AlertMessage
                    type="success"
                    message="User logged successfully!"
                  />
                </div>
              )}

              {userMutation.isError && (
                <div className="animate-shake">
                  <AlertMessage
                    type="error"
                    message={
                      userMutation.error.response?.data?.message ||
                      "Please Try Again..."
                    }
                  />
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text dark:text-text-dark">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40 dark:text-text-dark/40 group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors duration-300">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-bg/50 dark:bg-bg-dark/50 border border-primary/20 dark:border-primary-dark/20 rounded-2xl outline-none text-text dark:text-text-dark placeholder-text/50 dark:placeholder-text-dark/50 focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary-dark/30 focus:border-primary dark:focus:border-primary-dark transition-all duration-300 backdrop-blur-sm"
                    type="text"
                    placeholder="Enter your username"
                    {...formik.getFieldProps("username")}
                  />
                </div>
                {formik.touched.username && formik.errors.username && (
                  <div className="text-secondary dark:text-secondary-dark text-sm font-medium animate-fade-in">
                    {formik.errors.username}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text dark:text-text-dark">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40 dark:text-text-dark/40 group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors duration-300">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    className="w-full pl-12 pr-12 py-4 bg-bg/50 dark:bg-bg-dark/50 border border-primary/20 dark:border-primary-dark/20 rounded-2xl outline-none text-text dark:text-text-dark placeholder-text/50 dark:placeholder-text-dark/50 focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary-dark/30 focus:border-primary dark:focus:border-primary-dark transition-all duration-300 backdrop-blur-sm"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...formik.getFieldProps("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text/40 dark:text-text-dark/40 hover:text-text dark:hover:text-text-dark transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-secondary dark:text-secondary-dark text-sm font-medium animate-fade-in">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              {/* Login Button */}
              <button
                className="w-full py-4 bg-gradient-to-r from-primary to-primary dark:from-primary-dark dark:to-accent-dark text-bg dark:text-bg-dark font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                type="submit"
                disabled={userMutation.isPending}
              >
                {userMutation.isPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg/10 dark:via-bg-dark/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>

              {/* Google Sign In */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary/20 dark:border-primary-dark/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-bg dark:bg-bg-dark text-text/60 dark:text-text-dark/60 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <a
                href="http://localhost:5000/api/v1/users/auth/google"
                className="w-full flex items-center justify-center space-x-3 py-4 bg-bg dark:bg-bg-dark border-2 border-primary/20 dark:border-primary-dark/20 rounded-2xl text-text dark:text-text-dark font-semibold hover:border-primary/40 dark:hover:border-primary-dark/40 hover:bg-primary/5 dark:hover:bg-primary-dark/5 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 21 20"
                  fill="none"
                  className="group-hover:scale-110 transition-transform duration-300"
                >
                  <path
                    d="M10.5003 1.91667C12.5358 1.91667 14.3903 2.67493 15.8117 3.91839L13.8037 5.92643C12.9021 5.19326 11.7542 4.75001 10.5003 4.75001C7.601 4.75001 5.25033 7.10068 5.25033 10C5.25033 12.8993 7.601 15.25 10.5003 15.25C12.7863 15.25 14.7244 13.7867 15.4456 11.7501L15.5636 11.4167H15.2099H10.7503V8.58334H17.7503V8.61792H18.0003H18.4637C18.5415 9.06752 18.5837 9.52907 18.5837 10C18.5837 14.464 14.9643 18.0833 10.5003 18.0833C6.03631 18.0833 2.41699 14.464 2.41699 10C2.41699 5.53599 6.03631 1.91667 10.5003 1.91667Z"
                    fill="#FFC107"
                    stroke="#FFC107"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M3.12793 6.12125L5.86585 8.12917C6.60668 6.29501 8.40085 5.00001 10.5004 5.00001C11.775 5.00001 12.9346 5.48084 13.8175 6.26625L16.1746 3.90917C14.6863 2.52209 12.6954 1.66667 10.5004 1.66667C7.2996 1.66667 4.52376 3.47375 3.12793 6.12125Z"
                    fill="#FF3D00"
                  />
                  <path
                    d="M10.4998 18.3333C12.6523 18.3333 14.6081 17.5096 16.0869 16.17L13.5077 13.9875C12.6429 14.6452 11.5862 15.0009 10.4998 15C8.3323 15 6.49189 13.6179 5.79855 11.6892L3.08105 13.7829C4.46022 16.4817 7.26105 18.3333 10.4998 18.3333Z"
                    fill="#4CAF50"
                  />
                  <path
                    d="M18.6713 8.36791H18V8.33333H10.5V11.6667H15.2096C14.8809 12.5902 14.2889 13.3972 13.5067 13.9879L13.5079 13.9871L16.0871 16.1696C15.9046 16.3354 18.8333 14.1667 18.8333 9.99999C18.8333 9.44124 18.7758 8.89583 18.6713 8.36791Z"
                    fill="#1976D2"
                  />
                </svg>
                <span>Sign in with Google</span>
              </a>

              {/* Forgot Password */}
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center text-text/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-primary-dark transition-colors duration-300 group"
                >
                  <span>Forgot your password?</span>
                  <span className="font-bold ml-1 group-hover:translate-x-1 transition-transform duration-300">
                    Reset Here
                  </span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
