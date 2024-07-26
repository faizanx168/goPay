"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function P2PTransfer(to: string, amount: number) {
  console.log("P2PTransfer called with:", { to, amount });
  const session = await getServerSession(authOptions);
  const from = session?.user?.id;

  if (!from) {
    console.error("User not logged in");
    return {
      message: "Error while sending!",
    };
  }

  const toUser = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });

  if (!toUser) {
    console.error("User not found for number:", to);
    return {
      message: "User not Found!",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Retrieve and lock the balance in a single query
      const fromBalance = await tx.balance.findUnique({
        where: { userId: Number(from) },
        select: { amount: true }, // Select only the necessary field
      });

      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }

      // Update balances
      await tx.balance.update({
        where: { userId: Number(from) },
        data: {
          amount: {
            decrement: amount,
          },
        },
      });

      await tx.balance.update({
        where: { userId: Number(toUser.id) },
        data: {
          amount: {
            increment: amount,
          },
        },
      });

      // Log the transaction
      await tx.p2pTransfer.create({
        data: {
          fromUserId: Number(from),
          toUserId: Number(toUser.id),
          amount,
          timestamp: new Date(),
        },
      });
    });

    console.log("Funds transferred successfully");
    return {
      message: "Funds transferred successfully",
    };
  } catch (e) {
    console.error("Funds transfer failed:", e);
    return {
      message: "Funds transfer Failed!",
    };
  }
}
