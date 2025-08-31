import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Package, 
  AlertCircle, 
  CheckCircle, 
  Home, 
  Info, 
  Clock, 
  DollarSign, 
  Bell,
  Settings,
  User,
  ExternalLink
} from 'lucide-react';
import { 
  BundleDetailsResponse, 
  BundleInfo, 
  NotificationMessagesResponse, 
  SubscribeBundleRequest,
  SubscribeBundleResponse 
} from '@shared/api';

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

// Basic Bundle Information Component  
const BasicBundleInfo = ({ bundleData }: { bundleData: BundleInfo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Basic Bundle Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Field</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Name</TableCell>
              <TableCell>{bundleData.name}</TableCell>
            </TableRow>
            {bundleData.description && (
              <TableRow>
                <TableCell className="font-medium">Description</TableCell>
                <TableCell>{bundleData.description}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell className="font-medium">Queue ID</TableCell>
              <TableCell>{bundleData.queueId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Max Renewals</TableCell>
              <TableCell>{bundleData.maxRenewals}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Fee</TableCell>
              <TableCell>KES {bundleData.fee.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">ID</TableCell>
              <TableCell>{bundleData.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Custom Data</TableCell>
              <TableCell>
                {Object.keys(bundleData.customData).length > 0 ? (
                  <div className="space-y-1">
                    {Object.entries(bundleData.customData).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium">{key}:</span> {String(value)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">No custom data available</span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Period Lifecycle Component
const PeriodLifecycleInfo = ({ plc }: { plc: BundleInfo['plc'] }) => {
  if (!plc) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Period Lifecycle Information (PLC)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-sm text-muted-foreground">Name</Label>
            <p className="font-medium">{plc.name}</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-sm text-muted-foreground">Time Unit</Label>
            <p className="font-medium">{plc.periodType}</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-sm text-muted-foreground">Period Length</Label>
            <p className="font-medium">{plc.periodLength}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3">States and Actions</h4>
          <div className="space-y-4">
            {plc.states.map((state, stateIndex) => (
              <Card key={stateIndex} className="border-l-4 border-l-brand">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{state.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {state.actions.length > 0 ? (
                    <div className="space-y-2">
                      {state.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{action.type}</Badge>
                            {action.notificationTemplateId && (
                              <Badge variant="secondary" className="text-xs">
                                <Bell className="h-3 w-3 mr-1" />
                                {action.notificationTemplateId}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm space-y-1">
                            {Object.entries(action.defaultValues).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No actions available</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Charging Logic Component
const ChargingLogicInfo = ({ chargingLogic }: { chargingLogic: BundleInfo['chargingLogic'] }) => {
  if (!chargingLogic || chargingLogic.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Charging Logic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CL Name</TableHead>
              <TableHead>Bucket</TableHead>
              <TableHead>Initial Value</TableHead>
              <TableHead>Bucket Type</TableHead>
              <TableHead>Threshold Profile Group ID</TableHead>
              <TableHead>Is Carry Over</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chargingLogic.map((cl, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{cl.clName}</TableCell>
                <TableCell>{cl.bucket}</TableCell>
                <TableCell>{cl.initialValue}</TableCell>
                <TableCell>
                  <Badge variant="outline">{cl.bucketType}</Badge>
                </TableCell>
                <TableCell>{cl.thresholdProfileGroupId}</TableCell>
                <TableCell>
                  <Badge variant={cl.isCarryOver ? "default" : "secondary"}>
                    {cl.isCarryOver ? "Yes" : "No"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Notification Messages Component
const NotificationMessages = ({ nccId }: { nccId: string }) => {
  const [notificationId, setNotificationId] = useState('');
  const [messages, setMessages] = useState<NotificationMessagesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchMessages = async () => {
    if (!notificationId.trim()) {
      setError('Notification ID is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/notification-messages?nccId=${encodeURIComponent(nccId)}&notificationId=${encodeURIComponent(notificationId)}`);
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data);
      } else {
        setError(data.error || 'Failed to fetch notification messages');
      }
    } catch (err) {
      setError('Failed to fetch notification messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Messages
        </CardTitle>
        <CardDescription>
          Display messages for specific notification template
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="notificationId">Notification ID</Label>
            <Input
              id="notificationId"
              type="text"
              placeholder="Enter notification template ID"
              value={notificationId}
              onChange={(e) => setNotificationId(e.target.value)}
            />
          </div>
          <div className="pt-6">
            <Button onClick={handleFetchMessages} disabled={loading || !notificationId}>
              {loading ? 'Loading...' : 'Fetch Messages'}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {messages && (
          <div className="space-y-4">
            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-medium">NCC ID:</span> 
                <Badge variant="outline" className="ml-1">{messages.nccId}</Badge>
              </div>
              <div>
                <span className="font-medium">Notification ID:</span> 
                <Badge variant="outline" className="ml-1">{messages.notificationId}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(messages.messagesByChannel).map(([channel, channelMessages]) => (
                <Card key={channel} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{channel}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {channelMessages.map((message, index) => (
                        <Textarea
                          key={index}
                          value={message}
                          readOnly
                          className="min-h-[60px] resize-none"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Subscribe Bundle Component
const SubscribeBundle = ({ nccId }: { nccId: string }) => {
  const [msisdn, setMsisdn] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubscribeBundleResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/bundle-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ msisdn, nccId }),
      });

      const data: SubscribeBundleResponse = await response.json();
      setResult(data);
    } catch (err) {
      setResult({
        success: false,
        message: 'Failed to subscribe bundle. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Subscribe Bundle
        </CardTitle>
        <CardDescription>
          Subscribe a bundle for a user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>
                {result.message}
                {result.subscriptionId && (
                  <div className="mt-1 text-sm">
                    Subscription ID: <Badge variant="outline">{result.subscriptionId}</Badge>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="msisdn">Enter MSISDN *</Label>
              <Input
                id="msisdn"
                type="text"
                placeholder="e.g., 254712345678"
                value={msisdn}
                onChange={(e) => setMsisdn(e.target.value)}
                pattern="[0-9]{10,15}"
                required
              />
            </div>
            <div>
              <Label htmlFor="nccIdSub">Enter NCC ID *</Label>
              <Input
                id="nccIdSub"
                type="text"
                value={nccId}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading || !msisdn.trim()}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Subscribing...
              </div>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function BundleDetails() {
  const [nccId, setNccId] = useState('');
  const [bundleData, setBundleData] = useState<BundleInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      const response = await fetch(`/api/bundle-details?nccId=${encodeURIComponent(nccId)}`);
      const data: BundleDetailsResponse = await response.json();

      if (response.ok && data.result) {
        setBundleData(data.result);
      } else {
        setError(data.error || 'Failed to retrieve bundle details');
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Bundle Information</h1>
          <p className="text-muted-foreground">
            Fetch and display bundle details by NCC ID, including basic info, lifecycle information (PLC), and charging logic
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
                Bundle details retrieved successfully for NCC ID: <strong>{nccId}</strong>
              </AlertDescription>
            </Alert>

            {/* Bundle Information Tabs */}
            <Tabs defaultValue="basic-info" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic-info" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="lifecycle" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Lifecycle
                </TabsTrigger>
                <TabsTrigger value="charging" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Charging
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="subscribe" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Subscribe
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info" className="mt-6">
                <BasicBundleInfo bundleData={bundleData} />
              </TabsContent>

              <TabsContent value="lifecycle" className="mt-6">
                <PeriodLifecycleInfo plc={bundleData.plc} />
              </TabsContent>

              <TabsContent value="charging" className="mt-6">
                <ChargingLogicInfo chargingLogic={bundleData.chargingLogic} />
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <NotificationMessages nccId={nccId} />
              </TabsContent>

              <TabsContent value="subscribe" className="mt-6">
                <SubscribeBundle nccId={nccId} />
              </TabsContent>
            </Tabs>
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
                <CardTitle className="text-lg">Features Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Basic bundle information</p>
                  <p>• Period lifecycle (PLC) details</p>
                  <p>• Charging logic configuration</p>
                  <p>• Notification messages</p>
                  <p>• Bundle subscription</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
