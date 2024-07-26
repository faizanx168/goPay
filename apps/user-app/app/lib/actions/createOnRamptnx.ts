"use server";
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
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Connected to Redis");
  }
})();

export async function CreateOnRampTransaction(
  amount: number,
  provider: string
) {
  const token = uuidv4();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return {
      message: "User not logged in!",
    };
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
      return {
        message: "On ramp transaction created",
      };
    } catch (error) {
      console.error("Redis error:", error);
      return {
        message: "Failed to queue transaction.",
      };
    }
  } catch (error) {
    console.error("Prisma error:", error);
    return {
      message: "Failed to create transaction.",
    };
  }
}
