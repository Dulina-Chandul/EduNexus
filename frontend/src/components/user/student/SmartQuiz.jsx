import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  BookOpen,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Sparkles,
  RefreshCw,
  Loader2,
  Play,
  Award,
  TrendingUp,
  Star,
  Users,
  FileQuestion,
} from "lucide-react";

import {
  getStudentProfileAPI,
  generateQuizAPI,
  submitQuizAnswerAPI,
  getQuizHistoryAPI,
} from "../../../APIservices/users/studentAPI";

const SmartQuiz = () => {
  const userAuth = useSelector((state) => state.auth.userAuth);

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get student profile
  const {
    data: profileResponse,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["student-profile"],
    queryFn: getStudentProfileAPI,
  });

  // Get quiz history
  const { data: quizHistoryResponse, isLoading: historyLoading } = useQuery({
    queryKey: ["quiz-history"],
    queryFn: getQuizHistoryAPI,
  });

  const profileData = profileResponse?.studentProfile;
  const quizHistory = quizHistoryResponse?.quizHistory || [];

  // Generate quiz mutation
  const generateQuizMutation = useMutation({
    mutationFn: generateQuizAPI,
    onSuccess: (response) => {
      setCurrentQuiz(response.data);
      setIsGenerating(false);
      startQuiz();
    },
    onError: (error) => {
      console.error("Quiz generation failed:", error);
      setIsGenerating(false);
    },
  });

  // Submit quiz mutation
  const submitQuizMutation = useMutation({
    mutationFn: submitQuizAnswerAPI,
    onSuccess: (response) => {
      setQuizResults(response.data);
      setQuizStarted(false);
      setQuizCompleted(true);
    },
    onError: (error) => {
      console.error("Quiz submission failed:", error);
    },
  });

  // Timer effect
  useEffect(() => {
    let interval;
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizCompleted, timeLeft]);

  const handleSubjectChange = (subjectName, checked) => {
    setSelectedSubjects((prev) =>
      checked ? [...prev, subjectName] : prev.filter((s) => s !== subjectName)
    );
  };

  const handleGenerateQuiz = () => {
    if (selectedSubjects.length === 0) return;

    setIsGenerating(true);
    generateQuizMutation.mutate({
      subjects: selectedSubjects,
      questionCount: questionCount,
    });
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setAnswers([]);
    setQuizCompleted(false);
    setTimeLeft(currentQuiz?.timeLimit || 300);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion.questionId,
        selectedAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: selectedAnswer === currentQuestion.correctAnswer,
        points: currentQuestion.points,
        subject: currentQuestion.subject,
      },
    ];
    setAnswers(newAnswers);
    setSelectedAnswer("");

    if (currentQuestionIndex + 1 >= currentQuiz.questions.length) {
      completeQuiz(newAnswers);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleTimeUp = () => {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion.questionId,
        selectedAnswer: selectedAnswer || "",
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: false,
        points: 0,
        subject: currentQuestion.subject,
      },
    ];
    completeQuiz(newAnswers);
  };

  const completeQuiz = (finalAnswers) => {
    const submissionData = {
      quizId: currentQuiz.quizId,
      answers: finalAnswers,
      completedAt: new Date().toISOString(),
      timeTaken: (currentQuiz?.timeLimit || 300) - timeLeft,
    };

    submitQuizMutation.mutate(submissionData);
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setAnswers([]);
    setQuizResults(null);
    setTimeLeft(0);
    setSelectedSubjects([]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark border border-primary/30 dark:border-primary-dark/30";
      case "medium":
        return "bg-accent/20 dark:bg-accent-dark/20 text-accent dark:text-accent-dark border border-accent/30 dark:border-accent-dark/30";
      case "hard":
        return "bg-secondary/20 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-dark border border-secondary/30 dark:border-secondary-dark/30";
      default:
        return "bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark border border-primary/30 dark:border-primary-dark/30";
    }
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
          Please complete your student profile first to access the smart quiz
          system.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 dark:from-primary-dark/30 dark:via-primary-dark/20 dark:to-accent-dark/30 p-6 border border-primary/30 dark:border-primary-dark/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/20 dark:bg-primary-dark/30 rounded-xl border border-primary/20 dark:border-primary-dark/30">
              <Brain className="h-8 w-8 text-primary dark:text-primary-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text dark:text-text-dark">
                Smart Quiz System
                <Sparkles className="inline h-6 w-6 ml-2 text-accent dark:text-accent-dark" />
              </h1>
              <p className="text-text/70 dark:text-text-dark/70 mt-1">
                AI-powered adaptive questions tailored to your learning level
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-accent/30 dark:bg-accent-dark/40 text-accent dark:text-accent-dark px-4 py-2 text-sm font-medium border border-accent/40 dark:border-accent-dark/50">
              Total Points: {profileData.totalPoints || 0}
            </Badge>
            <Badge className="bg-primary/30 dark:bg-primary-dark/40 text-primary dark:text-primary-dark px-4 py-2 text-sm font-medium border border-primary/40 dark:border-primary-dark/50">
              Quiz Streak: {profileData.quizStreak || 0}
            </Badge>
          </div>
        </div>
      </div>

      {!quizStarted && !quizCompleted && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quiz Setup */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-text dark:text-text-dark flex items-center">
                  <FileQuestion className="h-6 w-6 mr-2 text-primary dark:text-primary-dark" />
                  Select Quiz Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {profileData.subjects?.map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 bg-primary/5 dark:bg-primary-dark/10 rounded-lg border border-primary/20 dark:border-primary-dark/30 hover:bg-primary/10 dark:hover:bg-primary-dark/15 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`subject-${index}`}
                        checked={selectedSubjects.includes(subject.name)}
                        onChange={(e) =>
                          handleSubjectChange(subject.name, e.target.checked)
                        }
                        className="w-4 h-4 text-primary dark:text-primary-dark bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/30 rounded focus:ring-primary dark:focus:ring-primary-dark focus:ring-2"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`subject-${index}`}
                          className="font-medium text-text dark:text-text-dark cursor-pointer"
                        >
                          {subject.name}
                        </label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            className={getDifficultyColor(subject.difficulty)}
                          >
                            {subject.difficulty}
                          </Badge>
                          <Badge className="bg-accent/20 dark:bg-accent-dark/20 text-accent dark:text-accent-dark border border-accent/30 dark:border-accent-dark/30">
                            {subject.priority} priority
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-text dark:text-text-dark font-medium">
                      Number of Questions
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) =>
                        setQuestionCount(parseInt(e.target.value))
                      }
                      className="w-40 p-2 bg-bg dark:bg-bg-dark border border-primary/30 dark:border-primary-dark/40 rounded-lg text-text dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions</option>
                    </select>
                  </div>

                  <div className="flex-1 flex justify-end">
                    <Button
                      onClick={handleGenerateQuiz}
                      disabled={selectedSubjects.length === 0 || isGenerating}
                      className="bg-primary dark:bg-primary-dark text-bg dark:text-bg-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90 px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Generating Quiz...
                        </>
                      ) : (
                        <>
                          <Brain className="h-5 w-5 mr-2" />
                          Generate Smart Quiz
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Stats */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-accent/10 via-transparent to-primary/10 dark:from-accent-dark/20 dark:to-primary-dark/20 border-accent/30 dark:border-accent-dark/40">
              <CardHeader>
                <CardTitle className="text-lg text-text dark:text-text-dark flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-accent dark:text-accent-dark" />
                  Your Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text/70 dark:text-text-dark/70">
                    Total Points
                  </span>
                  <span className="font-bold text-text dark:text-text-dark">
                    {profileData.totalPoints || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text/70 dark:text-text-dark/70">
                    Quiz Streak
                  </span>
                  <span className="font-bold text-text dark:text-text-dark">
                    {profileData.quizStreak || 0} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text/70 dark:text-text-dark/70">
                    Accuracy Rate
                  </span>
                  <span className="font-bold text-text dark:text-text-dark">
                    {profileData.accuracyRate || 0}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-text dark:text-text-dark flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary dark:text-primary-dark" />
                  Recent Quiz History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quizHistory.slice(0, 3).map((quiz, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-primary/5 dark:bg-primary-dark/10 rounded-lg border border-primary/20 dark:border-primary-dark/30"
                    >
                      <div>
                        <p className="font-medium text-text dark:text-text-dark">
                          {quiz.subjects.join(", ")}
                        </p>
                        <p className="text-sm text-text/60 dark:text-text-dark/60">
                          {new Date(quiz.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary dark:text-primary-dark">
                          {quiz.score}%
                        </p>
                        <p className="text-sm text-text/60 dark:text-text-dark/60">
                          +{quiz.pointsEarned} pts
                        </p>
                      </div>
                    </div>
                  ))}
                  {quizHistory.length === 0 && (
                    <p className="text-text/60 dark:text-text-dark/60 text-center py-4">
                      No quiz history yet. Take your first quiz!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quiz In Progress */}
      {quizStarted && currentQuiz && (
        <div className="space-y-6">
          {/* Quiz Progress */}
          <Card className="bg-gradient-to-r from-primary/10 via-transparent to-accent/10 dark:from-primary-dark/20 dark:to-accent-dark/20 border-primary/30 dark:border-primary-dark/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-primary/20 dark:bg-primary-dark/30 text-primary dark:text-primary-dark px-4 py-2 text-lg font-medium border border-primary/30 dark:border-primary-dark/40">
                    Question {currentQuestionIndex + 1} of{" "}
                    {currentQuiz.questions.length}
                  </Badge>
                  <Badge className="bg-secondary/20 dark:bg-secondary-dark/30 text-secondary dark:text-secondary-dark px-4 py-2 text-lg font-medium border border-secondary/30 dark:border-secondary-dark/40">
                    {currentQuiz.subjects.join(", ")}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-accent dark:text-accent-dark" />
                    <span
                      className={`font-bold text-lg ${
                        timeLeft < 30
                          ? "text-secondary dark:text-secondary-dark"
                          : "text-text dark:text-text-dark"
                      }`}
                    >
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              </div>
              <Progress
                value={
                  ((currentQuestionIndex + 1) / currentQuiz.questions.length) *
                  100
                }
                className="h-3"
              />
            </CardContent>
          </Card>

          {/* Current Question */}
          <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 dark:bg-primary-dark/20 rounded-xl">
                    <FileQuestion className="h-6 w-6 text-primary dark:text-primary-dark" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text dark:text-text-dark mb-4">
                      {currentQuiz.questions[currentQuestionIndex]?.question}
                    </h3>
                    <div className="flex items-center space-x-3 mb-6">
                      <Badge
                        className={getDifficultyColor(
                          currentQuiz.questions[currentQuestionIndex]
                            ?.difficulty
                        )}
                      >
                        {
                          currentQuiz.questions[currentQuestionIndex]
                            ?.difficulty
                        }
                      </Badge>
                      <Badge className="bg-accent/20 dark:bg-accent-dark/20 text-accent dark:text-accent-dark border border-accent/30 dark:border-accent-dark/30">
                        {currentQuiz.questions[currentQuestionIndex]?.points}{" "}
                        points
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  {currentQuiz.questions[currentQuestionIndex]?.options.map(
                    (option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                          selectedAnswer === option
                            ? "border-primary dark:border-primary-dark bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark font-medium"
                            : "border-primary/20 dark:border-primary-dark/30 bg-primary/5 dark:bg-primary-dark/10 text-text dark:text-text-dark hover:border-primary/40 dark:hover:border-primary-dark/40 hover:bg-primary/10 dark:hover:bg-primary-dark/15"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswer === option
                                ? "border-primary dark:border-primary-dark bg-primary dark:bg-primary-dark"
                                : "border-primary/40 dark:border-primary-dark/40"
                            }`}
                          >
                            {selectedAnswer === option && (
                              <CheckCircle className="h-4 w-4 text-bg dark:text-bg-dark" />
                            )}
                          </div>
                          <span className="text-lg">{option}</span>
                        </div>
                      </button>
                    )
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                    className="bg-primary dark:bg-primary-dark text-bg dark:text-bg-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90 px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {currentQuestionIndex + 1 >=
                    currentQuiz.questions.length ? (
                      <>
                        <Trophy className="h-5 w-5 mr-2" />
                        Complete Quiz
                      </>
                    ) : (
                      <>
                        Next Question
                        <Zap className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quiz Results */}
      {quizCompleted && quizResults && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-accent/20 via-primary/10 to-secondary/20 dark:from-accent-dark/30 dark:via-primary-dark/20 dark:to-secondary-dark/30 border-accent/30 dark:border-accent-dark/40 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="p-6 bg-accent/20 dark:bg-accent-dark/30 rounded-full mx-auto w-24 h-24 flex items-center justify-center mb-6 border border-accent/40 dark:border-accent-dark/50">
                  <Trophy className="h-12 w-12 text-accent dark:text-accent-dark" />
                </div>
                <h3 className="text-3xl font-bold text-text dark:text-text-dark mb-2">
                  Quiz Completed! 🎉
                </h3>
                <p className="text-text/70 dark:text-text-dark/70 text-lg">
                  Great job on completing your personalized quiz
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3 mb-8">
                <div className="p-6 bg-bg/50 dark:bg-bg-dark/50 rounded-xl border border-primary/30 dark:border-primary-dark/40">
                  <div className="text-3xl font-bold text-primary dark:text-primary-dark mb-2">
                    {quizResults.score}%
                  </div>
                  <div className="text-text/70 dark:text-text-dark/70">
                    Score
                  </div>
                </div>
                <div className="p-6 bg-bg/50 dark:bg-bg-dark/50 rounded-xl border border-accent/30 dark:border-accent-dark/40">
                  <div className="text-3xl font-bold text-accent dark:text-accent-dark mb-2">
                    +{quizResults.pointsEarned}
                  </div>
                  <div className="text-text/70 dark:text-text-dark/70">
                    Points Earned
                  </div>
                </div>
                <div className="p-6 bg-bg/50 dark:bg-bg-dark/50 rounded-xl border border-secondary/30 dark:border-secondary-dark/40">
                  <div className="text-3xl font-bold text-secondary dark:text-secondary-dark mb-2">
                    {quizResults.correctAnswers}/{quizResults.totalQuestions}
                  </div>
                  <div className="text-text/70 dark:text-text-dark/70">
                    Correct
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={resetQuiz}
                  className="bg-primary dark:bg-primary-dark text-bg dark:text-bg-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90 px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mr-4"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Take Another Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Analysis */}
          <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-text dark:text-text-dark flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-primary dark:text-primary-dark" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold text-text dark:text-text-dark">
                    Subject Performance
                  </h4>
                  {quizResults.subjectBreakdown?.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text dark:text-text-dark">
                          {subject.name}
                        </span>
                        <span className="font-medium text-text dark:text-text-dark">
                          {subject.score}%
                        </span>
                      </div>
                      <Progress value={subject.score} className="h-2" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-text dark:text-text-dark">
                    AI Recommendations
                  </h4>
                  <div className="space-y-3">
                    {quizResults.recommendations?.map((rec, index) => (
                      <div
                        key={index}
                        className="p-3 bg-primary/5 dark:bg-primary-dark/10 rounded-lg border border-primary/20 dark:border-primary-dark/30"
                      >
                        <p className="text-text dark:text-text-dark text-sm">
                          {rec}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SmartQuiz;
