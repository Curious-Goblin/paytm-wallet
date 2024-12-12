"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

type Transfer = {
  type: string;
  amount: number;
  timestamp: Date;
  counterparty: string | null;
}[];

type TransactionsResponse = { message?: string; allTransfers?: Transfer };

export const Transactions = async (): Promise<TransactionsResponse> => {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session?.user?.id) {
    return {
      message: "user not authenticated",
    };
  }
  const userId = Number(session.user.id);

  const recievedTransfer = await prisma.user.findMany({
    where: {
      id: userId,
    },
    select: {
      recievedTransfer: {
        select: {
          amount: true,
          timestamp: true,
          fromUser: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const sentTransfer = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      sentTransfer: {
        select: {
          amount: true,
          timestamp: true,
          toUser: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const receivedTransfersArray = recievedTransfer.flatMap((user) =>
    user.recievedTransfer.map((transfer) => ({
      type: "received",
      amount: transfer.amount,
      timestamp: transfer.timestamp,
      counterparty: transfer.fromUser.name,
    }))
  );

  const sentTransfersArray =
    sentTransfer?.sentTransfer.map((transfer) => ({
      type: "sent",
      amount: transfer.amount,
      timestamp: transfer.timestamp,
      counterparty: transfer.toUser.name,
    })) || [];

  const allTransfers: Transfer = [
    ...receivedTransfersArray,
    ...sentTransfersArray,
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return {
    allTransfers,
  };
};
