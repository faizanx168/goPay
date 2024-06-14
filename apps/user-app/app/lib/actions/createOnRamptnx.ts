"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function CreateOnRampTransaction(
  amount: number,
  provider: string
) {
  const token = Math.random.toString();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return {
      message: "User not logged in!",
    };
  }
  prisma.onRampTransaction.create({
    data: {
      userId: Number(userId),
      amount: amount,
      status: "Processing",
      startTime: new Date(),
      provider,
      token,
    },
  });
  return {
    message: "On ramp transaction created",
  };
}
