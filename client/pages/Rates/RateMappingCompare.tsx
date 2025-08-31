import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Home, FileDiff } from 'lucide-react';
import { useRef, useState } from 'react';

interface CompareResult {
  summary: { added: number; removed: number; updated: number };
  added: any[];
  removed: any[];
  updated: any[];
}

export default function RateMappingCompare() {
  const oldRef = useRef<HTMLInputElement | null>(null);
  const newRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const f1 = oldRef.current?.files?.[0];
    const f2 = newRef.current?.files?.[0];
    if (!f1 || !f2) { setError('Please select both CSV files.'); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('old', f1);
      fd.append('new', f2);
      const res = await fetch('/api/rates/mapping/compare', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to compare');
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Error');
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
              <BreadcrumbPage>Compare Two Tariff</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Compare Two Tariff Mapping Tables</h1>
          <p className="text-muted-foreground">Upload old and new CSV versions to see differences</p>
        </div>

        {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}
        {result && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>
              Added: {result.summary.added}, Updated: {result.summary.updated}, Removed: {result.summary.removed}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileDiff className="h-5 w-5" /> Upload CSVs</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Old Version CSV</Label>
                <input ref={oldRef} type="file" accept=".csv" className="mt-2 w-full" />
              </div>
              <div>
                <Label>New Version CSV</Label>
                <input ref={newRef} type="file" accept=".csv" className="mt-2 w-full" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-600">{loading ? 'Comparing...' : 'Submit'}</Button>
            </form>

            {result && (
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-semibold">Added</h3>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">{JSON.stringify(result.added, null, 2)}</pre>
                </div>
                <div>
                  <h3 className="font-semibold">Updated</h3>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">{JSON.stringify(result.updated, null, 2)}</pre>
                </div>
                <div>
                  <h3 className="font-semibold">Removed</h3>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">{JSON.stringify(result.removed, null, 2)}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
