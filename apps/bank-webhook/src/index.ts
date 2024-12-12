import express from "express";
import db from "@repo/db/client";
const app = express();
app.use(express.json()); 

app.post("/hdfcWebhook", async (req, res) => {
  // TODO: Add zod validation here
  // check if this request actually came from hdfc and a webhook secret key
  // TODO: check if this opRampTxn is processing or not
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };
  // update balance in db, add txn
  try {
    await db.$transaction([

      db.balance.update({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
          },
        },
      }),

      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    res.status(200).json({
      message: "captured",
    });

  } 
  
  catch (e) {
    console.log(e);
    res.status(411).json({
      message: "Error while processing Webhook",
    });
  }
});

app.listen(3003,()=>{
  console.log("Server is running of 3003")
});