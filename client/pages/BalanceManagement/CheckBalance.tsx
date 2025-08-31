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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Search,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Wallet,
  Package,
  Banknote,
  History,
  Home,
  User,
  Calendar,
} from "lucide-react";

interface AccountData {
  phoneNumber: string;
  accountInfo: {
    customerName: string;
    accountType: string;
    status: string;
    registrationDate: string;
    lastActivity: string;
    mainBalance: number;
    bonusBalance: number;
    accountId: string;
    state1: string;
    state2: string;
    accountBalance: number;
    deviceId: string;
    creationTime: string;
    lastUpdateTime: string;
    validityTime: string;
  };
  bundles_details?: {
    id: string;
    bundleName: string;
    bucketName: string;
    measure: string;
    initialValue: number;
    currentValue: number;
    unusedValue: number;
  }[];
  loanInstances?: {
    id: string;
    amount: number;
    serviceFee: number;
    remainingDebt: number;
    creationTime: string;
  }[];
  recharge_history?: {
    id: string;
    time: string;
    amount: number;
    channel: string;
    bonus: string;
  }[];
}

// Account Info Card Component
const AccountInfoCard = ({
  accountInfo,
  msisdn,
}: {
  accountInfo: AccountData["accountInfo"];
  msisdn: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Account Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account ID:</span>
              <span className="font-medium">{accountInfo.accountId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">State 1:</span>
              <span className="font-medium">{accountInfo.state1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">State 2:</span>
              <span className="font-medium">{accountInfo.state2}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Type:</span>
              <span className="font-medium">{accountInfo.accountType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Balance:</span>
              <span className="font-bold text-brand">
                KES {accountInfo.accountBalance.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Device ID:</span>
              <span className="font-medium">{accountInfo.deviceId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MSISDN:</span>
              <span className="font-medium">{msisdn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Creation Time:</span>
              <span className="font-medium">{accountInfo.creationTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Update Time:</span>
              <span className="font-medium">{accountInfo.lastUpdateTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Validity Time:</span>
              <span className="font-medium">{accountInfo.validityTime}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Bundles Table Component
const BundlesTable = ({
  bundles,
}: {
  bundles?: AccountData["bundles_details"];
}) => {
  if (!bundles || bundles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Bundles Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bundles available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Bundles Details ({bundles.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bundle Name</TableHead>
                <TableHead>Bucket Name</TableHead>
                <TableHead>Measure</TableHead>
                <TableHead>Initial Value</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Unused Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bundles.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.bundleName}</TableCell>
                  <TableCell>{b.bucketName}</TableCell>
                  <TableCell>{b.measure}</TableCell>
                  <TableCell>{b.initialValue}</TableCell>
                  <TableCell>{b.currentValue}</TableCell>
                  <TableCell>{b.unusedValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// Loans Table Component
const LoansTable = ({ loans }: { loans?: AccountData["loanInstances"] }) => {
  if (!loans || loans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Loan Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Banknote className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No loans available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-5 w-5" />
          Loan Information ({loans.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Service Fee</TableHead>
                <TableHead>Remaining Debt</TableHead>
                <TableHead>Creation Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.id}</TableCell>
                  <TableCell>KES {loan.amount.toFixed(2)}</TableCell>
                  <TableCell>KES {loan.serviceFee.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">
                    KES {loan.remainingDebt.toFixed(2)}
                  </TableCell>
                  <TableCell>{loan.creationTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// Recharge History Table Component
const RechargeHistoryTable = ({
  history,
}: {
  history?: AccountData["recharge_history"];
}) => {
  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recharge History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recharge history.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Recharge History ({history.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recharge ID</TableHead>
                <TableHead>Recharge Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Bonus (First Bundle ID)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell>{r.time}</TableCell>
                  <TableCell>KES {r.amount.toFixed(2)}</TableCell>
                  <TableCell>{r.channel}</TableCell>
                  <TableCell>{r.bonus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CheckBalance() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setAccountData(null);

    try {
      if (!phoneNumber.trim()) {
        setError("Phone number is required");
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (Math.random() > 0.1) {
        // 90% success rate
        // Mock account data (structured to match required display)
        const mainBalance = 245.5;
        const bonusBalance = 50.0;
        const mockAccountData: AccountData = {
          phoneNumber: phoneNumber,
          accountInfo: {
            customerName: "John Doe Mwangi",
            accountType: "Prepaid",
            status: "Active",
            registrationDate: "2022-03-15",
            lastActivity: "2024-01-15 14:30",
            mainBalance,
            bonusBalance,
            accountId: `ACC${Date.now()}`,
            state1: "Active",
            state2: "Verified",
            accountBalance: mainBalance + bonusBalance,
            deviceId: "DEV-9843-XY",
            creationTime: "2022-03-15 10:05",
            lastUpdateTime: new Date().toLocaleString(),
            validityTime: "2025-12-31 23:59",
          },
          bundles_details: [
            {
              id: "BDL-001",
              bundleName: "Data Starter",
              bucketName: "DATA_MAIN",
              measure: "MB",
              initialValue: 1024,
              currentValue: 750,
              unusedValue: 274,
            },
            {
              id: "BDL-002",
              bundleName: "Voice Bundle",
              bucketName: "VOICE_MIN",
              measure: "Minutes",
              initialValue: 200,
              currentValue: 120,
              unusedValue: 80,
            },
          ],
          loanInstances: [
            {
              id: "LN-1001",
              amount: 100.0,
              serviceFee: 5.0,
              remainingDebt: 105.0,
              creationTime: "2024-01-10 09:20",
            },
          ],
          recharge_history: [
            {
              id: "RCG-001",
              time: "2024-01-15 14:30",
              amount: 100.0,
              channel: "PIN",
              bonus: "BDL-001",
            },
            {
              id: "RCG-002",
              time: "2024-01-12 16:00",
              amount: 50.0,
              channel: "MPESSA",
              bonus: "BDL-002",
            },
            {
              id: "RCG-003",
              time: "2024-01-10 11:45",
              amount: 200.0,
              channel: "Bank",
              bonus: "BDL-001",
            },
          ],
        };

        setAccountData(mockAccountData);
        setSuccessMessage(
          `Account information retrieved successfully for ${phoneNumber}`,
        );
      } else {
        setError(
          "Phone number not found or account inactive. Please check and try again.",
        );
      }
    } catch (err) {
      setError("Failed to retrieve account information. Please try again.");
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
              <BreadcrumbPage>Check Balance</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Check Balance
          </h1>
          <p className="text-muted-foreground">
            Search and view comprehensive account information
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Account Search
            </CardTitle>
            <CardDescription>
              Enter MSISDN to retrieve complete account information
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

              {successMessage && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="flex items-center gap-2"
                  >
                    <Smartphone className="h-4 w-4" />
                    MSISDN
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
                <div className="flex md:col-span-1">
                  <Button
                    type="submit"
                    className="w-full bg-brand hover:bg-brand-600"
                    disabled={loading || !phoneNumber}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Searching...
                      </div>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Check Balance
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Conditional Display Sections */}
        {accountData && (
          <div className="space-y-6">
            {/* Account Details */}
            <AccountInfoCard
              accountInfo={accountData.accountInfo}
              msisdn={accountData.phoneNumber}
            />

            {/* Bundles Details */}
            <BundlesTable bundles={accountData.bundles_details} />

            {/* Loan Information */}
            <LoansTable loans={accountData.loanInstances} />

            {/* Recharge History */}
            <RechargeHistoryTable history={accountData.recharge_history} />
          </div>
        )}
      </div>
    </Layout>
  );
}
