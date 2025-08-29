import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    // First try to find by clerkUserId
    let loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // If not found by clerkUserId, try to find by email
    const userEmail = user.emailAddresses[0].emailAddress;
    loggedInUser = await db.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (loggedInUser) {
      // Update the existing user with the correct clerkUserId
      const updatedUser = await db.user.update({
        where: {
          email: userEmail,
        },
        data: {
          clerkUserId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          imageUrl: user.imageUrl,
        },
      });
      return updatedUser;
    }

    // If user doesn't exist at all, create new user
    const name = `${user.firstName} ${user.lastName}`;
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: userEmail,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error.message);
    return null;
  }
};
