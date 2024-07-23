import express from "express";
import db from "@repo/db/client";

const app = express();

app.use(express.json());

app.post("/bank-hook", async (req, res) => {
  const paymentInformation = req.body;
  console.log(paymentInformation);
  try {
    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: Number(paymentInformation.user_identifier),
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
          },
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    res.json({
      message: "Captured",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003, () => {
  console.log("Bank webhook handler listening on port 3003");
});
