import expressAsyncHandler from "express-async-handler";
import StudentProfile from "../../../models/User/studentProfile.model.js";
import { GoogleGenAI } from "@google/genai";
import User from "../../../models/User/User.model.js";
import FlashcardDeck from "../../../models/Flashcard/FlashcardDeck.model.js";
import Flashcard from "../../../models/Flashcard/Flashcard.model.js";

const studentController = {
  //* Get student profile
  getStudentProfile: expressAsyncHandler(async (req, res) => {
    const studentProfile = await StudentProfile.findOne({ userId: req.user });

    if (!studentProfile) {
      // * Need to create a new profile if the role is student
      const user = await User.findById(req.user);
      if (user.role === "student") {
        const newStudentProfile = await StudentProfile.create({
          userId: user._id,
        });
        user.studentProfile = newStudentProfile._id;
        await newStudentProfile.save();
        await user.save();
        return res.status(201).json({
          status: "success",
          message:
            "Student profile created successfully || Created the profile because we didin't find one",
          newStudentProfile,
        });
      }
    }

    res.status(200).json({
      status: "success",
      message: "Student profile retrieved successfully",
      studentProfile,
    });
  }),

  //* Update student profile
  updateStudentProfile: expressAsyncHandler(async (req, res) => {
    const {
      grade,
      medium,
      subjects,
      chronotype,
      energyLevel,
      studyBreakDuration,
      maxStudySessionLength,
      preferredStudyStartTime,
      preferredStudyEndTime,
      currentMood,
      studyEnvironmentPreference,
      learningStyle,
    } = req.body;

    const studentProfile = await StudentProfile.findOneAndUpdate(
      { userId: req.user },
      {
        $set: {
          grade,
          medium,
          subjects,
          chronotype,
          energyLevel,
          studyBreakDuration,
          maxStudySessionLength,
          preferredStudyStartTime,
          preferredStudyEndTime,
          currentMood,
          studyEnvironmentPreference,
          learningStyle,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      status: "success",
      message: "Student profile updated successfully",
      studentProfile,
    });
  }),

  //* Generate smart daily planner
  generateDailyPlanner: expressAsyncHandler(async (req, res) => {
    const studentProfile = await StudentProfile.findOne({ userId: req.user });

    if (!studentProfile) {
      return res.status(404).json({
        status: "error",
        message:
          "Student profile not found. Please complete your profile first.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const profileData = {
      grade: studentProfile?.grdae,
      medium: studentProfile?.medium,
      subjects: studentProfile?.subjects,
      chronotype: studentProfile?.chronotype,
      energyLevel: studentProfile?.energyLevel,
      studyBreakDuration: studentProfile?.studyBreakDuration,
      maxStudySessionLength: studentProfile?.maxStudySessionLength,
      preferredStudyStartTime: studentProfile?.preferredStudyStartTime,
      preferredStudyEndTime: studentProfile?.preferredStudyEndTime,
      currentMood: studentProfile?.currentMood,
      studyEnvironmentPreference: studentProfile?.studyEnvironmentPreference,
      learningStyle: studentProfile?.learningStyle,
    };

    const config = {
      systemInstruction: [
        {
          text: `You are an AI study planner assistant. Create a personalized daily study schedule based on the student's profile.

Return ONLY a valid JSON object with this exact structure:
{
  "todayDate": "2025-08-20",
  "studentName": "Student",
  "overallMotivation": "A brief encouraging message based on their mood and energy",
  "recommendedFocus": "What they should prioritize today",
  "schedule": [
    {
      "timeSlot": "09:00 - 10:30",
      "activity": "Study Session",
      "subject": "Mathematics",
      "description": "Focus on algebra problems",
      "duration": 90,
      "type": "study",
      "priority": "high",
      "energyRequired": "high",
      "tips": "Take notes and practice problems"
    },
    {
      "timeSlot": "10:30 - 10:45",
      "activity": "Break",
      "description": "Stretch and hydrate",
      "duration": 15,
      "type": "break",
      "tips": "Move around to refresh your mind"
    }
  ],
  "dailyGoals": [
    "Complete 2 math practice problems",
    "Review science notes for 30 minutes"
  ],
  "studyTips": [
    "💡 Use active recall while studying",
    "🎵 Try background music for better focus"
  ]
}

IMPORTANT GUIDELINES:
- Create 6-8 time slots covering their preferred study hours
- Prioritize high-difficulty subjects during peak energy times
- Include appropriate breaks based on their break duration preference
- For Early Birds: schedule demanding subjects in morning (8-12 PM)
- For Night Owls: schedule demanding subjects in evening (6-10 PM)
- For Neither: distribute evenly with peak at midday
- Match study session length to their maxStudySessionLength
- Consider their current mood: if tired/stressed, include more breaks and easier subjects first
- Include 2-4 study sessions, appropriate breaks, and 1-2 review sessions
- Provide specific, actionable tips based on their learning style
- Create 3-4 realistic daily goals
- Make the schedule practical and achievable`,
        },
      ],
    };

    const model = "gemini-2.0-flash";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `Create a personalized daily study planner for today with this student profile: ${JSON.stringify(
              profileData,
              null,
              2
            )} (MUST BE DIFFERENT EACH TIME)

            
Current date: ${new Date().toISOString().split("T")[0]}
Generate a smart, realistic daily schedule that optimizes their learning based on their chronotype, energy level, mood, and subjects.`,
          },
        ],
      },
    ];

    try {
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let fullResponse = "";
      for await (const chunk of response) {
        fullResponse += chunk.text;
      }
      //   console.log(fullResponse);
      const cleanResponse = fullResponse.replace(/```json\s*|\s*```/g, "");
      //   console.log(cleanResponse);
      const parsedData = JSON.parse(cleanResponse);

      res.status(200).json({
        status: "success",
        message: "Daily planner generated successfully",
        data: parsedData,
      });
      studentProfile.dailyPlanner = parsedData;
      await studentProfile.save();
    } catch (error) {
      console.error("Daily planner generation failed:", error);

      // Fallback response
      res.status(200).json({
        status: "partial_success",
        message: "Generated fallback planner due to AI service error",
        data: {
          todayDate: new Date().toISOString().split("T")[0],
          studentName: "Student",
          overallMotivation: "Every small step counts towards your success!",
          recommendedFocus:
            "Start with your most challenging subject when your energy is highest",
          schedule: [
            {
              timeSlot: "09:00 - 10:30",
              activity: "Study Session",
              subject: profileData.subjects[0]?.name || "General Study",
              description: "Focus on understanding core concepts",
              duration: 90,
              type: "study",
              priority: "high",
              energyRequired: "high",
              tips: "Take notes and practice actively",
            },
            {
              timeSlot: "10:30 - 10:45",
              activity: "Break",
              description: "Stretch and hydrate",
              duration: 15,
              type: "break",
              tips: "Move around to refresh your mind",
            },
          ],
          dailyGoals: [
            "Complete one major study session",
            "Review notes from yesterday",
          ],
          studyTips: [
            "💡 Use the Pomodoro technique for focused studying",
            "🎯 Set specific goals for each study session",
          ],
        },
      });
    }
  }),

  //* Generate smart quiz
  generateQuiz: expressAsyncHandler(async (req, res) => {
    const { subjects, questionCount } = req.body;
    const studentProfile = await StudentProfile.findOne({ userId: req.user });

    if (!studentProfile) {
      return res.status(404).json({
        status: "error",
        message:
          "Student profile not found. Please complete your profile first.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const profileData = {
      subjects: studentProfile.subjects.filter((s) =>
        subjects.includes(s.name)
      ),
      chronotype: studentProfile.chronotype,
      energyLevel: studentProfile.energyLevel,
      currentMood: studentProfile.currentMood,
      learningStyle: studentProfile.learningStyle,
      accuracyRate: studentProfile.accuracyRate || 0,
      subjectPerformance: studentProfile.subjectPerformance || [],
    };

    const config = {
      systemInstruction: [
        {
          text: `You are an AI quiz generator that creates personalized, adaptive questions based on student profiles.

Return ONLY a valid JSON object with this exact structure:
{
  "quizId": "quiz_unique_id",
  "subjects": ["Mathematics", "Physics"],
  "timeLimit": 300,
  "totalPoints": 150,
  "difficulty": "adaptive",
  "questions": [
    {
      "questionId": "q1",
      "question": "What is the derivative of x³ + 2x² - 5x + 3?",
      "options": ["3x² + 4x - 5", "x² + 4x - 5", "3x² + 2x - 5", "3x² + 4x + 5"],
      "correctAnswer": "3x² + 4x - 5",
      "explanation": "Using the power rule: d/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(3) = 0",
      "difficulty": "medium",
      "points": 10,
      "subject": "Mathematics",
      "topic": "Calculus - Derivatives",
      "timeEstimate": 60
    }
  ],
  "adaptiveLogic": {
    "startingDifficulty": "medium",
    "progressionRules": "Increase difficulty on correct answers, decrease on incorrect"
  }
}

CRITICAL GUIDELINES:
- Generate ${questionCount} questions total across selected subjects: ${subjects.join(
            ", "
          )}
- Adapt difficulty based on student's subject performance and accuracy rate
- For subjects with high performance (>80%), include more hard questions
- For subjects with low performance (<60%), include more easy/medium questions
- Consider student's learning style: ${profileData.learningStyle}
- Account for current mood: ${profileData.currentMood}
- Energy level: ${profileData.energyLevel}/10
- Each question must have exactly 4 options with one correct answer
- Include detailed explanations for learning
- Set appropriate time estimates (easy: 30-45s, medium: 45-75s, hard: 75-120s)
- Ensure questions are educationally valuable and curriculum-aligned
- Points should reflect difficulty: easy(5-8), medium(8-12), hard(12-20)
- Make questions specific to difficulty levels in student profile
- Include variety in question types: conceptual, computational, application-based`,
        },
      ],
    };

    const model = "gemini-2.0-flash";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `Generate a personalized quiz with ${questionCount} questions for subjects: ${subjects.join(
              ", "
            )}.

Student Profile:
${JSON.stringify(profileData, null, 2)}

Current date: ${new Date().toISOString().split("T")[0]}
Make questions challenging but appropriate for their performance levels in each subject.`,
          },
        ],
      },
    ];

    try {
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let fullResponse = "";
      for await (const chunk of response) {
        fullResponse += chunk.text;
      }

      const cleanResponse = fullResponse.replace(/```json\s*|\s*```/g, "");
      const parsedData = JSON.parse(cleanResponse);

      res.status(200).json({
        status: "success",
        message: "Quiz generated successfully",
        data: parsedData,
      });
    } catch (error) {
      console.error("Quiz generation failed:", error);

      // Fallback quiz
      const fallbackQuiz = {
        quizId: `quiz_${Date.now()}`,
        subjects: subjects,
        timeLimit: questionCount * 60,
        totalPoints: questionCount * 10,
        questions: Array.from(
          { length: Math.min(questionCount, 3) },
          (_, i) => ({
            questionId: `q${i + 1}`,
            question: `Sample question ${i + 1} for ${subjects[0]}`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: "Option A",
            explanation: "This is a sample explanation",
            difficulty: "medium",
            points: 10,
            subject: subjects[0],
            topic: "General",
            timeEstimate: 60,
          })
        ),
      };

      res.status(200).json({
        status: "partial_success",
        message: "Generated fallback quiz due to AI service error",
        data: fallbackQuiz,
      });
    }
  }),

  //* Submit quiz answers and update performance
  submitQuiz: expressAsyncHandler(async (req, res) => {
    const { quizId, answers, completedAt, timeTaken } = req.body;
    const studentProfile = await StudentProfile.findOne({ userId: req.user });

    if (!studentProfile) {
      return res.status(404).json({
        status: "error",
        message: "Student profile not found.",
      });
    }

    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const totalQuestions = answers.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const pointsEarned = answers.reduce((total, answer) => {
      return total + (answer.isCorrect ? 10 : 0);
    }, 0);

    // Update quiz history
    const quizRecord = {
      quizId,
      subjects: answers
        .map((a) => a.subject)
        .filter((v, i, a) => a.indexOf(v) === i),
      score,
      totalQuestions,
      correctAnswers,
      pointsEarned,
      completedAt: new Date(completedAt),
      timeTaken,
    };

    studentProfile.quizHistory.push(quizRecord);
    studentProfile.totalPoints =
      (studentProfile.totalPoints || 0) + pointsEarned;

    // Update accuracy rate
    const allQuizzes = [...studentProfile.quizHistory];
    const totalCorrect = allQuizzes.reduce(
      (sum, quiz) => sum + quiz.correctAnswers,
      0
    );
    const totalQuestions_all = allQuizzes.reduce(
      (sum, quiz) => sum + quiz.totalQuestions,
      0
    );
    studentProfile.accuracyRate = Math.round(
      (totalCorrect / totalQuestions_all) * 100
    );

    // Update quiz streak
    const today = new Date().toDateString();
    const lastQuizDate =
      allQuizzes[allQuizzes.length - 2]?.completedAt?.toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (lastQuizDate === yesterday || allQuizzes.length === 1) {
      studentProfile.quizStreak = (studentProfile.quizStreak || 0) + 1;
    } else if (lastQuizDate !== today) {
      studentProfile.quizStreak = 1;
    }

    await studentProfile.save();

    // Generate performance analysis
    const subjectBreakdown = quizRecord.subjects.map((subject) => ({
      name: subject,
      score: Math.round(Math.random() * 30 + 70), // Placeholder - calculate actual
    }));

    const recommendations = [
      score >= 80
        ? "Excellent work! Keep up the great performance!"
        : score >= 60
        ? "Good progress! Focus on challenging topics."
        : "Consider reviewing fundamentals before advancing.",
      "Try studying during your peak energy hours",
      "Use active recall techniques for better retention",
    ];

    res.status(200).json({
      status: "success",
      message: "Quiz submitted successfully",
      data: {
        score,
        correctAnswers,
        totalQuestions,
        pointsEarned,
        subjectBreakdown,
        recommendations,
        newTotalPoints: studentProfile.totalPoints,
        currentStreak: studentProfile.quizStreak,
      },
    });
  }),

  //* Get quiz history
  getQuizHistory: expressAsyncHandler(async (req, res) => {
    const studentProfile = await StudentProfile.findOne({ userId: req.user });

    if (!studentProfile) {
      return res.status(404).json({
        status: "error",
        message: "Student profile not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Quiz history retrieved successfully",
      quizHistory: studentProfile.quizHistory.sort(
        (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
      ),
    });
  }),

  //* AI Chat Assistance
  handleAIChat: expressAsyncHandler(async (req, res) => {
    try {
      const { message, isVoice, chatHistory = [] } = req.body;
      const studentProfile = await StudentProfile.findOne({ userId: req.user });

      if (!studentProfile) {
        return res.status(404).json({
          status: "error",
          message: "Student profile not found.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const context = {
        subjects: studentProfile.subjects,
        learningStyle: studentProfile.learningStyle,
        currentMood: studentProfile.currentMood,
      };

      const prompt = `
      You are an AI study assistant for students. Help them understand difficult concepts in simple words. And help them to learn as an professional teacher with the undertaning of the mood and other stuff.
      
      Student Context:
      - Subjects: ${context.subjects.map((s) => s.name).join(", ")}
      - Learning Style: ${context.learningStyle}
      - Current Mood: ${context.currentMood}
      
      Previous conversation:
      ${chatHistory.map((chat) => `${chat.role}: ${chat.message}`).join("\n")}
      
      Current question: ${message}
      
      Provide a helpful, step-by-step explanation in simple language. If the question is not study-related, politely redirect to study topics.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const aiResponse = response.text;

      const updatedChatHistory = [
        ...chatHistory.slice(-4),
        { role: "user", message },
        { role: "assistant", message: aiResponse },
      ];

      res.status(200).json({
        status: "success",
        message: "AI response generated successfully",
        data: {
          response: aiResponse,
          chatHistory: updatedChatHistory,
          isVoice,
        },
      });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to generate AI response",
      });
    }
  }),

  //* Generate flashcards from content
  generateFlashcards: expressAsyncHandler(async (req, res) => {
    const { title, subject, content } = req.body;
    const studentProfile = await StudentProfile.findOne({ userId: req.user });

    if (!studentProfile) {
      return res.status(404).json({
        status: "error",
        message: "Student profile not found.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const config = {
      systemInstruction: [
        {
          text: `You are an AI flashcard generator for Sri Lankan students following the local education syllabus. Create effective flashcards based on the provided content.

Return ONLY a valid JSON object with this structure:
{
  "flashcards": [
    {
      "question": "What is the formula for kinetic energy?",
      "answer": "KE = 1/2 mv²",
      "difficulty": "medium",
      "topic": "Energy and Motion"
    }
  ]
}

Guidelines for Sri Lankan Education Context:
- Create 8-15 flashcards appropriate for ${studentProfile.grade} level Sri Lankan syllabus
- Use ${studentProfile.medium} language terminology and concepts familiar to Sri Lankan students
- Include local examples and context where relevant (e.g., Sri Lankan geography, history, culture)
- Follow Sri Lankan curriculum standards and exam patterns
- For science: Use SI units and standard formulas taught in Sri Lankan schools
- For mathematics: Follow Sri Lankan textbook approaches and methods
- Questions should test understanding, not just memorization
- Keep answers concise but complete for the grade level
- Include practical applications relevant to Sri Lankan context
- Ensure questions align with local exam formats and expectations`,
        },
      ],
    };

    const model = "gemini-2.0-flash";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `Generate flashcards from this content for Grade ${studentProfile.grade} students in ${studentProfile.medium} medium:

Subject: ${subject}
Content: ${content}

Make flashcards that help students understand and remember key concepts effectively.`,
          },
        ],
      },
    ];

    try {
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let fullResponse = "";
      for await (const chunk of response) {
        fullResponse += chunk.text;
      }

      const cleanResponse = fullResponse.replace(/```json\s*|\s*```/g, "");
      const parsedData = JSON.parse(cleanResponse);

      const deck = await FlashcardDeck.create({
        userId: req.user,
        title,
        subject,
      });

      const flashcardPromises = parsedData.flashcards.map((card) =>
        Flashcard.create({
          userId: req.user,
          deckId: deck._id,
          question: card.question,
          answer: card.answer,
        })
      );

      const createdFlashcards = await Promise.all(flashcardPromises);
      deck.flashcards = createdFlashcards.map((card) => card._id);
      await deck.save();

      res.status(201).json({
        status: "success",
        message: "Flashcards generated successfully",
        data: {
          deck,
          flashcardsCount: createdFlashcards.length,
        },
      });
    } catch (error) {
      console.error("Flashcard generation failed:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to generate flashcards",
      });
    }
  }),

  //* Get all flashcard decks
  getFlashcardDecks: expressAsyncHandler(async (req, res) => {
    const decks = await FlashcardDeck.find({ userId: req.user })
      .populate("flashcards")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "Flashcard decks retrieved successfully",
      decks,
    });
  }),

  //* Get deck with flashcards for study session
  getStudySession: expressAsyncHandler(async (req, res) => {
    const { deckId } = req.params;

    const currentTime = new Date();
    const flashcards = await Flashcard.find({
      userId: req.user,
      deckId,
      nextReview: { $lte: currentTime },
    }).sort({ confidenceLevel: 1, nextReview: 1 });

    const deck = await FlashcardDeck.findById(deckId);

    res.status(200).json({
      status: "success",
      message: "Study session loaded successfully",
      data: {
        deck,
        flashcards,
        totalDue: flashcards.length,
      },
    });
  }),

  //* Update flashcard confidence and schedule next review
  updateFlashcardReview: expressAsyncHandler(async (req, res) => {
    const { flashcardId } = req.params;
    const { confidenceLevel } = req.body;

    const flashcard = await Flashcard.findById(flashcardId);
    const studentProfile = await StudentProfile.findOne({ userId: req.user });

    if (!flashcard || flashcard.userId.toString() !== req.user.toString()) {
      return res.status(404).json({
        status: "error",
        message: "Flashcard not found",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const profileContext = {
      confidenceLevel,
      currentMood: studentProfile.currentMood,
      energyLevel: studentProfile.energyLevel,
      learningStyle: studentProfile.learningStyle,
      studyHoursPerWeek: flashcard.subject
        ? studentProfile.subjects.find((s) => s.name === flashcard.subject)
            ?.studyHoursPerWeek || 4
        : 4,
      difficulty: flashcard.subject
        ? studentProfile.subjects.find((s) => s.name === flashcard.subject)
            ?.difficulty || "medium"
        : "medium",
    };

    const prompt = `Calculate the optimal next review time for a Sri Lankan student's flashcard based on spaced repetition principles.

Student Context:
- Confidence Level (1-4): ${confidenceLevel}
- Current Mood: ${profileContext.currentMood}
- Energy Level: ${profileContext.energyLevel}/10
- Learning Style: ${profileContext.learningStyle}
- Subject Difficulty: ${profileContext.difficulty}
- Weekly Study Hours: ${profileContext.studyHoursPerWeek}

Return ONLY a JSON object:
{
  "nextReviewHours": 24,
  "reasoning": "Based on medium confidence and tired mood, scheduled for tomorrow"
}

Calculation Rules:
- Confidence 1 (Again): 0.25-2 hours based on mood/energy
- Confidence 2 (Hard): 12-48 hours based on difficulty
- Confidence 3 (Good): 2-7 days based on study habits
- Confidence 4 (Easy): 7-21 days based on mastery level
- Adjust for mood: tired/stressed = shorter intervals
- Adjust for energy: low energy = longer intervals
- Consider learning style and subject difficulty`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const cleanResponse = response.text().replace(/```json\s*|\s*```/g, "");
      const aiResult = JSON.parse(cleanResponse);

      const now = new Date();
      const nextReview = new Date(
        now.getTime() + aiResult.nextReviewHours * 60 * 60 * 1000
      );

      flashcard.confidenceLevel = confidenceLevel;
      flashcard.lastReviewed = now;
      flashcard.nextReview = nextReview;
      await flashcard.save();

      res.status(200).json({
        status: "success",
        message: "Flashcard updated successfully",
        data: {
          flashcard,
          aiReasoning: aiResult.reasoning,
          nextReviewIn: `${Math.round(aiResult.nextReviewHours)} hours`,
        },
      });
    } catch (error) {
      console.error("AI scheduling failed:", error);

      const fallbackHours =
        confidenceLevel === 1
          ? 0.25
          : confidenceLevel === 2
          ? 24
          : confidenceLevel === 3
          ? 72
          : 168;

      const nextReview = new Date(Date.now() + fallbackHours * 60 * 60 * 1000);

      flashcard.confidenceLevel = confidenceLevel;
      flashcard.lastReviewed = new Date();
      flashcard.nextReview = nextReview;
      await flashcard.save();

      res.status(200).json({
        status: "success",
        message: "Flashcard updated with fallback scheduling",
        data: { flashcard },
      });
    }
  }),

  //* Delete flashcard deck
  deleteFlashcardDeck: expressAsyncHandler(async (req, res) => {
    const { deckId } = req.params;

    const deck = await FlashcardDeck.findOne({
      _id: deckId,
      userId: req.user,
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    await Flashcard.deleteMany({ deckId });
    await FlashcardDeck.findByIdAndDelete(deckId);

    res.status(200).json({
      status: "success",
      message: "Deck deleted successfully",
    });
  }),
};

export default studentController;
