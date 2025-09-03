import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaUsers,
  FaEye,
  FaThumbsUp,
  FaCommentDots,
  FaLightbulb,
  FaTrophy,
  FaCalendarAlt,
  FaBookOpen,
  FaChartLine,
  FaRocket,
} from "react-icons/fa";
import {
  TrendingUp,
  Target,
  Calendar,
  Lightbulb,
  Trophy,
  BookOpen,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Star,
  Zap,
  Clock,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

import { GoogleGenAI } from "@google/genai";

import {
  accountVerificationEmailAPI,
  userProfileAPI,
} from "../../../APIservices/users/userAPI";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRandomQuoteAndTips } from "../../../APIservices/geminiAPI/geminiAPI";

const StudentAccountSummary = () => {
  const userAuth = useSelector((state) => state.auth.userAuth);

  const {
    data: userProfileData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: userProfileAPI,
  });

  const {
    data: quoteAndTips,
    isLoading: isQuoteAndTipsLoading,
    isError: isQuoteAndTipsError,
  } = useQuery({
    queryFn: () => getRandomQuoteAndTips(),
    queryKey: ["quote-and-tips"],
  });

  //   console.log("Quote and Tips ", quoteAndTips);

  const userData = {
    username: userProfileData?.user?.username || "Student",
    role: userProfileData?.user?.role || "student",
    isEmailVerified: userProfileData?.user?.isEmailVerified || false,
    following: userProfileData?.user?.following || [],
    posts: userProfileData?.user?.posts || [],
    currentStreak: userProfileData?.user?.currentStreak || 0,
    totalPoints: userProfileData?.user?.totalPoints || 0,
    achievements: userProfileData?.user?.achievements || 0,
    profilePicture: userProfileData?.user?.profilePicture?.path,
    competitionEntries: userProfileData?.user?.competitionEntries || 0,
    maxEntries: userProfileData?.user?.maxEntries || 5,
    projectsCompleted: userProfileData?.user?.projectsCompleted || 0,
    maxProjects: userProfileData?.user?.maxProjects || 5,
  };

  const stats = [
    {
      icon: <Users className="h-6 w-6" />,
      label: "Following",
      value: userData?.following?.length,
      color: "text-primary dark:text-primary-dark",
      bgColor: "bg-primary/10 dark:bg-primary-dark/10",
    },
  ];

  const quickActions = [
    {
      title: "Study Resources",
      description: "Access learning materials",
      icon: <BookOpen className="h-6 w-6" />,
      href: "/student-dashboard/resources",
      color:
        "from-primary/20 to-primary/10 dark:from-primary-dark/20 dark:to-primary-dark/10",
      textColor: "text-primary dark:text-primary-dark",
    },
    {
      title: "Smart Daily Planner",
      description: "Plan your Day Smarlty",
      icon: <Users className="h-6 w-6" />,
      href: "/student-dashboard/daily-planner",
      color:
        "from-secondary/20 to-secondary/10 dark:from-secondary-dark/20 dark:to-secondary-dark/10",
      textColor: "text-secondary dark:text-secondary-dark",
    },
    {
      title: "AI Assistance",
      description: "Learn With AI",
      icon: <Target className="h-6 w-6" />,
      href: "/student-dashboard/ai-assistant",
      color:
        "from-accent/20 to-accent/10 dark:from-accent-dark/20 dark:to-accent-dark/10",
      textColor: "text-accent dark:text-accent-dark",
    },
  ];

  //* Email Verification
  const verificationTokenMutation = useMutation({
    mutationKey: ["verify-email"],
    mutationFn: accountVerificationEmailAPI,
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-yellow/20 dark:from-primary-dark/20 dark:via-primary-dark/10 dark:to-yellow-dark/20 p-8 border border-primary/20 dark:border-primary-dark/20">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/20 via-primary/10 to-yellow/20 dark:from-primary-dark/20 dark:via-primary-dark/10 dark:to-yellow-dark/20"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 ring-4 ring-bg dark:ring-bg-dark shadow-xl">
                <AvatarImage src={userData?.profilePicture} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-yellow text-bg font-bold text-xl">
                  {userData.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-text dark:text-text-dark">
                  Welcome back, {userData.username}!
                  <Sparkles className="inline h-6 w-6 ml-2 text-accent dark:text-accent-dark" />
                </h1>
                <p className="text-text/70 dark:text-text-dark/70 mt-1">
                  Ready to take your learning to the next level?
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-primary/30 dark:bg-primary-dark/30 text-primary dark:text-primary-dark px-4 py-2 text-sm font-medium border border-primary/40 dark:border-primary-dark/40">
                {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
              </Badge>
              <div className="flex items-center space-x-2 bg-bg/70 dark:bg-bg-dark/70 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20 dark:border-primary-dark/20">
                <div className="w-2 h-2 bg-accent dark:bg-accent-dark rounded-full animate-pulse"></div>
                <span className="text-sm text-text/80 dark:text-text-dark/80 font-medium">
                  Learning Mode
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Verification Alert */}

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

      {!userData.isEmailVerified &&
        !verificationTokenMutation.isSuccess &&
        !verificationTokenMutation.isError &&
        !verificationTokenMutation.isPending && (
          <Alert className="border-secondary/50 dark:border-secondary-dark/50 bg-secondary/5 dark:bg-secondary-dark/5">
            <AlertTitle className="text-secondary dark:text-secondary-dark flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Account Verification Needed
            </AlertTitle>
            <AlertDescription className="text-text dark:text-text-dark">
              Verify your email for the best experience.
              <button
                onClick={async () => await verificationTokenMutation.mutate()}
                className="underline text-primary dark:text-primary-dark hover:text-secondary dark:hover:text-secondary-dark transition-colors font-medium cursor-pointer"
              >
                Verify now →
              </button>
            </AlertDescription>
          </Alert>
        )}

      {/* Daily Inspiration */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary-dark/5 dark:to-secondary-dark/5 border-primary/20 dark:border-primary-dark/20 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 dark:bg-primary-dark/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary dark:text-primary-dark" />
              </div>
              <CardTitle className="text-lg text-text dark:text-text-dark">
                Daily Inspiration
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <blockquote className="text-text dark:text-text-dark italic leading-relaxed text-base">
              {quoteAndTips?.data?.quote}
            </blockquote>
            <p className="mt-4 text-sm text-primary dark:text-primary-dark font-semibold">
              By {quoteAndTips?.data?.author}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 via-transparent to-primary/5 dark:from-accent-dark/5 dark:to-primary-dark/5 border-accent/20 dark:border-accent-dark/20 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent/10 dark:bg-accent-dark/10 rounded-lg">
                <Lightbulb className="h-5 w-5 text-accent dark:text-accent-dark" />
              </div>
              <CardTitle className="text-lg text-text dark:text-text-dark">
                💡 Pro Tip of the Day
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-text dark:text-text-dark leading-relaxed">
              {quoteAndTips?.data?.studyTip}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-accent dark:text-accent-dark hover:bg-accent/10 dark:hover:bg-accent-dark/10 p-0 font-medium"
              asChild
            >
              <Link to="/student-dashboard/resources">
                Explore resources <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
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
                  {stat.change && (
                    <div className="text-xs text-accent dark:text-accent-dark mt-1 font-medium">
                      {stat.change}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-bg dark:bg-bg-dark border-primary/10 dark:border-primary-dark/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-text dark:text-text-dark flex items-center">
            <Rocket className="h-6 w-6 mr-2 text-primary dark:text-primary-dark" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="group block p-6 rounded-xl bg-gradient-to-br border border-transparent hover:border-primary/20 dark:hover:border-primary-dark/20 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${action.color
                    .split(" ")
                    .join(", ")})`,
                }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-lg bg-bg/20 dark:bg-bg-dark/20 group-hover:bg-bg/30 dark:group-hover:bg-bg-dark/30 transition-all duration-300 ${action.textColor}`}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text dark:text-text-dark group-hover:translate-x-1 transition-transform duration-300">
                      {action.title}
                    </h3>
                    <p className="text-sm text-text/70 dark:text-text-dark/70 mt-1">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text/40 dark:text-text-dark/40 group-hover:text-text/70 dark:group-hover:text-text-dark/70 group-hover:translate-x-1 transition-all duration-300 ml-auto" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAccountSummary;
