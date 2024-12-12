"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export const p2pTransfer = async (number: string, value: string) => {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session?.user?.id) {
    return {
      message: "user not authenticated",
    };
  }
  const userId = session?.user?.id;
  const amount = Number(value) * 100;
  try {
    const recipient = await prisma.user.findUnique({
      where: {
        number: number,
      },
    });
    if (!recipient) {
      return {
        message: "details are incorrect",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(userId)} FOR UPDATE`;
      const senderBalance = await tx.balance.findUnique({
        where: {
          userId: Number(userId),
        },
        select: {
          amount: true,
        },
      });
      console.log("above sleep");
      await new Promise((res) => setTimeout(res, 4000));
      console.log("after sleep");
      if (!senderBalance || senderBalance.amount < amount) {
        throw new Error("insufficient balance");
      }

      await tx.balance.update({
        where: {
          userId: Number(userId),
        },
        data: {
          amount: {
            decrement: amount,
          },
        },
      });

      await tx.balance.update({
        where: {
          userId: recipient.id,
        },
        data: {
          amount: {
            increment: amount,
          },
        },
      });
    });
    return {
      status: 200,
      message: "transfer completed successfully",
    };
  } catch (e: any) {
    return {
      message: e.message,
    };
  }
};
