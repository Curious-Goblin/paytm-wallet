"use client";

export const RecentTxn = async ({
  transactions,
}: {
  transactions: {
    amount: number;
    timestamp: Date;
    type: string;
    counterparty: string | null;
  }[];
}) => {
  return (
    <div className="">
      {transactions.map((t, index) => (
        <div
          key={index}
          className="flex justify-between border-b pb-2 mb-2 items-center"
        >
          <div>
            <div className="text-sm">
              {t.type === "received"
                ? `Received INR${t.counterparty ? ` from ${t.counterparty}` : ""}`
                : "Sent INR"}
            </div>
            <div className="text-slate-600 text-xs">
              {t.timestamp.toDateString()}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span
              className={`${
                t.type === "received" ? "text-green-500" : "text-red-500"
              }`}
            >
              {t.type === "received" ? "+" : "-"} Rs {t.amount / 100}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
