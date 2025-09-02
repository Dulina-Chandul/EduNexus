import { GoogleGenAI } from "@google/genai";
import expressAsyncHandler from "express-async-handler";

const geminiAPIController = {
  generateQuoteAndProTip: expressAsyncHandler(async (req, res) => {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const config = {
      systemInstruction: [
        {
          text: `Return ONLY a valid JSON object with exactly three fields:
                   - "quote": A SINGLE CONCISE educational quote about learning/growth/perseverance (MUST BE DIFFERENT EACH TIME)
                   - "author": The historical figure/philosopher who said the quote (MUST BE DIFFERENT EACH TIME)
                   - "studyTip": A practical study tip starting with an emoji (e.g., 📚, ⏰, ✅) (MUST BE DIFFERENT EACH TIME)
                   
                 IMPORTANT: Generate NEW and DIFFERENT quotes/authors for every request. Avoid repeating the same quotes or authors.
                 Examples of varied quotes:
                   "Education is the most powerful weapon which you can use to change the world." - Nelson Mandela
                   "The expert in anything was once a beginner." - Helen Hayes
                   "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence." - Abigail Adams
                   "It does not matter how slowly you go as long as you do not stop." - Confucius
                   "The beautiful thing about learning is that no one can take it away from you." - B.B. King`,
        },
      ],
    };

    const model = "gemini-2.0-flash";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: "Generate a NEW motivational quote and a NEW pro tip for students. Please ensure both the quote and author are different from previous responses.",
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullResponse = "";
    for await (const chunk of response) {
      fullResponse += chunk.text;
    }

    try {
      const cleanResponse = fullResponse.replace(/```json\s*|\s*```/g, "");
      const parsedData = JSON.parse(cleanResponse);

      res.status(200).json({
        status: "success",
        message: "Quote and pro tip generated successfully",
        data: parsedData,
      });
    } catch (error) {
      console.error("JSON parsing failed:", error);
      console.error("Raw response:", fullResponse);

      res.status(200).json({
        status: "partial_success",
        message: "Generated content with fallback values due to parsing error",
        data: {
          quote: "The only true wisdom is in knowing you know nothing.",
          author: "Socrates",
          studyTip: "⏰ Use the Pomodoro Technique for focused studying.",
        },
      });
    }
  }),
};

export default geminiAPIController;
