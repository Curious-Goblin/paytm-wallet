"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from "@repo/db/client";

export async function createOnRampTransaction(provider: string, value: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session?.user?.id) {
    return {
      message: "user not authenticated",
    };
  }
  const user_id = session?.user.id;
  const token = (Math.floor(Math.random() * 100) + 1).toString();
  const amount = Number(value) * 100;
  console.log("on ramp txn initiated");
  await db.onRampTransaction.create({
    data: {
      userId: Number(user_id),
      token: token,
      provider: provider,
      amount: amount,
      status: "Processing",
      startTime: new Date(),
    },
  });
  console.log("on ramp txn was made");
}
