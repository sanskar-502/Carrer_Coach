"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { buildFallbackInsights, generateAIInsights } from "./dashboard";
import { checkUser } from "@/lib/checkUser";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Use checkUser to ensure user exists in database (creates if new)
  const user = await checkUser();
  if (!user) throw new Error("Failed to create or find user");

  try {
    // First check if industry insights exist, create if needed (outside transaction)
    let industryInsight = await db.industryInsight.findUnique({
      where: {
        industry: data.industry,
      },
    });

    // If industry doesn't exist, generate insights (this can be slow)
    if (!industryInsight) {
      let insights;
      try {
        insights = await generateAIInsights(data.industry);
      } catch (error) {
        console.error("AI insights failed, using fallback:", error?.message || error);
        insights = buildFallbackInsights(data.industry);
      }

      industryInsight = await db.industryInsight.create({
        data: {
          industry: data.industry,
          ...insights,
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Now update the user (quick operation, no need for extended transaction)
    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        industry: data.industry,
        experience: data.experience,
        bio: data.bio,
        skills: data.skills,
      },
    });

    revalidatePath("/");
    return updatedUser;
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // Use checkUser to ensure user exists in database (creates if new)
    const user = await checkUser();
    if (!user) throw new Error("Failed to create or find user");

    return {
      isOnboarded: !!user.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
