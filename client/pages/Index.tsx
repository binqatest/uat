import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";

interface AccountData {
  id: string;
  bundleName: string;
  bucketName: string;
  accountType: string;
  status: string;
  balance: string;
  lastUpdated: string;
}

// Mock data for demonstration
const mockAccountData: AccountData[] = [
  {
    id: "1",
    bundleName: "Premium Data Bundle",
    bucketName: "Primary Bucket",
    accountType: "Postpaid",
    status: "Active",
    balance: "$125.50",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    bundleName: "Voice & SMS Bundle",
    bucketName: "Secondary Bucket",
    accountType: "Prepaid",
    status: "Active",
    balance: "$67.20",
    lastUpdated: "2024-01-14",
  },
  {
    id: "3",
    bundleName: "International Bundle",
    bucketName: "International Bucket",
    accountType: "Postpaid",
    status: "Suspended",
    balance: "$0.00",
    lastUpdated: "2024-01-10",
  },
];

export default function Index() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountData, setAccountData] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Load initial data
  useEffect(() => {
    setAccountData(mockAccountData);
    setHasSearched(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock search results - in real app this would be an API call
      if (phoneNumber.includes("555")) {
        setAccountData(
          mockAccountData.filter((account) => account.status === "Active"),
        );
      } else {
        setAccountData([]);
      }
      setHasSearched(true);
    } catch (err) {
      setError("Failed to fetch account details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Account Details
          </h1>
          <p className="text-muted-foreground">
            Manage and view account information, bundles, and balances
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle>Search Account</CardTitle>
            <CardDescription>
              Enter a phone number to retrieve account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number (e.g., +1-555-123-4567)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-brand hover:bg-brand-600"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Table */}
        {hasSearched && (
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                {accountData.length > 0
                  ? `Found ${accountData.length} account(s)`
                  : "No results found"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accountData.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bundle Name</TableHead>
                        <TableHead>Bucket Name</TableHead>
                        <TableHead>Account Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountData.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">
                            {account.bundleName}
                          </TableCell>
                          <TableCell>{account.bucketName}</TableCell>
                          <TableCell>{account.accountType}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                account.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {account.status}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">
                            {account.balance}
                          </TableCell>
                          <TableCell>{account.lastUpdated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    No results found. Please try a different phone number.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
