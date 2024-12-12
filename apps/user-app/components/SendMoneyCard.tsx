"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textInput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { useRouter } from "next/navigation";

export default function SendMoney() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const router = useRouter();
  return (
    <div className="h-[90vh]">
      <Center>
        <Card title="Send">
          <div className="min-w-72 pt-2">
            <TextInput
              label={"Number"}
              placeholder={"XXXXXXXXXX"}
              onChange={(value) => {
                setNumber(value);
              }}
            />
            <TextInput
              label={"Amount"}
              placeholder={"Amount"}
              onChange={(value) => {
                setAmount(value);
              }}
            />
            <div className="flex justify-center pt-4">
              <Button
                onClick={async () => {
                  const response = await p2pTransfer(number, amount);
                  if(response.status!=200){
                    alert(response.message)
                  }
                  else{
                      router.push('/transfer')
                  }
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </Center>
    </div>
  );
}
