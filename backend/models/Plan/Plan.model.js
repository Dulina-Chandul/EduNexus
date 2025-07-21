import mongoose from "mongoose";
import { features } from "process";

//* Schema
const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    features: [String],
    limitations: [String],
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

//* Model
const Plan = mongoose.model("Plan", planSchema);
export default Plan;
