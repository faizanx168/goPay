"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { Select } from "@repo/ui/select";
import { use, useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { CreateOnRampTransaction } from "../app/lib/actions/createOnRamptnx";
import { P2PTransfer } from "../app/lib/actions/P2PTransfer";

export const SendCard = () => {
  const [amount, setAmount] = useState(0);
  const [number, setNumber] = useState("");
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
          <Button
            onClick={async () => {
              await P2PTransfer(number, amount);
            }}
          >
            Send Money
          </Button>
        </div>
      </div>
    </Card>
  );
};
