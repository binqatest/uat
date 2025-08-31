import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, Calculator } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function TaxCalculator() {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'net' | 'gross'>('net');
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => {
    const val = Number(input);
    if (!input.trim()) return null;
    if (!Number.isFinite(val) || val < 0) return 'invalid';
    return val;
  }, [input]);

  const result = useMemo(() => {
    if (parsed === null || parsed === 'invalid') return null;
    const TAX_RATE = 0.2075; // 20.75%
    if (inputType === 'net') {
      const effective = parsed;
      const tax = effective * TAX_RATE;
      const total = effective + tax;
      return { effective, tax, total };
    } else {
      // input is gross/total; derive effective (net) and tax
      const total = parsed;
      const effective = total / (1 + TAX_RATE);
      const tax = total - effective;
      return { effective, tax, total };
    }
  }, [parsed, inputType]);

  useEffect(() => {
    if (parsed === 'invalid') setError('Enter a valid non-negative number.');
    else setError(null);
  }, [parsed]);

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
              <BreadcrumbPage>Tax Calculator</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Tax Calculation</h1>
          <p className="text-muted-foreground">Instantly compute Effective, Tax (20.75%), and Total</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> Calculator</CardTitle>
            <CardDescription>Choose your input type and enter an amount</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div>
              <Label>Input Type</Label>
              <Select value={inputType} onValueChange={(v) => setInputType(v as 'net'|'gross')}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="net">Effective (Net)</SelectItem>
                  <SelectItem value="gross">Total (Gross)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount</Label>
              <Input className="mt-2" inputMode="decimal" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 1000" />
            </div>
            <div>
              <Button disabled className="w-full opacity-75">Live Calculation</Button>
            </div>
          </CardContent>
        </Card>

        {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Effective Amount</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{result ? result.effective.toFixed(2) : '—'}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Tax Amount (20.75%)</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{result ? result.tax.toFixed(2) : '—'}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Total Amount</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{result ? result.total.toFixed(2) : '—'}</CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
