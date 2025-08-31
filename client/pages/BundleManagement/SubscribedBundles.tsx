import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { List, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SubscribedBundle {
  bundleName: string;
  bucketName: string;
  status: string;
  validity: string;
}

const msisdnRegex = /^\+?\d{8,15}$/;

export default function SubscribedBundles() {
  const [msisdn, setMsisdn] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<SubscribedBundle[] | null>(null);

  const search = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMessage(null);
    setError(null);

    if (!msisdnRegex.test(msisdn)) {
      setError('Please enter a valid MSISDN.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/subscriptions?msisdn=${encodeURIComponent(msisdn)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch subscriptions');
      setRows(data?.items || []);
      if (!data?.items?.length) setMessage('No subscribed bundles found.');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      setRows(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRows(null);
    setMessage(null);
    setError(null);
  }, [msisdn]);

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
              <BreadcrumbPage>Subscribed Bundles</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Subscribed Bundles</h1>
          <p className="text-muted-foreground">View currently subscribed bundles for a user</p>
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
              <List className="h-5 w-5" />
              Search Subscribed Bundles
            </CardTitle>
            <CardDescription>Enter MSISDN to fetch subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={search} className="flex flex-col md:flex-row gap-3 md:items-end">
              <div className="flex-1">
                <Label htmlFor="msisdn">MSISDN</Label>
                <Input id="msisdn" value={msisdn} onChange={(e) => setMsisdn(e.target.value)} placeholder="MSISDN" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-600">{loading ? 'Searching...' : 'Search'}</Button>
            </form>
          </CardContent>
        </Card>

        {rows && (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
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
                    {rows.map((r, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{r.bundleName}</TableCell>
                        <TableCell>{r.bucketName}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>{r.validity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
