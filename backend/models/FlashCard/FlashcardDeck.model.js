import mongoose from "mongoose";

const flashcardDeckSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    flashcards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flashcard",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const FlashcardDeck = mongoose.model("FlashcardDeck", flashcardDeckSchema);
export default FlashcardDeck;
