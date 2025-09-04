import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Brain,
  Target,
  Zap,
  BookOpen,
  Coffee,
  Lightbulb,
  CheckCircle,
  RefreshCw,
  Loader2,
  Star,
  TrendingUp,
  Settings,
  Sparkles,
  User,
} from "lucide-react";

import {
  getStudentProfileAPI,
  generateDailyPlannerAPI,
} from "../../../APIservices/users/studentAPI";

const SmartDailyPlanner = () => {
  const userAuth = useSelector((state) => state.auth.userAuth);
  const [dailyPlan, setDailyPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [completedGoals, setCompletedGoals] = useState(new Set());

  const {
    data: profileResponse,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["student-profile"],
    queryFn: getStudentProfileAPI,
  });

  const profileData = profileResponse?.studentProfile;
  console.log("ProfileData ", profileData);

  useEffect(() => {
    if (profileData?.dailyPlanner) {
      setDailyPlan(profileData.dailyPlanner);
    }
  }, [profileData]);

  // Mutation to generate daily planner
  const generatePlannerMutation = useMutation({
    mutationKey: ["generate-daily-planner"],
    mutationFn: generateDailyPlannerAPI,
    onSuccess: (response) => {
      setDailyPlan(response.data);
      setIsGenerating(false);
    },
    onError: () => {
      setIsGenerating(false);
    },
  });

  const handleGeneratePlanner = () => {
    if (profileData) {
      setIsGenerating(true);
      generatePlannerMutation.mutate();
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "study":
        return <BookOpen className="h-5 w-5" />;
      case "break":
        return <Coffee className="h-5 w-5" />;
      case "review":
        return <Target className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type, priority) => {
    if (type === "break")
      return "bg-accent/10 dark:bg-accent-dark/10 border-accent/30 dark:border-accent-dark/30";
    if (type === "review")
      return "bg-secondary/10 dark:bg-secondary-dark/10 border-secondary/30 dark:border-secondary-dark/30";
    if (priority === "high")
      return "bg-primary/15 dark:bg-primary-dark/15 border-primary/40 dark:border-primary-dark/40";
    return "bg-primary/10 dark:bg-primary-dark/10 border-primary/30 dark:border-primary-dark/30";
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: "bg-secondary/20 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-dark",
      medium:
        "bg-accent/20 dark:bg-accent-dark/20 text-accent dark:text-accent-dark",
      low: "bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark",
    };
    return colors[priority] || colors.medium;
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-dark" />
      </div>
    );
  }

  if (profileError || !profileData) {
    return (
      <Alert className="border-secondary/50 dark:border-secondary-dark/50 bg-secondary/5 dark:bg-secondary-dark/5">
        <AlertDescription className="text-text dark:text-text-dark">
          Please complete your student profile first to generate a personalized
          daily planner.
        </AlertDescription>
      </Alert>
    );
  }

  const toggleGoal = (index) => {
    setCompletedGoals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 dark:from-primary-dark/30 dark:via-primary-dark/20 dark:to-accent-dark/30 p-6 border border-primary/30 dark:border-primary-dark/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/20 dark:bg-primary-dark/30 rounded-xl border border-primary/20 dark:border-primary-dark/30">
              <Brain className="h-8 w-8 text-primary dark:text-primary-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text dark:text-text-dark">
                Smart Daily Planner
                <Sparkles className="inline h-6 w-6 ml-2 text-accent dark:text-accent-dark" />
              </h1>
              <p className="text-text/70 dark:text-text-dark/70 mt-1">
                AI-powered personalized study schedule for optimal learning
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-primary/30 dark:bg-primary-dark/40 text-primary dark:text-primary-dark px-4 py-2 text-sm font-medium border border-primary/40 dark:border-primary-dark/50">
              {profileData.chronotype}
            </Badge>
            <Badge className="bg-accent/30 dark:bg-accent-dark/40 text-accent dark:text-accent-dark px-4 py-2 text-sm font-medium border border-accent/40 dark:border-accent-dark/50">
              Energy: {profileData.energyLevel}/10
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-text dark:text-text-dark flex items-center">
              <User className="h-5 w-5 mr-2 text-primary dark:text-primary-dark" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center justify-between">
              <span className="text-text/70 dark:text-text-dark/70">
                Subjects:
              </span>
              <span className="font-medium text-text dark:text-text-dark">
                {profileData.subjects?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text/70 dark:text-text-dark/70">
                Study Hours:
              </span>
              <span className="font-medium text-text dark:text-text-dark">
                {profileData.preferredStudyStartTime} -{" "}
                {profileData.preferredStudyEndTime}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text/70 dark:text-text-dark/70">
                Current Mood:
              </span>
              <Badge className="bg-secondary/20 dark:bg-secondary-dark/30 text-secondary dark:text-secondary-dark border border-secondary/30 dark:border-secondary-dark/40">
                {profileData.currentMood}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 dark:from-accent-dark/20 dark:to-primary-dark/20 border-accent/30 dark:border-accent-dark/40">
          <CardContent className="p-6 text-center">
            <div className="mb-6">
              <div className="p-4 bg-accent/20 dark:bg-accent-dark/30 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4 border border-accent/30 dark:border-accent-dark/40">
                <Sparkles className="h-10 w-10 text-accent dark:text-accent-dark" />
              </div>
              <h3 className="text-xl font-bold text-text dark:text-text-dark mb-2">
                Ready to Optimize Your Day?
              </h3>
              <p className="text-text/70 dark:text-text-dark/70">
                Generate your personalized AI-powered study schedule
              </p>
            </div>
            <Button
              onClick={handleGeneratePlanner}
              disabled={isGenerating || generatePlannerMutation.isPending}
              className="bg-accent dark:bg-accent-dark text-bg dark:text-bg-dark hover:bg-accent/90 dark:hover:bg-accent-dark/90 px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isGenerating || generatePlannerMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  Generate Smart Planner
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {dailyPlan && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/10 via-transparent to-accent/10 dark:from-primary-dark/20 dark:to-accent-dark/20 border-primary/30 dark:border-primary-dark/40 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-text dark:text-text-dark flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-primary dark:text-primary-dark" />
                  Today's Plan - {dailyPlan.todayDate}
                </CardTitle>
                <Button
                  onClick={handleGeneratePlanner}
                  variant="outline"
                  size="sm"
                  className="border-primary/40 dark:border-primary-dark/50 text-primary dark:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Regenerate
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-bg/50 dark:bg-bg-dark/50 rounded-lg border border-primary/30 dark:border-primary-dark/40">
                <h4 className="font-semibold text-text dark:text-text-dark mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-accent dark:text-accent-dark" />
                  AI Motivation
                </h4>
                <p className="text-text dark:text-text-dark leading-relaxed">
                  {dailyPlan.overallMotivation}
                </p>
              </div>

              <div className="p-4 bg-bg/50 dark:bg-bg-dark/50 rounded-lg border border-primary/30 dark:border-primary-dark/40">
                <h4 className="font-semibold text-text dark:text-text-dark mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-primary dark:text-primary-dark" />
                  Today's Focus
                </h4>
                <p className="text-text dark:text-text-dark leading-relaxed">
                  {dailyPlan.recommendedFocus}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-text dark:text-text-dark flex items-center">
                <Clock className="h-6 w-6 mr-2 text-primary dark:text-primary-dark" />
                Your Optimized Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyPlan.schedule.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md hover:scale-[1.01] ${getActivityColor(
                      item.type,
                      item.priority
                    )}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-bg/30 dark:bg-bg-dark/30 rounded-lg border border-primary/20 dark:border-primary-dark/30">
                          {getActivityIcon(item.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-text dark:text-text-dark">
                            {item.activity}
                          </h4>
                          <p className="text-sm text-text/60 dark:text-text-dark/60">
                            {item.timeSlot} • {item.duration} minutes
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {item.subject && (
                          <Badge className="bg-primary/20 dark:bg-primary-dark/30 text-primary dark:text-primary-dark border border-primary/30 dark:border-primary-dark/40">
                            {item.subject}
                          </Badge>
                        )}
                        {item.priority && (
                          <Badge className={getPriorityBadge(item.priority)}>
                            {item.priority}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-text dark:text-text-dark mb-2">
                      {item.description}
                    </p>

                    {item.tips && (
                      <div className="bg-bg/50 dark:bg-bg-dark/50 rounded-lg p-3 border border-primary/20 dark:border-primary-dark/30">
                        <p className="text-sm text-text/80 dark:text-text-dark/80 italic">
                          💡 {item.tips}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-text dark:text-text-dark flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-primary dark:text-primary-dark" />
                  Daily Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyPlan.dailyGoals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-primary/5 dark:bg-primary-dark/10 rounded-lg hover:bg-primary/10 dark:hover:bg-primary-dark/15 transition-colors cursor-pointer border border-primary/20 dark:border-primary-dark/30"
                      onClick={() => toggleGoal(index)}
                    >
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          completedGoals.has(index)
                            ? "bg-primary dark:bg-primary-dark border-primary dark:border-primary-dark"
                            : "border-primary/50 dark:border-primary-dark/50 hover:border-primary dark:hover:border-primary-dark"
                        }`}
                      >
                        {completedGoals.has(index) && (
                          <CheckCircle className="h-3 w-3 text-bg dark:text-bg-dark" />
                        )}
                      </div>
                      <span
                        className={`text-text dark:text-text-dark transition-all ${
                          completedGoals.has(index)
                            ? "line-through opacity-60"
                            : ""
                        }`}
                      >
                        {goal}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-text dark:text-text-dark flex items-center">
                  <Star className="h-5 w-5 mr-2 text-accent dark:text-accent-dark" />
                  AI Study Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyPlan.studyTips.map((tip, index) => (
                    <div
                      key={index}
                      className="p-3 bg-accent/5 dark:bg-accent-dark/10 rounded-lg border border-accent/30 dark:border-accent-dark/40"
                    >
                      <p className="text-text dark:text-text-dark">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!dailyPlan && !isGenerating && (
        <Card className="bg-gradient-to-br from-primary/10 via-transparent to-accent/10 dark:from-primary-dark/20 dark:to-accent-dark/20 border-primary/30 dark:border-primary-dark/40 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="p-6 bg-primary/10 dark:bg-primary-dark/20 rounded-full mx-auto w-24 h-24 flex items-center justify-center mb-6 border border-primary/30 dark:border-primary-dark/40">
              <Calendar className="h-12 w-12 text-primary dark:text-primary-dark" />
            </div>
            <h3 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
              Ready to Plan Your Perfect Study Day?
            </h3>
            <p className="text-text/70 dark:text-text-dark/70 mb-6 max-w-md mx-auto">
              Our AI will analyze your profile, energy levels, and subjects to
              create an optimized study schedule just for you.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-text/60 dark:text-text-dark/60">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-accent dark:text-accent-dark" />
                Personalized timing
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-accent dark:text-accent-dark" />
                Smart breaks
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-accent dark:text-accent-dark" />
                Priority-based
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center pb-4">
        <Button
          variant="outline"
          className="border-primary/40 dark:border-primary-dark/50 text-primary dark:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10"
        >
          <Settings className="h-4 w-4 mr-2" />
          Adjust Profile Settings
        </Button>
      </div>
    </div>
  );
};

export default SmartDailyPlanner;
