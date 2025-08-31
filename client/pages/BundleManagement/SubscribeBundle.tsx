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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Package,
  Calendar,
  DollarSign,
} from "lucide-react";

interface Bundle {
  id: string;
  name: string;
  type: string;
  cost: number;
  validity: string;
  description: string;
  features: string[];
  category: string;
}

const availableBundles: Bundle[] = [
  {
    id: "BDL001",
    name: "Data Starter 1GB",
    type: "Data",
    cost: 99,
    validity: "30 days",
    description: "1GB data bundle for light internet usage",
    features: ["1GB Data", "30 Days Validity", "All Networks", "24/7 Support"],
    category: "Data",
  },
  {
    id: "BDL002",
    name: "Voice & SMS Combo",
    type: "Voice",
    cost: 150,
    validity: "7 days",
    description: "500 minutes + 1000 SMS bundle",
    features: ["500 Minutes", "1000 SMS", "7 Days Validity", "All Networks"],
    category: "Voice",
  },
  {
    id: "BDL003",
    name: "Weekend Data 5GB",
    type: "Data",
    cost: 199,
    validity: "3 days",
    description: "Special weekend data bundle",
    features: ["5GB Data", "Weekend Only", "3 Days Validity", "High Speed"],
    category: "Data",
  },
  {
    id: "BDL004",
    name: "Monthly Unlimited",
    type: "Data",
    cost: 2999,
    validity: "30 days",
    description: "Unlimited data for heavy users",
    features: [
      "Unlimited Data",
      "30 Days Validity",
      "Fair Usage Policy",
      "Premium Support",
    ],
    category: "Data",
  },
  {
    id: "BDL005",
    name: "International Bundle",
    type: "Voice",
    cost: 500,
    validity: "30 days",
    description: "International calling bundle",
    features: [
      "200 International Minutes",
      "30 Days Validity",
      "Selected Countries",
      "Quality Calls",
    ],
    category: "International",
  },
];

export default function SubscribeBundle() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedBundle, setSelectedBundle] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [subscriptionResult, setSubscriptionResult] = useState<any>(null);

  const getSelectedBundleDetails = () => {
    return availableBundles.find((bundle) => bundle.id === selectedBundle);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setSubscriptionResult(null);

    const bundleDetails = getSelectedBundleDetails();

    if (!bundleDetails) {
      setError("Please select a bundle to subscribe");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() > 0.1) {
        // 90% success rate
        const mockResult = {
          bundleName: bundleDetails.name,
          cost: bundleDetails.cost,
          validity: bundleDetails.validity,
          transactionId: `SUB${Date.now()}`,
          activationTime: new Date().toLocaleString(),
          expiryDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toLocaleDateString(),
        };

        setSubscriptionResult(mockResult);
        setSuccess(true);

        // Reset form after success
        setTimeout(() => {
          setPhoneNumber("");
          setSelectedBundle("");
          setSubscriptionResult(null);
          setSuccess(false);
        }, 6000);
      } else {
        setError("Subscription failed. Insufficient balance or network error.");
      }
    } catch (err) {
      setError("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Subscribe Bundle
          </h1>
          <p className="text-muted-foreground">
            Subscribe customers to available bundles and packages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Bundle Subscription Form
                </CardTitle>
                <CardDescription>
                  Select a customer and bundle to subscribe
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

                  {success && subscriptionResult && (
                    <Alert className="border-green-200 text-green-800 bg-green-50">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <p className="font-medium">
                            Subscription Successful!
                          </p>
                          <p>Bundle: {subscriptionResult.bundleName}</p>
                          <p>Cost: KES {subscriptionResult.cost}</p>
                          <p>
                            Transaction ID: {subscriptionResult.transactionId}
                          </p>
                          <p>Valid Until: {subscriptionResult.expiryDate}</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="flex items-center gap-2"
                    >
                      <Smartphone className="h-4 w-4" />
                      Customer Phone Number *
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
                    <Label htmlFor="bundle" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Select Bundle *
                    </Label>
                    <Select
                      value={selectedBundle}
                      onValueChange={setSelectedBundle}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a bundle" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBundles.map((bundle) => (
                          <SelectItem key={bundle.id} value={bundle.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{bundle.name}</span>
                              <span className="ml-4 text-sm text-muted-foreground">
                                KES {bundle.cost}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedBundle && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Bundle Details</h4>
                      {(() => {
                        const bundle = getSelectedBundleDetails();
                        if (!bundle) return null;
                        return (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Cost:</span>
                              <span className="font-medium">
                                KES {bundle.cost}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Validity:</span>
                              <span className="font-medium">
                                {bundle.validity}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Type:</span>
                              <Badge variant="outline">{bundle.category}</Badge>
                            </div>
                            <p className="text-muted-foreground">
                              {bundle.description}
                            </p>
                            <div>
                              <span className="font-medium">Features:</span>
                              <ul className="mt-1 space-y-1">
                                {bundle.features.map((feature, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <div className="h-1 w-1 bg-brand rounded-full" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-brand hover:bg-brand-600"
                    disabled={loading || !phoneNumber || !selectedBundle}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing Subscription...
                      </div>
                    ) : (
                      "Subscribe Bundle"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Bundles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableBundles.slice(0, 3).map((bundle) => (
                    <div key={bundle.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{bundle.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {bundle.category}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-brand font-bold">
                          KES {bundle.cost}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {bundle.validity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="border-b pb-2">
                    <div className="flex justify-between font-medium">
                      <span>+254712345678</span>
                      <span className="text-green-600">Data Starter</span>
                    </div>
                    <p className="text-xs text-muted-foreground">5 mins ago</p>
                  </div>

                  <div className="border-b pb-2">
                    <div className="flex justify-between font-medium">
                      <span>+254787654321</span>
                      <span className="text-green-600">Voice Combo</span>
                    </div>
                    <p className="text-xs text-muted-foreground">15 mins ago</p>
                  </div>

                  <div className="border-b pb-2">
                    <div className="flex justify-between font-medium">
                      <span>+254711111111</span>
                      <span className="text-green-600">Weekend Data</span>
                    </div>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subscriptions:</span>
                    <span className="font-medium">84</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-medium">KES 12,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-medium text-green-600">96.4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
