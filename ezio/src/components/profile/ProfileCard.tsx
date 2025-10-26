"use client";

import { useNexus } from "@/providers/NexusProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Copy, Send, Lock, Unlock } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { sepolia } from "wagmi/chains";

const ProfileCard = () => {
  const { nexusSDK } = useNexus();
  const { address, isConnected, chain } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
    chainId: sepolia.id,
  });

  const [publicBalance, setPublicBalance] = useState<string>("0.00");
  const [privateBalance, setPrivateBalance] = useState<string>("10.00"); // Hardcoded 10 ETH
  const [privateBalanceHash, setPrivateBalanceHash] = useState<string>("");
  const [randomness, setRandomness] = useState<string>("");
  const [showSendDialog, setShowSendDialog] = useState<boolean>(false);
  const [sendAmount, setSendAmount] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const {
    data: hash,
    sendTransaction,
    isPending: isTransactionPending,
  } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Generate SHA256 hash with randomness
  const generatePrivateBalanceHash = async (balance: string) => {
    const random = Math.random().toString(36).substring(2, 15);
    setRandomness(random);
    const dataToHash = `${balance}-${random}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(dataToHash);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  // Initialize balances from MetaMask
  useEffect(() => {
    const initBalances = async () => {
      // Set public balance from actual wallet balance
      if (balanceData) {
        const balance = formatEther(balanceData.value);
        setPublicBalance(parseFloat(balance).toFixed(4));
      } else {
        setPublicBalance("0.00");
      }

      // Private balance is hardcoded to 10 ETH
      const privBalance = "10.00";
      setPrivateBalance(privBalance);

      const hash = await generatePrivateBalanceHash(privBalance);
      setPrivateBalanceHash(hash);
    };

    if (isConnected) {
      initBalances();
    }
  }, [balanceData, isConnected]);

  // Placeholder handlers - to be implemented later
  const handleSend = () => {
    setSendAmount(""); // Reset amount when opening dialog
    setRecipientAddress(""); // Reset recipient address
    setShowSendDialog(true);
  };

  const handlePublicSend = async () => {
    if (!recipientAddress || !sendAmount || !isConnected) {
      console.error("Missing required fields or wallet not connected");
      return;
    }

    try {
      setIsSending(true);

      // Send the transaction
      sendTransaction({
        to: recipientAddress as `0x${string}`,
        value: parseEther(sendAmount),
        chainId: sepolia.id,
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      setIsSending(false);
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      console.log("Transaction confirmed:", hash);
      setShowSendDialog(false);
      setSendAmount("");
      setRecipientAddress("");
      setIsSending(false);
    }
  }, [isConfirmed, hash]);

  const handlePrivateSend = () => {
    console.log("Private send clicked - functionality to be implemented");
    console.log("Amount:", sendAmount);
    console.log("Private Balance:", privateBalance);
    // Close dialog after action
    setShowSendDialog(false);
    setSendAmount("");
  };

  const handleProof = () => {
    console.log("Proof button clicked - functionality to be implemented");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log("Copied to clipboard:", text);
  };

  return (
    <div className="w-full max-w-4xl mx-auto z-10 space-y-6">
      {/* Wallet Connection Notice */}
      {!isConnected && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              Please connect your wallet to view your balance and make
              transactions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Wrong Network Notice */}
      {isConnected && chain?.id !== sepolia.id && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-red-700">
              Please switch to Sepolia testnet to use this app. Current network:{" "}
              {chain?.name || "Unknown"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Profile Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Account Overview</CardTitle>
          <CardDescription>
            View your public and private balances
            {isConnected && address && (
              <span className="block mt-1 font-mono text-xs">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Public Balance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Public Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{publicBalance}</span>
                  <span className="text-xl font-semibold text-muted-foreground">
                    ETH
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Available on Sepolia testnet
                </p>
              </CardContent>
            </Card>

            {/* Private Balance with Hash */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Private Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Balance Display */}
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{privateBalance}</span>
                  <span className="text-xl font-semibold text-muted-foreground">
                    ETH
                  </span>
                </div>

                {/* Randomness */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Randomness:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted p-1.5 rounded font-mono flex-1 break-all">
                      {randomness}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => copyToClipboard(randomness)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* SHA256 Hash */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    SHA256 Hash:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] bg-muted p-1.5 rounded break-all font-mono flex-1">
                      {privateBalanceHash}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => copyToClipboard(privateBalanceHash)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Shielded funds with cryptographic commitment
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={handleSend} size="lg" className="min-w-[150px]">
              Send
            </Button>
            <Button
              onClick={handleProof}
              variant="outline"
              size="lg"
              className="min-w-[150px]"
            >
              Generate Proof
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for future features */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Your recent transactions will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No transactions yet
          </p>
        </CardContent>
      </Card> */}

      {/* Send Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Funds</DialogTitle>
            <DialogDescription>
              Choose the type of transaction you want to make
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Recipient Address Input */}
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                type="text"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETH)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.0"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                step="0.0001"
                min="0"
              />
            </div>

            {/* Public Send Option */}
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Unlock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Public Send</h3>
                        <p className="text-sm text-muted-foreground">
                          Standard transaction
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      Available Balance:
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{publicBalance} ETH</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePublicSend}
                    className="w-full"
                    disabled={
                      !recipientAddress ||
                      !sendAmount ||
                      isTransactionPending ||
                      isConfirming ||
                      isSending
                    }
                  >
                    {isTransactionPending || isConfirming || isSending ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Public Send
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Private Send Option */}
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Private Send</h3>
                        <p className="text-sm text-muted-foreground">
                          Shielded transaction
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      Available Balance:
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{privateBalance} ETH</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePrivateSend}
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Private Send (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileCard;
