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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  PlusCircle,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Package,
  Home,
} from "lucide-react";

export default function SubscribeBundle() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bundleId, setBundleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [subscriptionResult, setSubscriptionResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setSubscriptionResult(null);

    if (!bundleId.trim()) {
      setError("Please enter a bundle ID to subscribe");
      setLoading(false);
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      setLoading(false);
      return;
    }

    try {
      // Call the backend API
      const response = await fetch("/api/bundle-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          msisdn: phoneNumber,
          nccId: bundleId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const mockResult = {
          bundleId: bundleId,
          phoneNumber: phoneNumber,
          transactionId: data.subscriptionId,
          activationTime: new Date().toLocaleString(),
          status: "Active",
        };

        setSubscriptionResult(mockResult);
        setSuccess(true);

        // Reset form after success
        setTimeout(() => {
          setPhoneNumber("");
          setBundleId("");
          setSubscriptionResult(null);
          setSuccess(false);
        }, 8000);
      } else {
        setError(data.message || "Subscription failed. Please try again.");
      }
    } catch (err) {
      setError(
        "Subscription failed. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Subscribe Bundle</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Subscribe Bundle
          </h1>
          <p className="text-muted-foreground">
            Subscribe customers to bundles using Bundle ID
          </p>
        </div>

        {/* Subscription Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Bundle Subscription Form
              </CardTitle>
              <CardDescription>
                Enter customer phone number and bundle ID to subscribe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && subscriptionResult && (
                  <Alert className="border-green-200 text-green-800 bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium text-lg">
                          Subscription Successful!
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p>
                            <span className="font-medium">Phone Number:</span>{" "}
                            {subscriptionResult.phoneNumber}
                          </p>
                          <p>
                            <span className="font-medium">Bundle ID:</span>{" "}
                            {subscriptionResult.bundleId}
                          </p>
                          <p>
                            <span className="font-medium">Transaction ID:</span>{" "}
                            {subscriptionResult.transactionId}
                          </p>
                          <p>
                            <span className="font-medium">
                              Activation Time:
                            </span>{" "}
                            {subscriptionResult.activationTime}
                          </p>
                          <p>
                            <span className="font-medium">Status:</span>{" "}
                            <span className="text-green-600">
                              {subscriptionResult.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="flex items-center gap-2 text-base"
                  >
                    <Smartphone className="h-4 w-4" />
                    Customer Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="e.g., +254712345678 or 254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bundleId"
                    className="flex items-center gap-2 text-base"
                  >
                    <Package className="h-4 w-4" />
                    Insert Bundle ID *
                  </Label>
                  <Input
                    id="bundleId"
                    type="text"
                    placeholder="e.g., CBU001, EBU002, MPE003"
                    value={bundleId}
                    onChange={(e) => setBundleId(e.target.value.toUpperCase())}
                    className="text-base"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-600 text-base py-6"
                  disabled={loading || !phoneNumber.trim() || !bundleId.trim()}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing Subscription...
                    </div>
                  ) : (
                    <>
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Subscribe Bundle
                    </>
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
