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
import { RotateCw, Smartphone, AlertCircle, CheckCircle, Search, Edit3, Home } from 'lucide-react';

interface BundleDetail {
  id: string;
  bundleName: string;
  bundleType: string;
  currentValue: string;
  unit: string;
  expiryDate: string;
  status: string;
  price: number;
  nccId: string;
}

interface ModalData {
  bundle: BundleDetail | null;
  show: boolean;
}

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
          Enter MSISDN to fetch bundles for updating
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

// Bundles Table Component
const BundlesTable = ({ 
  bundlesDetails, 
  onUpdateBundle, 
  loading 
}: {
  bundlesDetails: BundleDetail[];
  onUpdateBundle: (bundle: BundleDetail) => void;
  loading: boolean;
}) => {
  if (bundlesDetails.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCw className="h-5 w-5" />
            Bundle Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <RotateCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bundles found for updating</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCw className="h-5 w-5" />
          Bundle Details ({bundlesDetails.length} found)
        </CardTitle>
        <CardDescription>
          Active bundles available for updating
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bundle Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Expiry Date</TableHead>
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
                  <TableCell className="font-medium">
                    {bundle.currentValue} {bundle.unit}
                  </TableCell>
                  <TableCell>{bundle.expiryDate}</TableCell>
                  <TableCell>
                    <Badge className={
                      bundle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      bundle.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {bundle.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">KES {bundle.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={bundle.status !== 'ACTIVE' || loading}
                      onClick={() => onUpdateBundle(bundle)}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Update
                    </Button>
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

// Update Modal Component
const UpdateModal = ({ 
  modalData, 
  setModalData, 
  updateValue, 
  setUpdateValue, 
  onUpdateSubmit, 
  loading 
}: {
  modalData: ModalData;
  setModalData: (data: ModalData) => void;
  updateValue: string;
  setUpdateValue: (value: string) => void;
  onUpdateSubmit: () => void;
  loading: boolean;
}) => {
  const handleClose = () => {
    setModalData({ bundle: null, show: false });
    setUpdateValue('');
  };

  return (
    <Dialog open={modalData.show} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-brand" />
            Update Bundle Value
          </DialogTitle>
          <DialogDescription>
            Update the value for the selected bundle
          </DialogDescription>
        </DialogHeader>
        
        {modalData.bundle && (
          <div className="py-4 space-y-4">
            {/* Bundle Information */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Bundle:</span>
                <span>{modalData.bundle.bundleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span>{modalData.bundle.bundleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Current Value:</span>
                <span className="font-bold text-brand">
                  {modalData.bundle.currentValue} {modalData.bundle.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Expiry Date:</span>
                <span>{modalData.bundle.expiryDate}</span>
              </div>
            </div>

            {/* Update Input */}
            <div className="space-y-2">
              <Label htmlFor="updateValue">
                New Value ({modalData.bundle.unit}) *
              </Label>
              <Input
                id="updateValue"
                type="number"
                placeholder={`Enter new value in ${modalData.bundle.unit}`}
                value={updateValue}
                onChange={(e) => setUpdateValue(e.target.value)}
                min="0"
                step="0.01"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter the new value to replace the current bundle value
              </p>
            </div>

            {/* Preview */}
            {updateValue && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Update Preview:</p>
                <p className="text-sm text-blue-700">
                  {modalData.bundle.currentValue} {modalData.bundle.unit} → {updateValue} {modalData.bundle.unit}
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={onUpdateSubmit}
            disabled={loading || !updateValue}
            className="bg-brand hover:bg-brand-600"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Updating...
              </div>
            ) : (
              'Update Bundle'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Alert Component
const AlertComponent = ({ 
  successMessage 
}: { 
  successMessage: string;
}) => {
  if (!successMessage) return null;

  return (
    <Alert className="border-green-200 bg-green-50 text-green-800">
      <CheckCircle className="h-4 w-4" />
      <AlertDescription>
        <p className="font-medium">{successMessage}</p>
      </AlertDescription>
    </Alert>
  );
};

export default function UpdateBundle() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [bundlesDetails, setBundlesDetails] = useState<BundleDetail[]>([]);
  const [modalData, setModalData] = useState<ModalData>({ bundle: null, show: false });
  const [updateValue, setUpdateValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock bundle data
  const mockBundles: BundleDetail[] = [
    {
      id: 'B001',
      bundleName: 'Data Starter 1GB',
      bundleType: 'Data',
      currentValue: '756',
      unit: 'MB',
      expiryDate: '2024-02-09',
      status: 'ACTIVE',
      price: 99.00,
      nccId: 'CBU001'
    },
    {
      id: 'B002',
      bundleName: 'Voice Bundle',
      bundleType: 'Voice',
      currentValue: '234',
      unit: 'Minutes',
      expiryDate: '2024-01-20',
      status: 'ACTIVE',
      price: 150.00,
      nccId: 'EBU002'
    },
    {
      id: 'B003',
      bundleName: 'SMS Bundle',
      bundleType: 'SMS',
      currentValue: '567',
      unit: 'SMS',
      expiryDate: '2024-01-25',
      status: 'ACTIVE',
      price: 50.00,
      nccId: 'CBU003'
    },
    {
      id: 'B004',
      bundleName: 'Expired Data Bundle',
      bundleType: 'Data',
      currentValue: '0',
      unit: 'MB',
      expiryDate: '2024-01-15',
      status: 'EXPIRED',
      price: 200.00,
      nccId: 'CBU004'
    }
  ];

  const handleFetchBundles = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setBundlesDetails([]);

    try {
      if (!phoneNumber.trim()) {
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (Math.random() > 0.1) { // 90% success rate
        setBundlesDetails(mockBundles);
        setSuccessMessage(`Successfully fetched bundles for ${phoneNumber}`);
      } else {
        setSuccessMessage(''); // Clear success message on error
      }
    } catch (error) {
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBundle = (bundle: BundleDetail) => {
    setModalData({ bundle, show: true });
    setUpdateValue(bundle.currentValue);
  };

  const handleUpdateSubmit = async () => {
    if (!modalData.bundle || !updateValue) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (Math.random() > 0.05) { // 95% success rate
        // Update bundle in the list
        setBundlesDetails(prev => prev.map(bundle => 
          bundle.id === modalData.bundle!.id 
            ? { ...bundle, currentValue: updateValue }
            : bundle
        ));
        
        setSuccessMessage(
          `Successfully updated ${modalData.bundle.bundleName} for ${phoneNumber}. ` +
          `New value: ${updateValue} ${modalData.bundle.unit}`
        );
        
        // Close modal
        setModalData({ bundle: null, show: false });
        setUpdateValue('');
      } else {
        setSuccessMessage('Failed to update bundle. Please try again.');
      }
    } catch (error) {
      setSuccessMessage('An error occurred while updating the bundle.');
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
              <BreadcrumbPage>Update Bundle</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Update Bundle</h1>
          <p className="text-muted-foreground">
            Search and update bundle values for customer accounts
          </p>
        </div>

        {/* Fetch Form */}
        <FetchForm 
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          onSubmit={handleFetchBundles}
          loading={loading}
        />

        {/* Alert Component */}
        <AlertComponent successMessage={successMessage} />

        {/* Bundles Table */}
        <BundlesTable 
          bundlesDetails={bundlesDetails}
          onUpdateBundle={handleUpdateBundle}
          loading={loading}
        />

        {/* Update Modal */}
        <UpdateModal 
          modalData={modalData}
          setModalData={setModalData}
          updateValue={updateValue}
          setUpdateValue={setUpdateValue}
          onUpdateSubmit={handleUpdateSubmit}
          loading={loading}
        />

        {/* Information Section */}
        {bundlesDetails.length === 0 && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">How to Update</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>1. Enter customer MSISDN</p>
                  <p>2. Click "Fetch Bundles" to search</p>
                  <p>3. Review available bundles</p>
                  <p>4. Click "Update" on desired bundle</p>
                  <p>5. Enter new value in modal</p>
                  <p>6. Confirm update</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Update Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Only ACTIVE bundles can be updated</p>
                  <p>• New value must be numeric</p>
                  <p>• Value cannot be negative</p>
                  <p>• Changes are immediate</p>
                  <p>• Customer receives SMS notification</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Bundle Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">Data</Badge>
                    <span className="text-muted-foreground">MB/GB values</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Voice</Badge>
                    <span className="text-muted-foreground">Minute values</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800">SMS</Badge>
                    <span className="text-muted-foreground">Message count</span>
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
