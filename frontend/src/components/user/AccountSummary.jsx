import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import {
  FaEye,
  FaDollarSign,
  FaUsers,
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
  FaCommentDots,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Sparkles, Zap, ArrowRight, AlertTriangle } from "lucide-react";
import {
  accountVerificationEmailAPI,
  userProfileAPI,
} from "../../APIservices/users/userAPI";
import AlertMessage from "../alerts/AlertMessage";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AccountSummaryDashboard = () => {
  const {
    data: userData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: userProfileAPI,
  });

  console.log("User Data:", userData);

  const hasEmail = userData?.user?.email ? true : false;
  const hasPlan = true;
  const isEmailVerified = userData?.user?.isEmailVerified
    ? userData?.user?.isEmailVerified
    : false;

  const totalFollowers = userData?.user?.followers?.length || 0;
  const totalFollowing = userData?.user?.following?.length || 0;
  const userPosts = userData?.user?.posts || [];

  let totalViews = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let totalDislikes = 0;

  userData?.user?.posts.forEach((post) => {
    totalViews += post?.viewers?.length || 0;
    totalLikes += post?.likes?.length || 0;
    totalComments += post?.comments?.length || 0;
    totalDislikes += post?.dislikes?.length || 0;
  });

  const stats = [
    {
      icon: <FaEye className="h-6 w-6" />,
      label: "Views",
      value: totalViews,
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-500/10 dark:bg-blue-400/10",
    },

    {
      icon: <FaUsers className="h-6 w-6" />,
      label: "Followers",
      value: totalFollowers || 0,
      color: "text-purple-500 dark:text-purple-400",
      bgColor: "bg-purple-500/10 dark:bg-purple-400/10",
    },
    {
      icon: <FaThumbsUp className="h-6 w-6" />,
      label: "Likes",
      value: totalLikes || 0,
      color: "text-yellow-500 dark:text-yellow-400",
      bgColor: "bg-yellow-500/10 dark:bg-yellow-400/10",
    },
    {
      icon: <FaThumbsDown className="h-6 w-6" />,
      label: "Dislikes",
      value: totalDislikes || 0,
      color: "text-red-500 dark:text-red-400",
      bgColor: "bg-red-500/10 dark:bg-red-400/10",
    },
    {
      icon: <FaUsers className="h-6 w-6" />,
      label: "Following",
      value: totalFollowing || 0,
      color: "text-indigo-500 dark:text-indigo-400",
      bgColor: "bg-indigo-500/10 dark:bg-indigo-400/10",
    },
    {
      icon: <FaFlag className="h-6 w-6" />,
      label: "Posts",
      value: userPosts?.length || 0,
      color: "text-pink-500 dark:text-pink-400",
      bgColor: "bg-pink-500/10 dark:bg-pink-400/10",
    },
    {
      icon: <FaCommentDots className="h-6 w-6" />,
      label: "Comments",
      value: totalComments || 0,
      color: "text-teal-500 dark:text-teal-400",
      bgColor: "bg-teal-500/10 dark:bg-teal-400/10",
    },
  ];

  const verificationTokenMutation = useMutation({
    mutationKey: ["send-email-verification-token"],
    mutationFn: accountVerificationEmailAPI,
  });

  const handleSendVerificationEmail = async () => {
    verificationTokenMutation.mutate();
  };

  console.log(verificationTokenMutation);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 dark:from-primary-dark/20 dark:via-primary-dark/10 dark:to-secondary-dark/20 p-8 border border-primary/20 dark:border-primary-dark/20">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 dark:from-primary-dark/20 dark:via-primary-dark/10 dark:to-secondary-dark/20"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 ring-4 ring-bg dark:ring-bg-dark shadow-xl">
                <AvatarImage src={userData?.user?.profilePicture?.path} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-bg dark:text-bg-dark font-bold text-xl">
                  {userData?.user?.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-text dark:text-text-dark">
                  Welcome Back: {userData?.user?.username || "User"}!
                  <Sparkles className="inline h-6 w-6 ml-2 text-accent dark:text-accent-dark" />
                </h1>
                <p className="text-text/70 dark:text-text-dark/70 mt-1">
                  Ready to create amazing content?
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-primary/30 dark:bg-primary-dark/30 text-primary dark:text-primary-dark px-4 py-2 text-sm font-medium border border-primary/40 dark:border-primary-dark/40">
                {userData?.user?.role?.charAt(0)?.toUpperCase() +
                  userData?.user?.role?.slice(1) || "User"}
              </Badge>
              <div className="flex items-center space-x-2 bg-bg/70 dark:bg-bg-dark/70 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20 dark:border-primary-dark/20">
                <div className="w-2 h-2 bg-accent dark:bg-accent-dark rounded-full animate-pulse"></div>
                <span className="text-sm text-text/80 dark:text-text-dark/80 font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {verificationTokenMutation.isPending && (
        <Alert className="border-primary/50 dark:border-primary-dark/50 bg-primary/5 dark:bg-primary-dark/5">
          <Zap className="h-4 w-4 text-primary dark:text-primary-dark" />
          <AlertTitle className="text-primary dark:text-primary-dark">
            Loading...
          </AlertTitle>
          <AlertDescription className="text-text dark:text-text-dark">
            Please wait while we are processing your request
          </AlertDescription>
        </Alert>
      )}

      {verificationTokenMutation.isError && (
        <Alert className="border-red-500/50 dark:border-red-400/50 bg-red-500/5 dark:bg-red-400/5">
          <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
          <AlertTitle className="text-red-500 dark:text-red-400">
            Error
          </AlertTitle>
          <AlertDescription className="text-text dark:text-text-dark">
            {verificationTokenMutation?.error?.message ||
              verificationTokenMutation?.error?.response?.data?.message}
          </AlertDescription>
        </Alert>
      )}

      {verificationTokenMutation.isSuccess && (
        <Alert className="border-green-500/50 dark:border-green-400/50 bg-green-500/5 dark:bg-green-400/5">
          <Zap className="h-4 w-4 text-green-500 dark:text-green-400" />
          <AlertTitle className="text-green-500 dark:text-green-400">
            Success
          </AlertTitle>
          <AlertDescription className="text-text dark:text-text-dark">
            {verificationTokenMutation?.data?.message}
          </AlertDescription>
        </Alert>
      )}

      {!isEmailVerified &&
        !verificationTokenMutation.isSuccess &&
        !verificationTokenMutation.isError &&
        !verificationTokenMutation.isPending && (
          <Alert className="border-red-500/50 dark:border-red-400/50 bg-red-500/5 dark:bg-red-400/5">
            <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400 " />
            <p className="text-red-500 dark:text-red-400">
              Account Verification Needed
            </p>
            <AlertDescription className="text-text dark:text-text-dark">
              Your account is not verified. Please{" "}
              <button
                onClick={handleSendVerificationEmail}
                className="underline text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors font-medium"
              >
                verify your account
              </button>
              for full access.
            </AlertDescription>
          </Alert>
        )}

      {!hasEmail && (
        <Alert className="border-blue-500/50 dark:border-blue-400/50 bg-blue-500/5 dark:bg-blue-400/5">
          <AlertTriangle className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          <AlertTitle className="text-blue-500 dark:text-blue-400">
            Email Required
          </AlertTitle>
          <AlertDescription className="text-text dark:text-text-dark">
            Please{" "}
            <Link
              to="/add-email"
              className="underline text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors font-medium"
            >
              add an email
            </Link>{" "}
            to your account for important notifications.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="group bg-bg dark:bg-bg-dark border-primary/10 dark:border-primary-dark/10 shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] cursor-pointer overflow-hidden"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div
                  className={`p-3 rounded-xl ${stat.bgColor} transition-all duration-300 group-hover:scale-110`}
                >
                  <div className={stat.color}>{stat.icon}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-text dark:text-text-dark">
                    {stat.value}
                  </div>
                  <div className="text-sm text-text/60 dark:text-text-dark/60">
                    {stat.label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccountSummaryDashboard;
