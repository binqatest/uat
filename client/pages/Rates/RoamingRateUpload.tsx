import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Home, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

export default function RoamingRateUpload() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError('Please select a CSV/XLS file to upload.');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/rates/roaming/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Upload failed');
      setMessage(data?.message || 'Upload processed successfully.');
      if (fileRef.current) fileRef.current.value = '';
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
              <BreadcrumbPage>Roaming Rate Upload</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Roaming Rate Upload</h1>
          <p className="text-muted-foreground">Upload a new roaming tariff CSV/XLS</p>
        </div>

        {message && (<Alert className="border-green-200 bg-green-50 text-green-800"><AlertDescription>{message}</AlertDescription></Alert>)}
        {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Upload Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Roaming Tariff File (CSV/XLS)</Label>
                <input ref={fileRef} type="file" accept=".csv,.xls,.xlsx" className="mt-2 w-full" />
              </div>
              <Button type="submit" disabled={loading} className="bg-brand hover:bg-brand-600">{loading ? 'Uploading...' : 'Submit'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
