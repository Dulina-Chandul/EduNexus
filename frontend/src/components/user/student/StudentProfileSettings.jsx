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

  // Query to get current profile
  const {
    data: profileResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["student-profile"],
    queryFn: getStudentProfileAPI,
  });

  const profileData = profileResponse?.studentProfile;

  // Mutation to update profile
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-dark" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-text dark:text-text-dark flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-primary dark:text-primary-dark" />
              Your Subjects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {formData.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-primary/5 dark:bg-primary-dark/10 rounded-lg border border-primary/20 dark:border-primary-dark/30"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-text dark:text-text-dark font-medium">
                      {subject.name}
                    </div>
                    <Badge className="bg-secondary/20 dark:bg-secondary-dark/30 text-secondary dark:text-secondary-dark border border-secondary/30 dark:border-secondary-dark/40">
                      {subject.difficulty}
                    </Badge>
                    <Badge className="bg-accent/20 dark:bg-accent-dark/30 text-accent dark:text-accent-dark border border-accent/30 dark:border-accent-dark/40">
                      {subject.priority} priority
                    </Badge>
                    <span className="text-sm text-text/60 dark:text-text-dark/60 bg-primary/10 dark:bg-primary-dark/20 px-2 py-1 rounded border border-primary/20 dark:border-primary-dark/30">
                      {subject.studyHoursPerWeek}h/week
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubject(index)}
                    className="text-secondary dark:text-secondary-dark hover:bg-secondary/10 dark:hover:bg-secondary-dark/10 border border-transparent hover:border-secondary/30 dark:hover:border-secondary-dark/40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-accent/5 dark:bg-accent-dark/10 rounded-lg border border-accent/30 dark:border-accent-dark/40">
              <Input
                placeholder="Subject name"
                value={newSubject.name}
                onChange={(e) =>
                  setNewSubject((prev) => ({ ...prev, name: e.target.value }))
                }
                className="bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/40"
              />

              <Select
                value={newSubject.difficulty}
                onValueChange={(value) =>
                  setNewSubject((prev) => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger className="bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={newSubject.priority}
                onValueChange={(value) =>
                  setNewSubject((prev) => ({ ...prev, priority: value }))
                }
                classname
              >
                <SelectTrigger className="bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/40 ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-1">
                <Label className="text-xs text-text/60 dark:text-text-dark/60">
                  Hours per week
                </Label>
                <Input
                  type="number"
                  placeholder="Hours/week"
                  min="1"
                  max="20"
                  value={newSubject.studyHoursPerWeek}
                  onChange={(e) =>
                    setNewSubject((prev) => ({
                      ...prev,
                      studyHoursPerWeek: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/40"
                />
              </div>

              <Button
                type="button"
                onClick={addSubject}
                className="bg-accent dark:bg-accent-dark text-bg dark:text-bg-dark hover:bg-accent/90 dark:hover:bg-accent-dark/90 border border-accent/40 dark:border-accent-dark/50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-text dark:text-text-dark flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary dark:text-primary-dark" />
                Study Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-text dark:text-text-dark font-medium">
                  Chronotype
                </Label>
                <Select
                  value={formData.chronotype}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, chronotype: value }))
                  }
                >
                  <SelectTrigger className="bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Early Bird">
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Early Bird
                      </div>
                    </SelectItem>
                    <SelectItem value="Night Owl">
                      <div className="flex items-center">
                        <Moon className="h-4 w-4 mr-2" />
                        Night Owl
                      </div>
                    </SelectItem>
                    <SelectItem value="Neither">Neither</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-text dark:text-text-dark font-medium">
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
                    className="bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-text dark:text-text-dark font-medium">
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
                    className="bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/40"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-text dark:text-text-dark flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary dark:text-primary-dark" />
                Learning Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-text dark:text-text-dark font-medium">
                  Current Energy Level (1-10)
                </Label>
                <div className="flex items-center space-x-4">
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
                    className="flex-1"
                  />
                  <Badge className="bg-primary/20 dark:bg-primary-dark/30 text-primary dark:text-primary-dark px-3 py-1 border border-primary/30 dark:border-primary-dark/40">
                    {formData.energyLevel}/10
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-text dark:text-text-dark font-medium">
                  Current Mood
                </Label>
                <Select
                  value={formData.currentMood}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, currentMood: value }))
                  }
                >
                  <SelectTrigger className="bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motivated">😃 Motivated</SelectItem>
                    <SelectItem value="neutral">😐 Neutral</SelectItem>
                    <SelectItem value="tired">😴 Tired</SelectItem>
                    <SelectItem value="stressed">😰 Stressed</SelectItem>
                    <SelectItem value="excited">🤩 Excited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-text dark:text-text-dark flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary dark:text-primary-dark" />
              Study Session Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-text dark:text-text-dark font-medium">
                  Max Session Length
                </Label>
                <div className="space-y-1">
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
                    className="bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/40"
                  />
                  <span className="text-xs text-text/60 dark:text-text-dark/60">
                    minutes (30-180)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-text dark:text-text-dark font-medium">
                  Break Duration
                </Label>
                <div className="space-y-1">
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
                    className="bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/40"
                  />
                  <span className="text-xs text-text/60 dark:text-text-dark/60">
                    minutes (5-30)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-text dark:text-text-dark font-medium">
                  Learning Style
                </Label>
                <Select
                  value={formData.learningStyle}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, learningStyle: value }))
                  }
                >
                  <SelectTrigger className="bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visual">👁️ Visual</SelectItem>
                    <SelectItem value="auditory">👂 Auditory</SelectItem>
                    <SelectItem value="kinesthetic">✋ Kinesthetic</SelectItem>
                    <SelectItem value="reading_writing">
                      📝 Reading/Writing
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-text dark:text-text-dark flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary dark:text-primary-dark" />
              Study Environment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-text dark:text-text-dark font-medium">
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
                <SelectTrigger className="bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiet">🔇 Complete Silence</SelectItem>
                  <SelectItem value="background_music">
                    🎵 Background Music
                  </SelectItem>
                  <SelectItem value="white_noise">🌊 White Noise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pb-4">
          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="bg-primary dark:bg-primary-dark text-bg dark:text-bg-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90 px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>

        {updateProfileMutation.isSuccess && (
          <Alert className="border-accent/50 dark:border-accent-dark/50 bg-accent/5 dark:bg-accent-dark/10 mb-4">
            <AlertDescription className="text-text dark:text-text-dark">
              ✅ Profile updated successfully! Your AI planner is now optimized
              for your preferences.
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
};

export default StudentProfileSettings;
