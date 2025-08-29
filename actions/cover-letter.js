"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkUser } from "@/lib/checkUser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


export async function testGeminiAPIKey() {
  try {
    const testPrompt = "Say hello in a professional tone.";
    const result = await model.generateContent(testPrompt);
    const text = result.response.text().trim();
    console.log("✅ Gemini API Key is working. Sample response:", text);
    return text;
  } catch (error) {
    console.error("❌ Gemini API Key failed:", error.message);
    throw new Error("Invalid Gemini API key or API access issue.");
  }
}





export async function generateCoverLetter(data) {
   await testGeminiAPIKey();
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Use checkUser to ensure user exists in database (creates if new)
  const user = await checkUser();
  if (!user) throw new Error("Failed to create or find user");

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Use checkUser to ensure user exists in database (creates if new)
  const user = await checkUser();
  if (!user) throw new Error("Failed to create or find user");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Use checkUser to ensure user exists in database (creates if new)
  const user = await checkUser();
  if (!user) throw new Error("Failed to create or find user");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Use checkUser to ensure user exists in database (creates if new)
  const user = await checkUser();
  if (!user) throw new Error("Failed to create or find user");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
