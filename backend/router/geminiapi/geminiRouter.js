import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import geminiAPIController from "../../controllers/geminiApi/geminiAPIController.js";

//* Instance of express router
const geminiRouter = express.Router();

//* Get random quote and pro tip
geminiRouter.get(
  "/get-dashboard-content",
  // isAuthenticated,
  geminiAPIController.generateQuoteAndProTip
);

export default geminiRouter;
