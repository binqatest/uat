import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Wallet, Plus, Minus, AlertCircle, CheckCircle, Home } from 'lucide-react';

interface BalanceFormData {
  phoneNumber: string;
  amount: string;
  adjustmentType: string;
}

interface ApiResponse {
  status: 'success' | 'error' | 'info';
  message: string;
  details?: any;
  info?: string;
}

export default function AdjustBalance() {
  const [formData, setFormData] = useState<BalanceFormData>({
    phoneNumber: '',
    amount: '',
    adjustmentType: ''
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      // Validate required fields
      if (!formData.phoneNumber || !formData.amount || !formData.adjustmentType) {
        setResponse({
          status: 'error',
          message: 'All fields are required'
        });
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (Math.random() > 0.15) { // 85% success rate
        setResponse({
          status: 'success',
          message: 'Balance adjustment completed successfully',
          details: {
            transactionId: `TXN${Date.now()}`,
            amount: formData.amount,
            adjustmentType: formData.adjustmentType,
            phoneNumber: formData.phoneNumber,
            timestamp: new Date().toLocaleString()
          },
          info: 'Customer has been notified via SMS'
        });

        // Reset form on success
        setFormData({
          phoneNumber: '',
          amount: '',
          adjustmentType: ''
        });
      } else {
        setResponse({
          status: 'error',
          message: 'Failed to adjust balance. Please try again.',
          details: { errorCode: 'ADJ_001', description: 'Network timeout' }
        });
      }
    } catch (err) {
      setResponse({
        status: 'error',
        message: 'An error occurred while processing the request.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Response Display Component
  const ResponseDisplay = ({ response }: { response: ApiResponse }) => {
    const getAlertVariant = (status: string) => {
      switch (status) {
        case 'success':
          return 'default';
        case 'error':
          return 'destructive';
        default:
          return 'default';
      }
    };

    const getIcon = (status: string) => {
      switch (status) {
        case 'success':
          return <CheckCircle className="h-4 w-4" />;
        case 'error':
          return <AlertCircle className="h-4 w-4" />;
        default:
          return <AlertCircle className="h-4 w-4" />;
      }
    };

    return (
      <Alert variant={getAlertVariant(response.status)} className={
        response.status === 'success' ? 'border-green-200 bg-green-50' : ''
      }>
        {getIcon(response.status)}
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">{response.message}</p>
            {response.info && (
              <p className="text-sm opacity-90">{response.info}</p>
            )}
            {response.details && (
              <div className="text-sm bg-background/50 p-2 rounded border mt-2">
                <p className="font-medium mb-1">Details:</p>
                {typeof response.details === 'object' ? (
                  <div className="space-y-1">
                    {Object.entries(response.details).map(([key, value], index) => (
                      <div key={index} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="font-mono text-xs">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{String(response.details)}</p>
                )}
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
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
              <BreadcrumbPage>Adjust Balance</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Adjust Balance</h1>
          <p className="text-muted-foreground">
            Process balance adjustments for customer accounts
          </p>
        </div>

        {/* Response Display */}
        {response && (
          <ResponseDisplay response={response} />
        )}

        {/* Main Content */}
        <div className="w-full">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Balance Adjustment Form
                </CardTitle>
                <CardDescription>
                  Enter phone number, amount, and adjustment type to process balance changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g., +254712345678"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (KES) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adjustment-type">Adjustment Type *</Label>
                    <Select
                      value={formData.adjustmentType}
                      onValueChange={(value) => setFormData({...formData, adjustmentType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select adjustment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4 text-green-600" />
                            Credit (Add Balance)
                          </div>
                        </SelectItem>
                        <SelectItem value="debit">
                          <div className="flex items-center gap-2">
                            <Minus className="h-4 w-4 text-red-600" />
                            Debit (Subtract Balance)
                          </div>
                        </SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="refund">Refund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-brand hover:bg-brand-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </div>
                    ) : (
                      'Process Balance Adjustment'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
