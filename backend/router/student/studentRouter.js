import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import studentController from "../../controllers/users/student/studentController.js";

//* Instance of express router
const studentRouter = express.Router();

//* Get the user profile
studentRouter.get(
  "/profile",
  isAuthenticated,
  studentController.getStudentProfile
);

//* Updating the student profile
studentRouter.put(
  "/profile/update",
  isAuthenticated,
  studentController.updateStudentProfile
);

//* Generating the daily planner
studentRouter.post(
  "/generate-planner",
  isAuthenticated,
  studentController.generateDailyPlanner
);

//* Generate quiz questions
studentRouter.post(
  "/generate-quiz",
  isAuthenticated,
  studentController.generateQuiz
);

//* Submit quiz answers
studentRouter.post(
  "/submit-quiz",
  isAuthenticated,
  studentController.submitQuiz
);

//* Get quiz history
studentRouter.get(
  "/quiz-history",
  isAuthenticated,
  studentController.getQuizHistory
);

//* AI Chat
studentRouter.post("/ai-chat", isAuthenticated, studentController.handleAIChat);

//* Generate Flash Cards
studentRouter.post(
  "/generate-flashcards",
  isAuthenticated,
  studentController.generateFlashcards
);

//*All Flashcards
studentRouter.get(
  "/flashcard-decks",
  isAuthenticated,
  studentController.getFlashcardDecks
);

//* Get one deck
studentRouter.get(
  "/study-session/:deckId",
  isAuthenticated,
  studentController.getStudySession
);

//* Get flashcard by ID
studentRouter.patch(
  "/flashcard-review/:flashcardId",
  isAuthenticated,
  studentController.updateFlashcardReview
);

//* Deelete flaashcard deck
studentRouter.delete(
  "/flashcard-deck/:deckId",
  isAuthenticated,
  studentController.deleteFlashcardDeck
);

export default studentRouter;
