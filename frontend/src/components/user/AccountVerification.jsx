import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verifyUserAccountAPI } from "../../APIservices/users/userAPI";
import AlertMessage from "../alerts/AlertMessage";
import { Sparkles, Zap, ArrowRight } from "lucide-react";

const AccountVerification = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  const { token } = useParams();

  const verifyAccountMutation = useMutation({
    mutationKey: ["verify-account"],
    mutationFn: verifyUserAccountAPI,
  });

  useEffect(() => {
    if (token) {
      verifyAccountMutation.mutate(token);
    }
  }, []);

  console.log(verifyAccountMutation);

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark">
      {verifyAccountMutation?.isPending ? (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-bg dark:bg-bg-dark p-8 rounded-2xl shadow-2xl border border-primary/20 dark:border-primary-dark/20 w-full max-w-md text-center backdrop-blur-sm">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary/30 dark:border-primary-dark/30 border-t-primary dark:border-t-primary-dark animate-spin"></div>
              <Zap className="absolute inset-0 m-auto h-6 w-6 text-primary dark:text-primary-dark animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-2">
              Verifying Account
            </h2>
            <p className="text-text/70 dark:text-text-dark/70">
              Please wait while we verify your account...
            </p>
            <div className="mt-6 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      ) : verifyAccountMutation.isError ? (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-bg dark:bg-bg-dark p-8 rounded-2xl shadow-2xl border border-secondary/30 dark:border-secondary-dark/30 w-full max-w-md text-center backdrop-blur-sm">
            <div className="w-16 h-16 mx-auto mb-6 bg-secondary/10 dark:bg-secondary-dark/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-secondary dark:text-secondary-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-secondary dark:text-secondary-dark mb-2">
              Verification Failed
            </h2>
            <p className="text-text/70 dark:text-text-dark/70 mb-6">
              We couldn't verify your account. The link may have expired or is
              invalid.
            </p>
            <Link to="/login">
              <button className="w-full bg-gradient-to-r from-secondary to-secondary/90 dark:from-secondary-dark dark:to-secondary-dark/90 hover:from-secondary/90 hover:to-secondary dark:hover:from-secondary-dark/90 dark:hover:to-secondary-dark text-bg dark:text-bg-dark font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span>Return to Login</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      ) : (
        verifyAccountMutation.isSuccess && (
          <div
            className={`transition-opacity duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            } flex items-center justify-center h-screen bg-gradient-to-br from-primary/20 via-bg to-secondary/20 dark:from-primary-dark/20 dark:via-bg-dark dark:to-secondary-dark/20 relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 dark:from-primary-dark/10 dark:to-secondary-dark/10"></div>
            <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 dark:bg-primary-dark/20 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-20 right-20 w-64 h-64 bg-secondary/20 dark:bg-secondary-dark/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>

            <div className="bg-bg/95 dark:bg-bg-dark/95 p-10 rounded-2xl shadow-2xl border border-primary/20 dark:border-primary-dark/20 w-full max-w-md text-center backdrop-blur-xl relative z-10">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary-dark/20 dark:to-secondary-dark/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-primary/10 dark:ring-primary-dark/10">
                  <FaCheckCircle className="text-primary dark:text-primary-dark text-4xl animate-bounce" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent dark:bg-accent-dark rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-bg dark:text-bg-dark" />
                </div>
              </div>

              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark bg-clip-text text-transparent mb-3">
                Account Verified!
              </h2>
              <p className="text-text/80 dark:text-text-dark/80 mb-8 leading-relaxed">
                Congratulations! Your account has been successfully verified.
                You now have full access to all features.
              </p>

              {(verifyAccountMutation?.data?.userRole === "admin" ||
                verifyAccountMutation?.data?.userRole === "teacher") && (
                <Link to="/dashboard">
                  <button className="w-full bg-gradient-to-r from-primary to-primary/90 dark:from-primary-dark dark:to-primary-dark/90 hover:from-primary/90 hover:to-primary dark:hover:from-primary-dark/90 dark:hover:to-primary-dark text-bg dark:text-bg-dark font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 group">
                    <AiOutlineDashboard className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                    <span>Go to Dashboard</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
              )}

              {verifyAccountMutation?.data?.userRole === "student" && (
                <Link to="/student-dashboard">
                  <button className="w-full bg-gradient-to-r from-primary to-primary/90 dark:from-primary-dark dark:to-primary-dark/90 hover:from-primary/90 hover:to-primary dark:hover:from-primary-dark/90 dark:hover:to-primary-dark text-bg dark:text-bg-dark font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 group">
                    <AiOutlineDashboard className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                    <span>Go to Dashboard</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
              )}

              <div className="mt-6 p-4 bg-gradient-to-r from-accent/10 to-yellow/10 dark:from-accent-dark/10 dark:to-yellow/10 rounded-xl border border-accent/20 dark:border-accent-dark/20">
                <div className="flex items-center justify-center space-x-2 text-accent dark:text-accent-dark">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Ready to explore!</span>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AccountVerification;
