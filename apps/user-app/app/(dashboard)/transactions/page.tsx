import { RecentTxn } from "../../../components/RecentTxnCard";
import { Transactions } from "../../lib/actions/transaction";

type Transfer = {
  type: string;
  amount: number;
  timestamp: Date;
  counterparty: string | null;
}[];

export default async function RecentTransactions() {
  try {
    const response = await Transactions();
    if (!response.allTransfers) {
      return {
        message: "error occured",
      };
    }
    const transactions: Transfer = response.allTransfers;

    return (
      <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
          Recent Transactions
        </div>
        <div className="p-4 border rounded-md">
          {transactions.length > 0 ? (
            <RecentTxn transactions={transactions} />
          ) : (
            <div>No transactions available</div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
}