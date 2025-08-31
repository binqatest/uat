import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Gift as GiftIcon, Home } from 'lucide-react';
import { useState } from 'react';

const msisdnRegex = /^\+?\d{8,15}$/;

export default function GiftBundle() {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [bundleId, setBundleId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!msisdnRegex.test(sender) || !msisdnRegex.test(receiver)) {
      setError('Please enter valid MSISDNs for both sender and receiver.');
      return;
    }
    if (!bundleId.trim()) {
      setError('Bundle ID is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bundles/gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, receiver, bundleId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to process gift');
      setMessage(data?.message || 'Gift sent successfully.');
      setSender('');
      setReceiver('');
      setBundleId('');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
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
              <BreadcrumbPage>Gift Bundle</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gift Bundle</h1>
          <p className="text-muted-foreground">Send a bundle from one MSISDN to another</p>
        </div>

        {message && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GiftIcon className="h-5 w-5" />
              Gift Bundle
            </CardTitle>
            <CardDescription>Provide sender, receiver and bundle ID</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="sender">Sender (A Party)</Label>
                  <Input id="sender" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="MSISDN" required />
                </div>
                <div>
                  <Label htmlFor="receiver">Receiver (B Party)</Label>
                  <Input id="receiver" value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="MSISDN" required />
                </div>
              </div>
              <div>
                <Label htmlFor="bundleId">Bundle ID</Label>
                <Input id="bundleId" value={bundleId} onChange={(e) => setBundleId(e.target.value)} placeholder="Bundle ID" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-600">
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
