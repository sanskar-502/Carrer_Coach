"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkUser } from "@/lib/checkUser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Use checkUser to ensure user exists in database (creates if new)
  const user = await checkUser();
  if (!user) throw new Error("Failed to create or find user");
  
  // Get user with industry insights
  const userWithInsights = await db.user.findUnique({
    where: { id: user.id },
    include: {
      industryInsight: true,
    },
  });

  // If user doesn't have an industry set, they need to complete onboarding
  if (!userWithInsights.industry) {
    throw new Error("User needs to complete onboarding first");
  }

  // If no insights exist, generate them
  if (!userWithInsights.industryInsight) {
    const insights = await generateAIInsights(userWithInsights.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: userWithInsights.industry,
        ...insights,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  // Check if data needs updating (if nextUpdate date has passed)
  const now = new Date();
  const nextUpdate = new Date(userWithInsights.industryInsight.nextUpdate);
  
  if (now > nextUpdate) {
    const insights = await generateAIInsights(userWithInsights.industry);
    
    const updatedInsight = await db.industryInsight.update({
      where: { industry: userWithInsights.industry },
      data: {
        ...insights,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    
    return updatedInsight;
  }

  return userWithInsights.industryInsight;
}
