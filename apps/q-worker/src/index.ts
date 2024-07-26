import { createClient } from "redis";
import axios from "axios";

const redisClient = createClient({
  url: "redis://redis:6379",
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Worker connected to Redis");
  }
})();

async function processQueue() {
  while (true) {
    try {
      const transaction = await redisClient.brPop("transactions", 0);
      if (transaction) {
        const { transactionId, amount, userId, token } = JSON.parse(
          transaction.element
        );
        console.log("transaction", transaction);
        try {
          await new Promise((resolve) => setTimeout(resolve, 4000));
          const result = await axios.post(
            `http://ec2-3-12-102-229.us-east-2.compute.amazonaws.com/webhook/bank-hook`,
            {
              token,
              user_identifier: userId,
              amount,
            }
          );

          if (result.data.message === "Captured") {
            console.log(`Processed transaction ${transactionId}`);
          } else {
            throw new Error("Failed to capture transaction");
          }
        } catch (error) {
          console.error(
            `Failed to process transaction ${transactionId}:`,
            error
          );
        }
      } else {
        console.log("No transactions to process, waiting...");
      }
    } catch (error) {
      console.error("Redis error:", error);
    }
  }
}

processQueue().catch((err) => console.error("Worker error:", err));
