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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Package,
  Home,
  List,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SubscribedBundle {
  bundleName: string;
  bucketName: string;
  status: string;
  validity: string;
}

const msisdnRegex = /^\+?\d{8,15}$/;

// Bundles Table Component
const BundlesTable = ({ bundles }: { bundles: SubscribedBundle[] }) => {
  if (!bundles || bundles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Subscribed Bundles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No subscribed bundles found.</p>
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
          Subscribed Bundles ({bundles.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bundle Name</TableHead>
                <TableHead>Bucket Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Validity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bundles.map((bundle, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">
                    {bundle.bundleName}
                  </TableCell>
                  <TableCell>{bundle.bucketName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        bundle.status === "Active" ? "default" : "secondary"
                      }
                      className={
                        bundle.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                    >
                      {bundle.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{bundle.validity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SubscribedBundles() {
  const [msisdn, setMsisdn] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bundles, setBundles] = useState<SubscribedBundle[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);
    setBundles(null);

    if (!msisdnRegex.test(msisdn)) {
      setError("Please enter a valid MSISDN format (8-15 digits).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/subscriptions?msisdn=${encodeURIComponent(msisdn)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch subscriptions");
      }

      const bundleList = data?.items || [];
      setBundles(bundleList);

      if (bundleList.length === 0) {
        setSuccessMessage(`No subscribed bundles found for ${msisdn}.`);
      } else {
        setSuccessMessage(
          `Found ${bundleList.length} subscribed bundle${bundleList.length !== 1 ? "s" : ""} for ${msisdn}.`,
        );
      }
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to retrieve subscribed bundles. Please try again.",
      );
      setBundles(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setBundles(null);
    setSuccessMessage(null);
    setError(null);
  }, [msisdn]);

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
              <BreadcrumbPage>Subscribed Bundles</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Subscribed Bundles
          </h1>
          <p className="text-muted-foreground">
            View currently subscribed bundles for a user
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Bundle Search
            </CardTitle>
            <CardDescription>
              Enter MSISDN to retrieve subscribed bundles
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
                  <Label htmlFor="msisdn" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    MSISDN
                  </Label>
                  <Input
                    id="msisdn"
                    type="tel"
                    value={msisdn}
                    onChange={(e) => setMsisdn(e.target.value)}
                    placeholder="e.g., +254712345678"
                    required
                  />
                </div>
                <div className="flex md:col-span-1">
                  <Button
                    type="submit"
                    disabled={loading || !msisdn}
                    className="w-full bg-brand hover:bg-brand-600"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Searching...
                      </div>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search Bundles
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {bundles !== null && (
          <div className="space-y-6">
            <BundlesTable bundles={bundles} />
          </div>
        )}
      </div>
    </Layout>
  );
}
