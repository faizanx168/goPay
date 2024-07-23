// app/(dashboard)/page.tsx
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { P2PTransactions } from "../../../components/P2PTransactions";
import { UserProfile } from "../../../components/UserProfile";
import TransactionsChart from "../../../components/TransactionsChart";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getBalance() {
  const session = await getServerSession(authOptions);
  const balance = await prisma.balance.findFirst({
    where: { userId: Number(session?.user?.id) },
  });
  return { amount: balance?.amount || 0, locked: balance?.locked || 0 };
}

async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.onRampTransaction.findMany({
    where: { userId: Number(session?.user?.id) },
  });
  return txns.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

async function getP2PTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: { fromUserId: Number(session?.user?.id) },
  });
  return txns.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
  }));
}

async function getUserProfile() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: Number(session?.user?.id) },
  });
  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.number || "",
  };
}

export default async function DashboardPage() {
  const balance = await getBalance();
  const onRampTransactions = await getOnRampTransactions();
  const p2pTransactions = await getP2PTransactions();
  const userProfile = await getUserProfile();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Dashboard
      </div>
      <div>
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
            <div className="text-4xl text-[#6a51a6] font-bold mb-8 text-center">
              Transactions
            </div>
            <TransactionsChart transactions={onRampTransactions} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <BalanceCard amount={balance.amount} locked={balance.locked} />
        </div>
      </div>
    </div>
  );
}
