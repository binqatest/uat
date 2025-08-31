import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { CheckCircle, AlertCircle, X, Home, Zap } from 'lucide-react';

interface PinlessFormData {
  msisdn: string;
  amount: string;
  channelId: string;
}

interface AlertData {
  type: 'success' | 'error';
  message: string;
  details?: string;
  show: boolean;
}

// Channel options as specified in requirements
const channelOptions = [
  { value: 'Bank', label: 'Bank' },
  { value: 'S&D', label: 'S&D' },
  { value: 'MPESSA', label: 'MPESSA' },
  { value: 'CRM', label: 'CRM' },
  { value: 'TIBCO', label: 'TIBCO' }
];

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
  formData: PinlessFormData;
  setFormData: (data: PinlessFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}) => {
  // MSISDN validation
  const validateMSISDN = (msisdn: string): boolean => {
    const msisdnRegex = /^\+?[1-9]\d{1,14}$/;
    return msisdnRegex.test(msisdn.replace(/\s/g, ''));
  };

  // Amount validation
  const validateAmount = (amount: string): boolean => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 100000;
  };

  const isFormValid = 
    formData.msisdn && 
    formData.amount && 
    formData.channelId &&
    validateMSISDN(formData.msisdn) &&
    validateAmount(formData.amount);

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
          {formData.msisdn && !validateMSISDN(formData.msisdn) && (
            <p className="text-xs text-destructive">Please enter a valid phone number</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (KES) *</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            required
            min="1"
            max="100000"
            step="0.01"
            className="text-lg"
          />
          {formData.amount && !validateAmount(formData.amount) && (
            <p className="text-xs text-destructive">Amount must be between KES 1 and KES 100,000</p>
          )}
          <p className="text-xs text-muted-foreground">
            Minimum: KES 1.00 | Maximum: KES 100,000.00
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="channel">Channel *</Label>
        <Select 
          value={formData.channelId} 
          onValueChange={(value) => setFormData({...formData, channelId: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select channel" />
          </SelectTrigger>
          <SelectContent>
            {channelOptions.map((channel) => (
              <SelectItem key={channel.value} value={channel.value}>
                {channel.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Select the recharge channel
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-brand hover:bg-brand-600 text-lg py-6"
        disabled={loading || !isFormValid}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processing Recharge...
          </div>
        ) : (
          <>
            <Zap className="h-5 w-5 mr-2" />
            Process Pinless Recharge
          </>
        )}
      </Button>
    </form>
  );
};

export default function PinlessRecharge() {
  const [formData, setFormData] = useState<PinlessFormData>({
    msisdn: '',
    amount: '',
    channelId: ''
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
      // Validation: all required fields
      if (!formData.msisdn || !formData.amount || !formData.channelId) {
        setAlert({
          type: 'error',
          message: 'All fields are required',
          details: 'Please fill in MSISDN, Amount, and Channel',
          show: true
        });
        setLoading(false);
        return;
      }

      // Numeric amount validation
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        setAlert({
          type: 'error',
          message: 'Invalid amount',
          details: 'Please enter a valid numeric amount greater than 0',
          show: true
        });
        setLoading(false);
        return;
      }

      // MSISDN format validation
      const msisdnRegex = /^\+?[1-9]\d{1,14}$/;
      if (!msisdnRegex.test(formData.msisdn.replace(/\s/g, ''))) {
        setAlert({
          type: 'error',
          message: 'Invalid MSISDN format',
          details: 'Please enter a valid phone number format',
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
          if (rand > 0.9) { // 10% error rate
            resolve({ status: 400 });
          } else if (rand > 0.85) { // 5% network error
            resolve({ status: 500 });
          } else { // 85% success rate
            resolve({ 
              status: 201, 
              data: {
                transactionId: `PNL${Date.now()}`,
                amount: parseFloat(formData.amount),
                channel: formData.channelId,
                newBalance: Math.floor(Math.random() * 1000) + parseFloat(formData.amount),
                fee: parseFloat(formData.amount) * 0.02
              }
            });
          }
        }, 1500);
      });

      if (response.status === 201) {
        // Success
        setAlert({
          type: 'success',
          message: 'Pinless recharge completed successfully!',
          details: `Transaction ID: ${response.data.transactionId} | Amount: KES ${response.data.amount} | Fee: KES ${response.data.fee.toFixed(2)} | Channel: ${response.data.channel}`,
          show: true
        });

        // Reset form on success
        setFormData({
          msisdn: '',
          amount: '',
          channelId: ''
        });
      } else {
        // Error handling
        let errorMessage = 'Recharge failed. Please try again.';
        let errorDetails = '';

        if (response.status === 400) {
          errorMessage = 'Invalid request or insufficient balance';
          errorDetails = 'Please check your details and account balance';
        } else if (response.status === 500) {
          errorMessage = 'System error occurred';
          errorDetails = 'Please try again later or contact support';
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
              <BreadcrumbPage>Pinless Recharge</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pinless Recharge</h1>
          <p className="text-muted-foreground">
            Process pinless recharges for customer accounts
          </p>
        </div>

        {/* Alert Display */}
        <AlertComponent alert={alert} onDismiss={dismissAlert} />

        {/* Pinless Recharge Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Pinless Recharge
            </CardTitle>
            <CardDescription>
              Enter the customer MSISDN, amount, and select the channel, then click Process Pinless Recharge to apply the credit.
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
