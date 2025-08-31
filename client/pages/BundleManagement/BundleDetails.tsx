import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Search, Package, AlertCircle, CheckCircle, Home, Info } from 'lucide-react';

interface BundleData {
  nccId: string;
  plc: string;
  cl: string;
  bundleType: string;
  validity: string;
  nott: string;
  bucket: string;
  allocation: string;
  price: number;
  thr: string;
  mergeId: string;
  description: string;
  status: string;
  createdDate: string;
  lastModified: string;
}

// Search Form Component
const SearchForm = ({ 
  nccId, 
  setNccId, 
  onSubmit, 
  loading, 
  error 
}: {
  nccId: string;
  setNccId: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Bundle Search
        </CardTitle>
        <CardDescription>
          Enter NCC ID to retrieve detailed bundle information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="nccId">NCC ID</Label>
              <Input
                id="nccId"
                type="text"
                placeholder="e.g., CBU001, EBU002"
                value={nccId}
                onChange={(e) => setNccId(e.target.value.toUpperCase())}
                required
              />
            </div>
            <div className="pt-6">
              <Button 
                type="submit" 
                className="bg-brand hover:bg-brand-600"
                disabled={loading || !nccId}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Searching...
                  </div>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Bundle
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

// Bundle Accordion Component
const BundleAccordion = ({ 
  bundleData, 
  activeAccordion, 
  setActiveAccordion 
}: {
  bundleData: BundleData;
  activeAccordion: string;
  setActiveAccordion: (value: string) => void;
}) => {
  const accordionItems = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      icon: <Info className="h-4 w-4" />,
      content: [
        { label: 'NCC ID', value: bundleData.nccId },
        { label: 'Bundle Type', value: bundleData.bundleType },
        { label: 'Description', value: bundleData.description },
        { label: 'Status', value: bundleData.status },
        { label: 'Created Date', value: bundleData.createdDate },
        { label: 'Last Modified', value: bundleData.lastModified }
      ]
    },
    {
      id: 'technical-details',
      title: 'Technical Details',
      icon: <Package className="h-4 w-4" />,
      content: [
        { label: 'PLC', value: bundleData.plc },
        { label: 'CL', value: bundleData.cl },
        { label: 'NOTT', value: bundleData.nott },
        { label: 'Bucket', value: bundleData.bucket },
        { label: 'THR', value: bundleData.thr },
        { label: 'MERGE ID', value: bundleData.mergeId }
      ]
    },
    {
      id: 'pricing-allocation',
      title: 'Pricing & Allocation',
      icon: <Package className="h-4 w-4" />,
      content: [
        { label: 'Price', value: `KES ${bundleData.price.toFixed(2)}` },
        { label: 'Allocation', value: bundleData.allocation },
        { label: 'Validity', value: bundleData.validity }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Bundle Details - {bundleData.nccId}
        </CardTitle>
        <CardDescription>
          Detailed configuration and settings for bundle {bundleData.nccId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion 
          type="single" 
          value={activeAccordion} 
          onValueChange={setActiveAccordion}
          className="w-full"
        >
          {accordionItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {item.content.map((field, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium text-muted-foreground">{field.label}:</span>
                      <span className="font-medium">{field.value}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default function BundleDetails() {
  const [nccId, setNccId] = useState('');
  const [bundleData, setBundleData] = useState<BundleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeAccordion, setActiveAccordion] = useState('basic-info');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBundleData(null);

    try {
      if (!nccId.trim()) {
        setError('NCC ID is required');
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (Math.random() > 0.15) { // 85% success rate
        // Mock bundle data based on NCC ID pattern
        const mockBundleData: BundleData = {
          nccId: nccId,
          plc: `PLC_${nccId}_001`,
          cl: nccId.startsWith('CBU') ? 'CORE_CL' : 
              nccId.startsWith('EBU') ? 'ELECTRONIC_CL' :
              nccId.startsWith('MPE') ? 'MPESA_CL' : 'STANDARD_CL',
          bundleType: nccId.startsWith('CBU') ? 'Core Banking Bundle' :
                     nccId.startsWith('EBU') ? 'Electronic Banking Bundle' :
                     nccId.startsWith('MPE') ? 'M-PESA Bundle' :
                     nccId.startsWith('ROM') ? 'Roaming Bundle' :
                     'Standard Bundle',
          validity: Math.random() > 0.5 ? '30 days' : '7 days',
          nott: `NOTT_${Math.floor(Math.random() * 1000) + 100}`,
          bucket: `BUCKET_${nccId}_${Math.floor(Math.random() * 10) + 1}`,
          allocation: `${Math.floor(Math.random() * 5000) + 1000} MB`,
          price: Math.floor(Math.random() * 500) + 50,
          thr: `THR_${Math.floor(Math.random() * 100) + 10}`,
          mergeId: `MERGE_${Date.now()}`,
          description: `${nccId} bundle with comprehensive features and services`,
          status: Math.random() > 0.2 ? 'Active' : 'Inactive',
          createdDate: '2023-12-15',
          lastModified: new Date().toISOString().split('T')[0]
        };

        setBundleData(mockBundleData);
        setActiveAccordion('basic-info'); // Reset to first accordion
      } else {
        setError(`Bundle with NCC ID "${nccId}" not found. Please check the ID and try again.`);
      }
    } catch (err) {
      setError('Failed to retrieve bundle details. Please try again.');
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
              <BreadcrumbPage>Bundle Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bundle Details</h1>
          <p className="text-muted-foreground">
            Search and view comprehensive bundle configuration details
          </p>
        </div>

        {/* Search Form */}
        <SearchForm 
          nccId={nccId}
          setNccId={setNccId}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        {/* Bundle Data Display */}
        {bundleData && (
          <>
            {/* Success Message */}
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Bundle details retrieved successfully for NCC ID: <strong>{bundleData.nccId}</strong>
              </AlertDescription>
            </Alert>

            {/* Quick Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Bundle Type</p>
                    <p className="font-bold">{bundleData.bundleType}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-bold text-brand">KES {bundleData.price.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Validity</p>
                    <p className="font-bold">{bundleData.validity}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={bundleData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {bundleData.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bundle Accordion */}
            <BundleAccordion 
              bundleData={bundleData}
              activeAccordion={activeAccordion}
              setActiveAccordion={setActiveAccordion}
            />
          </>
        )}

        {/* Information Section */}
        {!bundleData && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Search Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Enter the complete NCC ID</p>
                  <p>• Use exact format (e.g., CBU001)</p>
                  <p>• Check for typos if not found</p>
                  <p>• Contact admin for new bundle IDs</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Bundle Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• CBU - Core Banking Unit</p>
                  <p>• EBU - Electronic Banking</p>
                  <p>• MPE - M-PESA Services</p>
                  <p>• ROM - Roaming Services</p>
                  <p>• CVM - Customer Value</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Information Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Technical specifications</p>
                  <p>• Pricing and allocation</p>
                  <p>• Configuration details</p>
                  <p>• Status and history</p>
                  <p>• System identifiers</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
