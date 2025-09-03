import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    grade: {
      type: String,
      default: "Grade 11",
      required: true,
    },
    medium: {
      type: String,
      enum: ["Sinhala", "English", "Tamil"],
      default: "English",
      required: true,
    },
    subjects: [
      {
        name: {
          type: String,
          required: true,
          default: "English",
        },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
        studyHoursPerWeek: {
          type: Number,
          default: 4,
        },
        priority: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
      },
    ],
    chronotype: {
      type: String,
      enum: ["Early Bird", "Night Owl", "Neither"],
      default: "Neither",
    },
    energyLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    studyBreakDuration: {
      type: Number,
      default: 15,
    },
    maxStudySessionLength: {
      type: Number,
      default: 90,
    },
    preferredStudyStartTime: {
      type: String,
      default: "09:00",
    },
    preferredStudyEndTime: {
      type: String,
      default: "17:00",
    },
    currentMood: {
      type: String,
      enum: ["motivated", "neutral", "tired", "stressed", "excited"],
      default: "neutral",
    },
    studyEnvironmentPreference: {
      type: String,
      enum: ["quiet", "background_music", "white_noise"],
      default: "quiet",
    },
    learningStyle: {
      type: String,
      enum: ["visual", "auditory", "kinesthetic", "reading_writing"],
      default: "visual",
    },
    dailyPlanner: {
      type: Object,
      default: {},
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    quizStreak: {
      type: Number,
      default: 0,
    },
    accuracyRate: {
      type: Number,
      default: 0,
    },
    quizHistory: [
      {
        quizId: String,
        subjects: [String],
        score: Number,
        totalQuestions: Number,
        correctAnswers: Number,
        pointsEarned: Number,
        completedAt: Date,
        timeTaken: Number,
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
      },
    ],
    subjectPerformance: [
      {
        subject: String,
        averageScore: {
          type: Number,
          default: 0,
        },
        totalQuizzes: {
          type: Number,
          default: 0,
        },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
export default StudentProfile;
