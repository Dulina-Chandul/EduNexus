import expressAsyncHandler from "express-async-handler";
import StudentProfile from "../../../models/User/studentProfile.model.js";
import { GoogleGenAI } from "@google/genai";
import User from "../../../models/User/User.model.js";

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
};

export default studentController;
