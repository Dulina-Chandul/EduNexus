import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Trash2,
  Settings,
  Clock,
  Brain,
  Target,
  Zap,
  Moon,
  Sun,
  User,
  BookOpen,
  Save,
  Loader2,
} from "lucide-react";

import {
  getStudentProfileAPI,
  updateStudentProfileAPI,
} from "../../../APIservices/users/studentAPI";

const StudentProfileSettings = () => {
  const userAuth = useSelector((state) => state.auth.userAuth);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    subjects: [],
    grade: " Grade 10",
    medium: "English",
    chronotype: "Neither",
    energyLevel: 5,
    studyBreakDuration: 15,
    maxStudySessionLength: 90,
    preferredStudyStartTime: "09:00",
    preferredStudyEndTime: "17:00",
    currentMood: "neutral",
    studyEnvironmentPreference: "quiet",
    learningStyle: "visual",
  });

  const [newSubject, setNewSubject] = useState({
    name: "",
    difficulty: "medium",
    studyHoursPerWeek: 1,
    priority: "medium",
  });

  const {
    data: profileResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["student-profile"],
    queryFn: getStudentProfileAPI,
  });

  const profileData = profileResponse?.studentProfile;

  const updateProfileMutation = useMutation({
    mutationFn: updateStudentProfileAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["student-profile"]);
    },
  });

  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  const addSubject = () => {
    if (newSubject.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, { ...newSubject }],
      }));
      setNewSubject({
        name: "",
        difficulty: "medium",
        studyHoursPerWeek: 1,
        priority: "medium",
      });
    }
  };

  const removeSubject = (index) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg dark:bg-bg-dark">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary dark:text-primary-dark" />
          <p className="text-text dark:text-white">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-bg/90 dark:from-bg-dark dark:to-bg-dark/90 p-4 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 dark:from-primary-dark/30 dark:via-primary-dark/20 dark:to-accent-dark/30 p-6 border border-primary/30 dark:border-primary-dark/40">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/20 dark:bg-primary-dark/30 rounded-xl border border-primary/20 dark:border-primary-dark/30">
              <Settings className="h-8 w-8 text-primary dark:text-primary-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text dark:text-text-dark">
                Study Profile Settings
              </h1>
              <p className="text-text/70 dark:text-text-dark/70 mt-1">
                Customize your learning preferences for optimal AI-powered
                planning
              </p>
            </div>
          </div>
        </div>

        {updateProfileMutation.isSuccess && (
          <Alert className="border-green-500/50 bg-green-50 dark:bg-green-900/20 max-w-2xl mx-auto">
            <AlertDescription className="text-green-800 dark:text-green-200 text-center">
              ✅ Profile updated successfully! Your AI planner is now optimized
              for your preferences.
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg">
            <CardTitle className="text-xl text-text dark:text-white flex items-center">
              <User className="h-6 w-6 mr-3 text-orange-600 dark:text-orange-400" />
              You Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-row space-x-4 justify-between">
              <div className="w-1/2">
                <Label className="text-sm font-medium text-text dark:text-white mb-3 block">
                  Grade
                </Label>
                <Input
                  placeholder="e.g. Grade 11"
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      grade: e.target.value,
                    }))
                  }
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white"
                />
              </div>
              <div className="w-1/2">
                <Label className="text-sm font-medium text-text dark:text-white mb-3 block">
                  Medium
                </Label>
                <Input
                  placeholder="e.g. English"
                  value={formData.medium}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      medium: e.target.value,
                    }))
                  }
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary-dark/10 dark:to-accent-dark/10 rounded-t-lg">
              <CardTitle className="text-2xl text-text dark:text-white flex items-center">
                <BookOpen className="h-7 w-7 mr-3 text-primary dark:text-primary-dark" />
                Your Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {formData.subjects.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {formData.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary-dark/10 dark:to-accent-dark/10 rounded-xl border border-primary/20 dark:border-primary-dark/20 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-text dark:text-white text-lg">
                            {subject.name}
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0">
                              {subject.difficulty}
                            </Badge>
                            <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-0">
                              {subject.priority} priority
                            </Badge>
                            <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-0">
                              {subject.studyHoursPerWeek}h/week
                            </Badge>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubject(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-gradient-to-r from-accent/5 to-primary/5 dark:from-accent-dark/10 dark:to-primary-dark/10 p-6 rounded-xl border border-accent/20 dark:border-accent-dark/20">
                <h3 className="text-lg font-semibold text-text dark:text-white mb-4">
                  Add New Subject
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <Label className="text-sm font-medium text-text dark:text-white mb-2 block">
                      Subject Name
                    </Label>
                    <Input
                      placeholder="e.g., Mathematics"
                      value={newSubject.name}
                      onChange={(e) =>
                        setNewSubject((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-text dark:text-white mb-2 block">
                      Difficulty
                    </Label>
                    <Select
                      value={newSubject.difficulty}
                      onValueChange={(value) =>
                        setNewSubject((prev) => ({
                          ...prev,
                          difficulty: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectItem
                          value="easy"
                          className="text-text dark:text-white"
                        >
                          Easy
                        </SelectItem>
                        <SelectItem
                          value="medium"
                          className="text-text dark:text-white"
                        >
                          Medium
                        </SelectItem>
                        <SelectItem
                          value="hard"
                          className="text-text dark:text-white"
                        >
                          Hard
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-text dark:text-white mb-2 block">
                      Priority
                    </Label>
                    <Select
                      value={newSubject.priority}
                      onValueChange={(value) =>
                        setNewSubject((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectItem
                          value="low"
                          className="text-text dark:text-white"
                        >
                          Low Priority
                        </SelectItem>
                        <SelectItem
                          value="medium"
                          className="text-text dark:text-white"
                        >
                          Medium Priority
                        </SelectItem>
                        <SelectItem
                          value="high"
                          className="text-text dark:text-white"
                        >
                          High Priority
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <Label className="text-sm font-medium text-text dark:text-white mb-2">
                      Hours/Week
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={newSubject.studyHoursPerWeek}
                      onChange={(e) =>
                        setNewSubject((prev) => ({
                          ...prev,
                          studyHoursPerWeek: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white"
                    />
                    <Button
                      type="button"
                      onClick={addSubject}
                      className="bg-primary hover:bg-primary/90 dark:bg-primary-dark dark:hover:bg-primary-dark/90 text-white mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg">
                <CardTitle className="text-xl text-text dark:text-white flex items-center">
                  <Clock className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                  Study Timing
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-text dark:text-white mb-3 block">
                    Chronotype
                  </Label>
                  <Select
                    value={formData.chronotype}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, chronotype: value }))
                    }
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectItem
                        value="Early Bird"
                        className="text-text dark:text-white"
                      >
                        <div className="flex items-center">
                          <Sun className="h-4 w-4 mr-2" />
                          Early Bird
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="Night Owl"
                        className="text-text dark:text-white"
                      >
                        <div className="flex items-center">
                          <Moon className="h-4 w-4 mr-2" />
                          Night Owl
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="Neither"
                        className="text-text dark:text-white"
                      >
                        Neither
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-text dark:text-white mb-2 block">
                      Start Time
                    </Label>
                    <Input
                      type="time"
                      value={formData.preferredStudyStartTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferredStudyStartTime: e.target.value,
                        }))
                      }
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-text dark:text-white mb-2 block">
                      End Time
                    </Label>
                    <Input
                      type="time"
                      value={formData.preferredStudyEndTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferredStudyEndTime: e.target.value,
                        }))
                      }
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-t-lg">
                <CardTitle className="text-xl text-text dark:text-white flex items-center">
                  <Brain className="h-6 w-6 mr-3 text-purple-600 dark:text-purple-400" />
                  Learning Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-text dark:text-white mb-3 block">
                    Current Energy Level
                  </Label>
                  <div className="space-y-3">
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.energyLevel}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          energyLevel: parseInt(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text/70 dark:text-white/70">
                        Low
                      </span>
                      <Badge className="bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark border-0">
                        {formData.energyLevel}/10
                      </Badge>
                      <span className="text-sm text-text/70 dark:text-white/70">
                        High
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-text dark:text-white mb-3 block">
                    Current Mood
                  </Label>
                  <Select
                    value={formData.currentMood}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, currentMood: value }))
                    }
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectItem
                        value="motivated"
                        className="text-text dark:text-white"
                      >
                        😃 Motivated
                      </SelectItem>
                      <SelectItem
                        value="neutral"
                        className="text-text dark:text-white"
                      >
                        😐 Neutral
                      </SelectItem>
                      <SelectItem
                        value="tired"
                        className="text-text dark:text-white"
                      >
                        😴 Tired
                      </SelectItem>
                      <SelectItem
                        value="stressed"
                        className="text-text dark:text-white"
                      >
                        😰 Stressed
                      </SelectItem>
                      <SelectItem
                        value="excited"
                        className="text-text dark:text-white"
                      >
                        🤩 Excited
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-t-lg">
              <CardTitle className="text-xl text-text dark:text-white flex items-center">
                <Target className="h-6 w-6 mr-3 text-green-600 dark:text-green-400" />
                Study Session Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium text-text dark:text-white mb-2 block">
                    Max Session Length
                  </Label>
                  <Input
                    type="number"
                    min="30"
                    max="180"
                    step="15"
                    value={formData.maxStudySessionLength}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxStudySessionLength: parseInt(e.target.value) || 90,
                      }))
                    }
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white"
                  />
                  <p className="text-xs text-text/70 dark:text-white/70 mt-1">
                    minutes (30-180)
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-text dark:text-white mb-2 block">
                    Break Duration
                  </Label>
                  <Input
                    type="number"
                    min="5"
                    max="30"
                    step="5"
                    value={formData.studyBreakDuration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        studyBreakDuration: parseInt(e.target.value) || 15,
                      }))
                    }
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white"
                  />
                  <p className="text-xs text-text/70 dark:text-white/70 mt-1">
                    minutes (5-30)
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-text dark:text-white mb-2 block">
                    Learning Style
                  </Label>
                  <Select
                    value={formData.learningStyle}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, learningStyle: value }))
                    }
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectItem
                        value="visual"
                        className="text-text dark:text-white"
                      >
                        👁️ Visual
                      </SelectItem>
                      <SelectItem
                        value="auditory"
                        className="text-text dark:text-white"
                      >
                        👂 Auditory
                      </SelectItem>
                      <SelectItem
                        value="kinesthetic"
                        className="text-text dark:text-white"
                      >
                        ✋ Kinesthetic
                      </SelectItem>
                      <SelectItem
                        value="reading_writing"
                        className="text-text dark:text-white"
                      >
                        📝 Reading/Writing
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-t-lg">
              <CardTitle className="text-xl text-text dark:text-white flex items-center">
                <Zap className="h-6 w-6 mr-3 text-orange-600 dark:text-orange-400" />
                Study Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div>
                <Label className="text-sm font-medium text-text dark:text-white mb-3 block">
                  Preferred Environment
                </Label>
                <Select
                  value={formData.studyEnvironmentPreference}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      studyEnvironmentPreference: value,
                    }))
                  }
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectItem
                      value="quiet"
                      className="text-text dark:text-white"
                    >
                      🔇 Complete Silence
                    </SelectItem>
                    <SelectItem
                      value="background_music"
                      className="text-text dark:text-white"
                    >
                      🎵 Background Music
                    </SelectItem>
                    <SelectItem
                      value="white_noise"
                      className="text-text dark:text-white"
                    >
                      🌊 White Noise
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 dark:from-primary-dark dark:to-accent-dark text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save className="h-6 w-6 mr-3" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfileSettings;
