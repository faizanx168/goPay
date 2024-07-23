"use client";
import { Button } from "./Button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { CreateOnRampTransaction } from "../app/lib/actions/createOnRamptnx";

const SUPPORTED_BANKS = [
  {
    name: "TD Bank",
  },
  {
    name: "Chase Bank",
  },
];

export const AddMoney = () => {
  const [amount, setAmount] = useState(0);
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleAddMoney = async () => {
    if (amount <= 0) {
      setFeedback("Please enter a valid amount");
      return;
    }
    setIsLoading(true);
    try {
      await CreateOnRampTransaction(Number(amount * 100), provider || "");
      setFeedback("Transaction successful!");
    } catch (error) {
      setFeedback("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          onChange={(value) => setAmount(Number(value))}
        />
        <div className="py-4 text-left">Bank</div>
        <Select
          onSelect={(value) => {
            const selectedBank = SUPPORTED_BANKS.find((x) => x.name === value);
            setProvider(selectedBank?.name || "");
          }}
          options={SUPPORTED_BANKS.map((x) => ({
            key: x.name,
            value: x.name,
          }))}
        />
        <div className="flex justify-center pt-4">
          <Button onClick={handleAddMoney} disabled={isLoading}>
            {isLoading ? "Processing..." : "Add Money"}
          </Button>
        </div>
        {feedback && <div className="text-center pt-4">{feedback}</div>}
      </div>
    </Card>
  );
};
