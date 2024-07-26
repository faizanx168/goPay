import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";

const redisClient = createClient({
  url: "redis://redis:6379",
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Connected to Redis");
    }
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
})();

export async function CreateOnRampTransaction(
  amount: number,
  provider: string
) {
  const token = uuidv4();
  let userId;
  try {
    const session = await getServerSession(authOptions);
    userId = session?.user?.id;
    if (!userId) {
      return { message: "User not logged in!" };
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    return { message: "Failed to retrieve user session." };
  }

  try {
    const transaction = await prisma.onRampTransaction.create({
      data: {
        userId: Number(userId),
        amount: amount,
        status: "Processing",
        startTime: new Date(),
        provider,
        token,
      },
    });

    try {
      await redisClient.lPush(
        "transactions",
        JSON.stringify({
          transactionId: transaction.id,
          amount: transaction.amount,
          userId: transaction.userId,
          token: transaction.token,
        })
      );
      return { message: "On ramp transaction created" };
    } catch (error) {
      console.error("Redis error:", error);
      return { message: "Failed to queue transaction." };
    }
  } catch (error) {
    console.error("Prisma error:", error);
    return { message: "Failed to create transaction." };
  }
}
