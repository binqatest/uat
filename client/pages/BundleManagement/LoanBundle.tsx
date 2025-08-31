import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Banknote, Home } from 'lucide-react';
import { useState } from 'react';

const msisdnRegex = /^\+?\d{8,15}$/;

export default function LoanBundle() {
  const [msisdn, setMsisdn] = useState('');
  const [loanId, setLoanId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!msisdnRegex.test(msisdn)) {
      setError('Please enter a valid MSISDN.');
      return;
    }
    if (!loanId.trim()) {
      setError('Loan ID is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bundles/loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msisdn, loanId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to process loan');
      setMessage(data?.message || 'Loan processed successfully.');
      setMsisdn('');
      setLoanId('');
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
              <BreadcrumbPage>Loan Bundle</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Loan Bundle</h1>
          <p className="text-muted-foreground">Take a loan associated with a bundle</p>
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
              <Banknote className="h-5 w-5" />
              Loan Bundle
            </CardTitle>
            <CardDescription>Provide MSISDN and Loan ID</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="msisdn">MSISDN</Label>
                <Input id="msisdn" value={msisdn} onChange={(e) => setMsisdn(e.target.value)} placeholder="MSISDN" required />
              </div>
              <div>
                <Label htmlFor="loanId">Loan ID</Label>
                <Input id="loanId" value={loanId} onChange={(e) => setLoanId(e.target.value)} placeholder="Loan ID" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-600">
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
