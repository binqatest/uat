import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Home } from 'lucide-react';
import { useState } from 'react';

interface BucketDef {
  name: string;
  unitType: string;
}

const msisdnRegex = /^\+?\d{8,15}$/;

export default function CVMBundle() {
  const [msisdn, setMsisdn] = useState('');
  const [bundleId, setBundleId] = useState('');
  const [buckets, setBuckets] = useState<BucketDef[] | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBuckets = async () => {
    setMessage(null);
    setError(null);

    if (!bundleId.trim()) {
      setError('Bundle ID is required to fetch buckets.');
      return;
    }

    try {
      const res = await fetch(`/api/cvm/bundles/${encodeURIComponent(bundleId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch bundle buckets');
      setBuckets(data?.buckets || []);
      setValues({});
      if (!data?.buckets?.length) setMessage('No buckets found for this bundle.');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      setBuckets(null);
    }
  };

  const subscribe = async () => {
    setMessage(null);
    setError(null);

    if (!msisdnRegex.test(msisdn)) {
      setError('Please enter a valid MSISDN.');
      return;
    }
    if (!bundleId.trim()) {
      setError('Bundle ID is required.');
      return;
    }
    if (!buckets || buckets.length === 0) {
      setError('No buckets to subscribe. Fetch bucket list first.');
      return;
    }

    const payloadBuckets = buckets.map(b => ({ name: b.name, value: Number(values[b.name] || 0) }));
    if (payloadBuckets.some(b => !Number.isFinite(b.value) || b.value <= 0)) {
      setError('All bucket values must be numbers greater than 0.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/cvm/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msisdn, bundleId, buckets: payloadBuckets }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to subscribe');
      setMessage(data?.message || 'Subscription successful.');
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
              <BreadcrumbPage>CVM Bundle</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">CVM Bundle Subscription</h1>
          <p className="text-muted-foreground">Subscribe CVM bundles with dynamic buckets</p>
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
              <Users className="h-5 w-5" />
              CVM Bundle
            </CardTitle>
            <CardDescription>Enter MSISDN and Bundle ID, then fetch buckets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="msisdn">MSISDN</Label>
                <Input id="msisdn" value={msisdn} onChange={(e) => setMsisdn(e.target.value)} placeholder="MSISDN" required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bundleId">Bundle ID</Label>
                <div className="flex gap-2">
                  <Input id="bundleId" value={bundleId} onChange={(e) => setBundleId(e.target.value)} placeholder="Bundle ID" required />
                  <Button type="button" onClick={fetchBuckets} className="bg-brand hover:bg-brand-600">Fetch Buckets</Button>
                </div>
              </div>
            </div>

            {buckets && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bucket Name</TableHead>
                      <TableHead>Unit Type</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buckets.map((b) => (
                      <TableRow key={b.name}>
                        <TableCell className="font-medium">{b.name}</TableCell>
                        <TableCell>{b.unitType}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            value={values[b.name] || ''}
                            onChange={(e) => setValues(v => ({ ...v, [b.name]: e.target.value }))}
                            placeholder="Enter value"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <Button type="button" onClick={subscribe} disabled={loading} className="bg-brand hover:bg-brand-600">{loading ? 'Subscribing...' : 'Subscribe'}</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
