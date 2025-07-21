import mongoose from "mongoose";

//* Schema
const profanityFilterSchema = new mongoose.Schema({
  bannedWords: [String],
});

//* Model
const ProfanityFilter = mongoose.model(
  "ProfanityFilter",
  profanityFilterSchema
);
export default ProfanityFilter;
