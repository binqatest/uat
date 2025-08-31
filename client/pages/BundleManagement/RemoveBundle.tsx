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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  XCircle,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Search,
  Trash2,
  AlertTriangle,
  Home,
} from "lucide-react";

interface BundleDetail {
  id: string;
  bundleName: string;
  bundleType: string;
  subscriptionDate: string;
  expiryDate: string;
  remaining: string;
  status: string;
  price: number;
  nccId: string;
}

// Page Title Component
const PageTitle = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Remove Bundle</h1>
      <p className="text-muted-foreground">
        Search and remove active bundles from customer accounts
      </p>
    </div>
  );
};

// Fetch Form Component
const FetchForm = ({
  phoneNumber,
  setPhoneNumber,
  onSubmit,
  loading,
}: {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Bundle Search
        </CardTitle>
        <CardDescription>
          Enter MSISDN to fetch active bundles for removal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
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
                    Fetching...
                  </div>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Fetch Bundles
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Alert Component
const AlertComponent = ({
  messages,
  statusCode,
}: {
  messages: string;
  statusCode: number | null;
}) => {
  if (!messages) return null;

  const isSuccess = statusCode === 200 || statusCode === 201;
  const isError = statusCode && statusCode >= 400;

  return (
    <Alert
      variant={isError ? "destructive" : "default"}
      className={isSuccess ? "border-green-200 bg-green-50 text-green-800" : ""}
    >
      {isSuccess ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertDescription>
        <div>
          <p className="font-medium">{messages}</p>
          {statusCode && (
            <p className="text-sm mt-1 opacity-90">Status Code: {statusCode}</p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Bundles Table Component
const BundlesTable = ({
  bundlesDetails,
  onDeleteBundle,
  loading,
}: {
  bundlesDetails: BundleDetail[];
  onDeleteBundle: (bundle: BundleDetail) => void;
  loading: boolean;
}) => {
  const [selectedBundle, setSelectedBundle] = useState<BundleDetail | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedBundle) return;

    setDeleteLoading(true);
    try {
      await onDeleteBundle(selectedBundle);
    } finally {
      setDeleteLoading(false);
      setSelectedBundle(null);
    }
  };

  if (bundlesDetails.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Bundle Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No active bundles found for this phone number</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          Bundle Details ({bundlesDetails.length} found)
        </CardTitle>
        <CardDescription>Active bundles available for removal</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bundle Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subscription Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bundlesDetails.map((bundle) => (
                <TableRow key={bundle.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{bundle.bundleName}</p>
                      <p className="text-xs text-muted-foreground">
                        NCC ID: {bundle.nccId}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{bundle.bundleType}</Badge>
                  </TableCell>
                  <TableCell>{bundle.subscriptionDate}</TableCell>
                  <TableCell>{bundle.expiryDate}</TableCell>
                  <TableCell className="font-medium">
                    {bundle.remaining}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        bundle.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : bundle.status === "DELETED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {bundle.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    KES {bundle.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={bundle.status === "DELETED" || loading}
                          onClick={() => setSelectedBundle(bundle)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {bundle.status === "DELETED" ? "Deleted" : "Delete"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Confirm Bundle Deletion
                          </DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this bundle? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedBundle(null)}
                            disabled={deleteLoading}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Deleting...
                              </div>
                            ) : (
                              "Delete Bundle"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default function RemoveBundle() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [messages, setMessages] = useState("");
  const [bundlesDetails, setBundlesDetails] = useState<BundleDetail[]>([]);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock bundle data
  const mockBundles: BundleDetail[] = [
    {
      id: "B001",
      bundleName: "Data Starter 1GB",
      bundleType: "Data",
      subscriptionDate: "2024-01-10",
      expiryDate: "2024-02-09",
      remaining: "756 MB",
      status: "ACTIVE",
      price: 99.0,
      nccId: "CBU001",
    },
    {
      id: "B002",
      bundleName: "Voice & SMS Combo",
      bundleType: "Voice",
      subscriptionDate: "2024-01-13",
      expiryDate: "2024-01-20",
      remaining: "234 mins, 567 SMS",
      status: "ACTIVE",
      price: 150.0,
      nccId: "EBU002",
    },
    {
      id: "B003",
      bundleName: "Weekend Data 5GB",
      bundleType: "Data",
      subscriptionDate: "2024-01-14",
      expiryDate: "2024-01-17",
      remaining: "3.2 GB",
      status: "ACTIVE",
      price: 199.0,
      nccId: "CBU003",
    },
    {
      id: "B004",
      bundleName: "International Bundle",
      bundleType: "Voice",
      subscriptionDate: "2024-01-12",
      expiryDate: "2024-02-11",
      remaining: "180 mins",
      status: "DELETED",
      price: 500.0,
      nccId: "ROM004",
    },
  ];

  const handleFetchBundles = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessages("");
    setStatusCode(null);
    setBundlesDetails([]);
    setHasSearched(false);

    try {
      if (!phoneNumber.trim()) {
        setMessages("Phone number is required");
        setStatusCode(400);
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (Math.random() > 0.1) {
        // 90% success rate
        setBundlesDetails(mockBundles);
        setMessages(`Successfully fetched bundles for ${phoneNumber}`);
        setStatusCode(200);
        setHasSearched(true);
      } else {
        setMessages("Phone number not found or no active bundles.");
        setStatusCode(404);
        setHasSearched(true);
      }
    } catch (error) {
      setMessages("Failed to fetch bundle information.");
      setStatusCode(500);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBundle = async (bundle: BundleDetail) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() > 0.05) {
        // 95% success rate
        // Update bundle status to DELETED
        setBundlesDetails((prev) =>
          prev.map((b) =>
            b.id === bundle.id ? { ...b, status: "DELETED" } : b,
          ),
        );

        setMessages(
          `Successfully deleted bundle: ${bundle.bundleName} for ${phoneNumber}`,
        );
        setStatusCode(200);
      } else {
        setMessages(
          `Failed to delete bundle: ${bundle.bundleName}. Please try again.`,
        );
        setStatusCode(500);
      }
    } catch (error) {
      setMessages("An error occurred while deleting the bundle.");
      setStatusCode(500);
    }
  };

  const handleDeleteAllBundles = async () => {
    try {
      setDeleteLoading(true);
      // Simulate API call for deleting all bundles
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() > 0.05) {
        // 95% success rate
        // Update all active bundles to DELETED status
        setBundlesDetails((prev) =>
          prev.map((bundle) =>
            bundle.status === "ACTIVE"
              ? { ...bundle, status: "DELETED" }
              : bundle,
          ),
        );

        const activeBundlesCount = bundlesDetails.filter(
          (b) => b.status === "ACTIVE",
        ).length;
        setMessages(
          `Successfully deleted all ${activeBundlesCount} active bundles for ${phoneNumber}`,
        );
        setStatusCode(200);
      } else {
        setMessages("Failed to delete all bundles. Please try again.");
        setStatusCode(500);
      }
    } catch (error) {
      setMessages("An error occurred while deleting all bundles.");
      setStatusCode(500);
    } finally {
      setDeleteLoading(false);
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
              <BreadcrumbPage>Remove Bundle</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title */}
        <PageTitle />

        {/* Fetch Form */}
        <FetchForm
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          onSubmit={handleFetchBundles}
          loading={loading}
        />

        {/* Alert Component */}
        <AlertComponent messages={messages} statusCode={statusCode} />

        {/* Bundles Table */}
        {/* Bundle Details Table - Only show after successful search */}
        {hasSearched && (statusCode === 200 || statusCode === 404) && (
          <BundlesTable
            bundlesDetails={bundlesDetails}
            onDeleteBundle={handleDeleteBundle}
            loading={loading}
          />
        )}

        {/* Delete All Bundles Button - Only show when there are bundles after successful search */}
        {hasSearched && statusCode === 200 && bundlesDetails.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="lg"
                      disabled={loading || deleteLoading}
                      className="min-w-[200px]"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Bundles
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Confirm Delete All Bundles
                      </DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete ALL bundles? This action
                        cannot be undone.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <Button variant="outline" disabled={deleteLoading}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAllBundles}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Deleting All...
                          </div>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete All Bundles
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
