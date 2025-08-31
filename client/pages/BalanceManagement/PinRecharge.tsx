import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Hash,
} from "lucide-react";

export default function PinRecharge() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pinNumber, setPinNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [rechargeResult, setRechargeResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setRechargeResult(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() > 0.15) {
        // 85% success rate
        const mockResult = {
          amount: Math.floor(Math.random() * 500) + 10,
          transactionId: `TXN${Date.now()}`,
          newBalance: Math.floor(Math.random() * 1000) + 100,
          timestamp: new Date().toLocaleString(),
        };

        setRechargeResult(mockResult);
        setSuccess(true);

        // Reset form after success
        setTimeout(() => {
          setPhoneNumber("");
          setPinNumber("");
          setRechargeResult(null);
          setSuccess(false);
        }, 5000);
      } else {
        setError(
          "Invalid PIN or PIN already used. Please check and try again.",
        );
      }
    } catch (err) {
      setError("Recharge failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">PIN Recharge</h1>
          <p className="text-muted-foreground">
            Process PIN recharges for customer accounts
          </p>
        </div>

        {/* PIN Recharge Form */}
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                PIN Recharge
              </CardTitle>
              <CardDescription>
                Enter phone number and scratch card PIN to process recharge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && rechargeResult && (
                  <Alert className="border-green-200 text-green-800 bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">Recharge Successful!</p>
                        <p>Amount: KES {rechargeResult.amount}</p>
                        <p>Transaction ID: {rechargeResult.transactionId}</p>
                        <p>New Balance: KES {rechargeResult.newBalance}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="flex items-center gap-2"
                    >
                      <Smartphone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="e.g., +254712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="pinNumber"
                      className="flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      Scratch Card PIN *
                    </Label>
                    <Input
                      id="pinNumber"
                      type="text"
                      placeholder="Enter 16-digit PIN"
                      value={pinNumber}
                      onChange={(e) =>
                        setPinNumber(
                          e.target.value.replace(/\D/g, "").substring(0, 16),
                        )
                      }
                      required
                      maxLength={16}
                      minLength={10}
                    />
                    <p className="text-xs text-muted-foreground">
                      PIN should be 10-16 digits long
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-600"
                  disabled={
                    loading ||
                    phoneNumber.length < 10 ||
                    pinNumber.length < 10
                  }
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing Recharge...
                    </div>
                  ) : (
                    "Process Recharge"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
