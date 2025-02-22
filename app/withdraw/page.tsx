"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRightLeft } from "lucide-react";
import { TOKENS } from "@/constants/tokens";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { isAddress, zeroAddress } from "viem"; // optional validation helpers
import { getBalance } from "@wagmi/core";
const TornadoAbi = [
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [
      { name: "root", type: "bytes32" },
      { name: "nullifierHash", type: "bytes32" },
      { name: "recipient", type: "address" },
    ],
  },
] as const;
import { config } from "../../config";

const TORNADO_CONTRACT_ADDRESS = "0xb581c9264f59bf0289fa76d61b2d0746dce3c30d";

export default function Withdraw() {
  const [root, setRoot] = useState("");
  const [selectedToken, setSelectedToken] = useState(TOKENS[0].symbol);
  const [recipient, setRecipient] = useState("");
  const [nullifierHash, setNullifierHash] = useState("");

  const {
    data: withdrawData,
    isSuccess: isWithdrawSuccess,
    error,
    writeContract,
  } = useWriteContract({
    config,
  });

  const { isSuccess: isTxDone } = useWaitForTransactionReceipt({
    hash: withdrawData as `0x${string}`,
  });

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getBalance(config, {
        address: TORNADO_CONTRACT_ADDRESS as `0x${string}`,
        unit: "ether",
        blockTag: "latest",
      });
      console.log("balance", balance);
    };
    fetchBalance();
  }, []);

  if (isWithdrawSuccess && isTxDone) {
    alert("Withdraw successful");
  } else if (error) {
    alert("Withdraw failed");
    console.error("error", error);
  }

  const handleWithdraw = () => {
    // todo
    // if (!isConnected) {
    //   alert("Wallet not connected!");
    //   return;
    // }

    if (selectedToken !== "ETH") {
      alert("This contract only supports ETH (fixed 1ETH) withdraw");
      return;
    }
    if (!root || !nullifierHash || !recipient) {
      alert("Please fill in root, nullifierHash, recipient");
      return;
    }
    if (!isAddress(recipient) || recipient === zeroAddress) {
      alert("Invalid recipient address");
      return;
    }
    if (!writeContract) {
      alert("Withdraw not ready (wagmi hook not initialized?)");
      return;
    }
    try {
      setTimeout(() => {
        writeContract({
          abi: TornadoAbi,
          address: TORNADO_CONTRACT_ADDRESS,
          functionName: "withdraw",
          args: [
            root as `0x${string}`,
            nullifierHash as `0x${string}`,
            recipient as `0x${string}`,
          ],
        });
      }, 100);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">Select Token</Label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {TOKENS.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  {token.name} ({token.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="root">Root</Label>
          <Input
            id="root"
            placeholder="bytes32 root (0x...)"
            value={root}
            onChange={(e) => setRoot(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Ethereum Address</Label>
          <Input
            id="recipient"
            placeholder="Enter Ethereum address (0x...)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="note">Privacy Note</Label>
          <Input
            id="note"
            placeholder="Enter privacy note"
            value={nullifierHash}
            onChange={(e) => setNullifierHash(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={handleWithdraw}
        >
          <ArrowRightLeft className="mr-2" /> Withdraw {selectedToken}
        </Button>
      </CardFooter>
    </Card>
  );
}
