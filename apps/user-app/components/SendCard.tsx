"use client";
import { Button } from "./Button";
import { Card } from "@repo/ui/card";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { P2PTransfer } from "../app/lib/actions/P2PTransfer";

export const SendCard = () => {
  const [amount, setAmount] = useState(0);
  const [number, setNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSendMoney = async () => {
    if (amount <= 0) {
      setFeedback("Please enter a valid amount");
      return;
    }
    setIsLoading(true);
    try {
      const { message } = await P2PTransfer(number, amount * 100);
      setFeedback(message);
    } catch (error) {
      setFeedback("failed!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card title="Send Money">
      <div className="w-full">
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          onChange={(value) => {
            setAmount(Number(value));
          }}
        />
        <TextInput
          label={"Phone Number"}
          placeholder={"Phone Number"}
          onChange={(value) => {
            setNumber(value);
          }}
        />
        <div className="flex justify-center pt-4">
          <Button onClick={handleSendMoney} disabled={isLoading}>
            {isLoading ? "Processing..." : "Send Money"}
          </Button>
        </div>
        {feedback && <div className="text-center pt-4">{feedback}</div>}
      </div>
    </Card>
  );
};
