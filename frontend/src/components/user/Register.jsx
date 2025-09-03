import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "../../APIservices/users/userAPI";
import AlertMessage from "../alerts/AlertMessage";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";
import { useState, useMemo } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //* User Mutation
  const userMutation = useMutation({
    mutationKey: ["register-user"],
    mutationFn: registerAPI,
  });

  //* Password strength calculation
  const getPasswordStrength = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach((check) => check && score++);

    return {
      score,
      checks,
      strength: score <= 2 ? "weak" : score <= 4 ? "medium" : "strong",
    };
  };

  //* Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      const { confirmPassword, ...submitData } = values;
      userMutation
        .mutateAsync(submitData)
        .then(() => {
          //* Redirect to login page after successful registration
          navigate("/login");
        })
        .catch((error) => {
          console.error("Error during registration:", error);
        });
    },
  });

  const passwordStrength = useMemo(
    () =>
      formik.values.password
        ? getPasswordStrength(formik.values.password)
        : null,
    [formik.values.password]
  );

  const strengthColor = {
    weak: "text-secondary dark:text-secondary-dark",
    medium: "text-accent dark:text-accent-dark",
    strong: "text-primary dark:text-primary-dark",
  };

  const strengthBgColor = {
    weak: "bg-secondary/20 dark:bg-secondary-dark/20",
    medium: "bg-accent/20 dark:bg-accent-dark/20",
    strong: "bg-primary/20 dark:bg-primary-dark/20",
  };

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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent dark:from-primary-dark dark:to-accent-dark rounded-2xl mb-4 shadow-lg">
                <User className="h-8 w-8 text-bg dark:text-bg-dark" />
              </div>
              <h1 className="text-3xl font-bold text-text dark:text-text-dark mb-2">
                Join Us Today
              </h1>
              <p className="text-text/70 dark:text-text-dark/70">
                Start your learning journey with us
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Navigation Link */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-text/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-primary-dark transition-colors duration-300 group"
                >
                  <span>Already have an account?</span>
                  <span className="font-bold ml-1 group-hover:translate-x-1 transition-transform duration-300">
                    Login
                  </span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {/* Alerts */}
              {userMutation.isPending && (
                <div className="relative">
                  <AlertMessage type="loading" message="Creating user..." />
                  <div className="absolute inset-0 flex items-center justify-center bg-bg/50 dark:bg-bg-dark/50 backdrop-blur-sm rounded-lg">
                    <Loader2 className="h-6 w-6 animate-spin text-primary dark:text-primary-dark" />
                  </div>
                </div>
              )}

              {userMutation.isSuccess && (
                <div className="animate-fade-in">
                  <AlertMessage
                    type="success"
                    message="User created successfully!"
                  />
                </div>
              )}

              {userMutation.isError && (
                <div className="animate-shake">
                  <AlertMessage
                    type="error"
                    message={userMutation?.error?.response?.data?.message}
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
                    placeholder="Choose a username"
                    {...formik.getFieldProps("username")}
                  />
                </div>
                {formik.touched.username && formik.errors.username && (
                  <div className="text-secondary dark:text-secondary-dark text-sm font-medium animate-fade-in">
                    {formik.errors.username}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text dark:text-text-dark">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40 dark:text-text-dark/40 group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors duration-300">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-bg/50 dark:bg-bg-dark/50 border border-primary/20 dark:border-primary-dark/20 rounded-2xl outline-none text-text dark:text-text-dark placeholder-text/50 dark:placeholder-text-dark/50 focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary-dark/30 focus:border-primary dark:focus:border-primary-dark transition-all duration-300 backdrop-blur-sm"
                    type="email"
                    placeholder="Enter your email"
                    {...formik.getFieldProps("email")}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <div className="text-secondary dark:text-secondary-dark text-sm font-medium animate-fade-in">
                    {formik.errors.email}
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
                    placeholder="Create a strong password"
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

                {/* Password Strength Indicator */}
                {formik.values.password && passwordStrength && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center space-x-2">
                      <Shield
                        className={`h-4 w-4 ${
                          strengthColor[passwordStrength.strength]
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          strengthColor[passwordStrength.strength]
                        }`}
                      >
                        Password{" "}
                        {passwordStrength.strength === "weak"
                          ? "Weak"
                          : passwordStrength.strength === "medium"
                          ? "Medium"
                          : "Strong"}
                      </span>
                    </div>

                    {/* Strength Progress Bar */}
                    <div className="w-full bg-text/10 dark:bg-text-dark/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength === "weak"
                            ? "bg-secondary dark:bg-secondary-dark"
                            : passwordStrength.strength === "medium"
                            ? "bg-accent dark:bg-accent-dark"
                            : "bg-primary dark:bg-primary-dark"
                        }`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      ></div>
                    </div>

                    {/* Password Requirements */}
                    <div
                      className={`grid grid-cols-2 gap-2 p-3 rounded-xl ${
                        strengthBgColor[passwordStrength.strength]
                      }`}
                    >
                      {Object.entries(passwordStrength.checks).map(
                        ([key, met]) => (
                          <div
                            key={key}
                            className="flex items-center space-x-2 text-xs"
                          >
                            {met ? (
                              <CheckCircle className="h-3 w-3 text-primary dark:text-primary-dark" />
                            ) : (
                              <XCircle className="h-3 w-3 text-text/40 dark:text-text-dark/40" />
                            )}
                            <span
                              className={
                                met
                                  ? "text-text dark:text-text-dark"
                                  : "text-text/60 dark:text-text-dark/60"
                              }
                            >
                              {key === "length"
                                ? "8+ chars"
                                : key === "uppercase"
                                ? "A-Z"
                                : key === "lowercase"
                                ? "a-z"
                                : key === "numbers"
                                ? "0-9"
                                : "Symbols"}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {formik.touched.password && formik.errors.password && (
                  <div className="text-secondary dark:text-secondary-dark text-sm font-medium animate-fade-in">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text dark:text-text-dark">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40 dark:text-text-dark/40 group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors duration-300">
                    <Shield className="h-5 w-5" />
                  </div>
                  <input
                    className="w-full pl-12 pr-12 py-4 bg-bg/50 dark:bg-bg-dark/50 border border-primary/20 dark:border-primary-dark/20 rounded-2xl outline-none text-text dark:text-text-dark placeholder-text/50 dark:placeholder-text-dark/50 focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary-dark/30 focus:border-primary dark:focus:border-primary-dark transition-all duration-300 backdrop-blur-sm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...formik.getFieldProps("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text/40 dark:text-text-dark/40 hover:text-text dark:hover:text-text-dark transition-colors duration-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {formik.values.confirmPassword && formik.values.password && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      {formik.values.confirmPassword ===
                      formik.values.password ? (
                        <CheckCircle className="h-5 w-5 text-primary dark:text-primary-dark" />
                      ) : (
                        <XCircle className="h-5 w-5 text-secondary dark:text-secondary-dark" />
                      )}
                    </div>
                  )}
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className="text-secondary dark:text-secondary-dark text-sm font-medium animate-fade-in">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </div>

              {/* Register Button */}
              <button
                className="w-full py-4 bg-gradient-to-r from-primary to-primary dark:from-primary-dark dark:to-primary-dark text-bg dark:text-bg-dark font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                type="submit"
                disabled={userMutation.isPending}
              >
                {userMutation.isPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg/10 dark:via-bg-dark/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>

              {/* Google Sign Up */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary/20 dark:border-primary-dark/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-bg dark:bg-bg-dark text-text/60 dark:text-text-dark/60 font-medium">
                    Or sign up with
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
                <span>Sign up with Google</span>
              </a>
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

export default Register;
