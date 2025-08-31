import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { CheckCircle, AlertCircle, X, Home, CreditCard } from 'lucide-react';

interface VoucherFormData {
  msisdn: string;
  voucher: string;
  channelId: string;
}

interface AlertData {
  type: 'success' | 'error';
  message: string;
  details?: string;
  show: boolean;
}

// Reusable Alert Component
const AlertComponent = ({ 
  alert, 
  onDismiss 
}: { 
  alert: AlertData; 
  onDismiss: () => void;
}) => {
  if (!alert.show) return null;

  return (
    <Alert 
      variant={alert.type === 'error' ? 'destructive' : 'default'}
      className={alert.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : ''}
    >
      {alert.type === 'success' ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertDescription className="flex justify-between items-start">
        <div>
          <p className="font-medium">{alert.message}</p>
          {alert.details && (
            <p className="text-sm mt-1 opacity-90">{alert.details}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="h-auto p-1 hover:bg-transparent"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

// Recharge Form Component
const RechargeForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  loading 
}: {
  formData: VoucherFormData;
  setFormData: (data: VoucherFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="msisdn">MSISDN *</Label>
          <Input
            id="msisdn"
            type="tel"
            placeholder="e.g., +254712345678"
            value={formData.msisdn}
            onChange={(e) => setFormData({...formData, msisdn: e.target.value})}
            required
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="voucher">Voucher Number *</Label>
          <Input
            id="voucher"
            type="text"
            placeholder="Enter voucher/PIN number"
            value={formData.voucher}
            onChange={(e) => setFormData({...formData, voucher: e.target.value.replace(/\D/g, '').substring(0, 16)})}
            required
            className="text-lg font-mono"
            maxLength={16}
          />
          <p className="text-xs text-muted-foreground">
            Enter the voucher number from your scratch card
          </p>
        </div>
      </div>

      {/* Hidden channel ID field - pre-filled */}
      <input 
        type="hidden" 
        value={formData.channelId} 
      />

      <Button 
        type="submit" 
        className="w-full bg-brand hover:bg-brand-600 text-lg py-6"
        disabled={loading || !formData.msisdn || !formData.voucher}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processing Recharge...
          </div>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Process Voucher Recharge
          </>
        )}
      </Button>
    </form>
  );
};

export default function VoucherRecharge() {
  const [formData, setFormData] = useState<VoucherFormData>({
    msisdn: '',
    voucher: '',
    channelId: 'WEB' // Hidden field, pre-populated
  });

  const [alert, setAlert] = useState<AlertData>({
    type: 'success',
    message: '',
    details: '',
    show: false
  });

  const [loading, setLoading] = useState(false);

  const dismissAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(prev => ({ ...prev, show: false }));

    try {
      // Validate required fields
      if (!formData.msisdn || !formData.voucher) {
        setAlert({
          type: 'error',
          message: 'Please fill in all required fields',
          details: 'MSISDN and Voucher number are required',
          show: true
        });
        setLoading(false);
        return;
      }

      // Simulate API call
      const response = await new Promise<{ status: number; data?: any }>((resolve) => {
        setTimeout(() => {
          // Simulate different response scenarios
          const rand = Math.random();
          if (rand > 0.85) { // 15% error rate
            resolve({ status: 400 });
          } else if (rand > 0.8) { // 5% network error
            resolve({ status: 500 });
          } else { // 80% success rate
            resolve({ 
              status: 201, 
              data: {
                transactionId: `VCH${Date.now()}`,
                amount: Math.floor(Math.random() * 500) + 10,
                newBalance: Math.floor(Math.random() * 1000) + 100
              }
            });
          }
        }, 2000);
      });

      if (response.status === 201) {
        // Success
        setAlert({
          type: 'success',
          message: 'Voucher recharge completed successfully!',
          details: `Transaction ID: ${response.data.transactionId} | Amount: KES ${response.data.amount} | New Balance: KES ${response.data.newBalance}`,
          show: true
        });

        // Reset form on success
        setFormData({
          msisdn: '',
          voucher: '',
          channelId: 'WEB'
        });
      } else {
        // Error handling
        let errorMessage = 'Recharge failed. Please try again.';
        let errorDetails = '';

        if (response.status === 400) {
          errorMessage = 'Invalid voucher or MSISDN';
          errorDetails = 'Please check your voucher number and phone number';
        } else if (response.status === 500) {
          errorMessage = 'Network error occurred';
          errorDetails = 'Please check your connection and try again';
        }

        setAlert({
          type: 'error',
          message: errorMessage,
          details: errorDetails,
          show: true
        });
      }

    } catch (error) {
      setAlert({
        type: 'error',
        message: 'An unexpected error occurred',
        details: 'Please try again later or contact support',
        show: true
      });
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
              <BreadcrumbPage>Voucher Recharge</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Voucher Recharge</h1>
          <p className="text-muted-foreground">
            Process voucher recharges for customer accounts
          </p>
        </div>

        {/* Alert Display */}
        <AlertComponent alert={alert} onDismiss={dismissAlert} />

        {/* Voucher Recharge Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Voucher Recharge
            </CardTitle>
            <CardDescription>
              Enter the customer MSISDN and 10–16 digit voucher number, then click Process Voucher Recharge to apply the credit. Ensure the voucher is unused and details are correct.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RechargeForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
