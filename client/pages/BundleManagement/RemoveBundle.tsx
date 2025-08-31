import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { XCircle, Smartphone, AlertCircle, CheckCircle, Search, Trash2, AlertTriangle, Home } from 'lucide-react';

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
  loading 
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
          <div className="flex gap-2">
            <div className="flex-1">
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
            <div className="pt-6">
              <Button 
                type="submit" 
                className="bg-brand hover:bg-brand-600"
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
  statusCode 
}: { 
  messages: string; 
  statusCode: number | null;
}) => {
  if (!messages) return null;

  const isSuccess = statusCode === 200 || statusCode === 201;
  const isError = statusCode && statusCode >= 400;

  return (
    <Alert 
      variant={isError ? 'destructive' : 'default'}
      className={isSuccess ? 'border-green-200 bg-green-50 text-green-800' : ''}
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
  loading 
}: {
  bundlesDetails: BundleDetail[];
  onDeleteBundle: (bundle: BundleDetail) => void;
  loading: boolean;
}) => {
  const [selectedBundle, setSelectedBundle] = useState<BundleDetail | null>(null);
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
            <p>No bundles found for removal</p>
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
        <CardDescription>
          Active bundles available for removal
        </CardDescription>
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
                      <p className="text-xs text-muted-foreground">NCC ID: {bundle.nccId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{bundle.bundleType}</Badge>
                  </TableCell>
                  <TableCell>{bundle.subscriptionDate}</TableCell>
                  <TableCell>{bundle.expiryDate}</TableCell>
                  <TableCell className="font-medium">{bundle.remaining}</TableCell>
                  <TableCell>
                    <Badge className={
                      bundle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      bundle.status === 'DELETED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {bundle.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">KES {bundle.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          disabled={bundle.status === 'DELETED' || loading}
                          onClick={() => setSelectedBundle(bundle)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {bundle.status === 'DELETED' ? 'Deleted' : 'Delete'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Confirm Bundle Deletion
                          </DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this bundle? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedBundle && (
                          <div className="py-4">
                            <div className="bg-muted p-4 rounded-lg space-y-2">
                              <div className="flex justify-between">
                                <span className="font-medium">Bundle:</span>
                                <span>{selectedBundle.bundleName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Type:</span>
                                <span>{selectedBundle.bundleType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Remaining:</span>
                                <span>{selectedBundle.remaining}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Price:</span>
                                <span>KES {selectedBundle.price.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        )}

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
                              'Delete Bundle'
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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messages, setMessages] = useState('');
  const [bundlesDetails, setBundlesDetails] = useState<BundleDetail[]>([]);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock bundle data
  const mockBundles: BundleDetail[] = [
    {
      id: 'B001',
      bundleName: 'Data Starter 1GB',
      bundleType: 'Data',
      subscriptionDate: '2024-01-10',
      expiryDate: '2024-02-09',
      remaining: '756 MB',
      status: 'ACTIVE',
      price: 99.00,
      nccId: 'CBU001'
    },
    {
      id: 'B002',
      bundleName: 'Voice & SMS Combo',
      bundleType: 'Voice',
      subscriptionDate: '2024-01-13',
      expiryDate: '2024-01-20',
      remaining: '234 mins, 567 SMS',
      status: 'ACTIVE',
      price: 150.00,
      nccId: 'EBU002'
    },
    {
      id: 'B003',
      bundleName: 'Weekend Data 5GB',
      bundleType: 'Data',
      subscriptionDate: '2024-01-14',
      expiryDate: '2024-01-17',
      remaining: '3.2 GB',
      status: 'ACTIVE',
      price: 199.00,
      nccId: 'CBU003'
    },
    {
      id: 'B004',
      bundleName: 'International Bundle',
      bundleType: 'Voice',
      subscriptionDate: '2024-01-12',
      expiryDate: '2024-02-11',
      remaining: '180 mins',
      status: 'DELETED',
      price: 500.00,
      nccId: 'ROM004'
    }
  ];

  const handleFetchBundles = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessages('');
    setStatusCode(null);
    setBundlesDetails([]);

    try {
      if (!phoneNumber.trim()) {
        setMessages('Phone number is required');
        setStatusCode(400);
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (Math.random() > 0.1) { // 90% success rate
        setBundlesDetails(mockBundles);
        setMessages(`Successfully fetched bundles for ${phoneNumber}`);
        setStatusCode(200);
      } else {
        setMessages('Phone number not found or no active bundles.');
        setStatusCode(404);
      }
    } catch (error) {
      setMessages('Failed to fetch bundle information.');
      setStatusCode(500);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBundle = async (bundle: BundleDetail) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (Math.random() > 0.05) { // 95% success rate
        // Update bundle status to DELETED
        setBundlesDetails(prev => prev.map(b => 
          b.id === bundle.id 
            ? { ...b, status: 'DELETED' }
            : b
        ));
        
        setMessages(`Successfully deleted bundle: ${bundle.bundleName} for ${phoneNumber}`);
        setStatusCode(200);
      } else {
        setMessages(`Failed to delete bundle: ${bundle.bundleName}. Please try again.`);
        setStatusCode(500);
      }
    } catch (error) {
      setMessages('An error occurred while deleting the bundle.');
      setStatusCode(500);
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
        <AlertComponent 
          messages={messages}
          statusCode={statusCode}
        />

        {/* Bundles Table */}
        <BundlesTable 
          bundlesDetails={bundlesDetails}
          onDeleteBundle={handleDeleteBundle}
          loading={loading}
        />

        {/* Information Section */}
        {bundlesDetails.length === 0 && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>1. Enter customer MSISDN</p>
                  <p>2. Click "Fetch Bundles" to search</p>
                  <p>3. Review active bundles</p>
                  <p>4. Click "Delete" to remove bundle</p>
                  <p>5. Confirm deletion in dialog</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Important Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Bundle removal is permanent</p>
                  <p>• Deleted bundles cannot be restored</p>
                  <p>• Customer will be notified via SMS</p>
                  <p>• Unused value may be refunded</p>
                  <p>• Already deleted bundles are disabled</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Bundle Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
                    <span className="text-muted-foreground">Can be deleted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">DELETED</Badge>
                    <span className="text-muted-foreground">Already removed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">EXPIRED</Badge>
                    <span className="text-muted-foreground">Automatically expired</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
