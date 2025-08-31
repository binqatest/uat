import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, Settings, Download, FileJson } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

interface BundleRow {
  channel: string;
  duration: string;
  additionalValidity?: string;
  bundleType: string;
  sellingType: string;
  resourceSize: number;
  price: number;
}

const DURATIONS = ['DAILY','WEEKLY','MONTHLY','UNLIMITED','MEGA'] as const;

export default function BundleConfigGenerator() {
  const [channel, setChannel] = useState('USSD');
  const [duration, setDuration] = useState('DAILY');
  const [additionalValidity, setAdditionalValidity] = useState('');
  const [bundleType, setBundleType] = useState('DATA');
  const [sellingType, setSellingType] = useState('PREPAID');
  const [resourceSize, setResourceSize] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<BundleRow[]>([]);
  const hiddenRef = useRef<HTMLInputElement | null>(null);

  const showAdditional = useMemo(() => duration === 'UNLIMITED' || duration === 'MEGA', [duration]);

  const addRow = () => {
    setError(null);
    const r = Number(resourceSize);
    const p = Number(price);
    if (!Number.isFinite(r) || r <= 0) return setError('Resource Size must be a number > 0.');
    if (!Number.isFinite(p) || p <= 0) return setError('Price must be a number > 0.');

    const row: BundleRow = {
      channel,
      duration,
      additionalValidity: showAdditional ? additionalValidity : undefined,
      bundleType,
      sellingType,
      resourceSize: r,
      price: p,
    };
    const next = [row, ...rows];
    setRows(next);
    // store JSON for backend processing
    if (hiddenRef.current) hiddenRef.current.value = JSON.stringify(next);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bundle-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bundles');
    XLSX.writeFile(wb, 'bundle-config.xlsx');
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
              <BreadcrumbPage>Bundle Config Generator</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Bundle Configuration Generator</h1>
            <p className="text-muted-foreground">Generate JSON, view table, and export</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportExcel}><Download className="h-4 w-4 mr-2" /> Excel</Button>
            <Button variant="outline" onClick={exportJSON}><FileJson className="h-4 w-4 mr-2" /> JSON</Button>
          </div>
        </div>

        {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Configuration</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Channel</Label>
              <Input className="mt-2" value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="e.g., USSD, APP" />
            </div>
            <div>
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            { (duration === 'UNLIMITED' || duration === 'MEGA') && (
              <div>
                <Label>Additional Validity</Label>
                <Input className="mt-2" value={additionalValidity} onChange={(e) => setAdditionalValidity(e.target.value)} placeholder="e.g., Nights/Weekends" />
              </div>
            )}
            <div>
              <Label>Bundle Type</Label>
              <Select value={bundleType} onValueChange={setBundleType}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DATA">DATA</SelectItem>
                  <SelectItem value="VOICE">VOICE</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="COMBO">COMBO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Selling Type</Label>
              <Select value={sellingType} onValueChange={setSellingType}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PREPAID">PREPAID</SelectItem>
                  <SelectItem value="POSTPAID">POSTPAID</SelectItem>
                  <SelectItem value="HYBRID">HYBRID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Resource Size</Label>
              <Input className="mt-2" inputMode="decimal" value={resourceSize} onChange={(e) => setResourceSize(e.target.value)} placeholder="e.g., 1024" />
            </div>
            <div>
              <Label>Price</Label>
              <Input className="mt-2" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 50" />
            </div>
            <div className="md:col-span-3">
              <Button className="bg-brand hover:bg-brand-600" onClick={addRow}>Add</Button>
              <input ref={hiddenRef} type="hidden" name="bundle_info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Bundles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">Channel</th>
                    <th className="p-2">Duration</th>
                    <th className="p-2">Additional Validity</th>
                    <th className="p-2">Bundle Type</th>
                    <th className="p-2">Selling Type</th>
                    <th className="p-2">Resource Size</th>
                    <th className="p-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{r.channel}</td>
                      <td className="p-2">{r.duration}</td>
                      <td className="p-2">{r.additionalValidity || '—'}</td>
                      <td className="p-2">{r.bundleType}</td>
                      <td className="p-2">{r.sellingType}</td>
                      <td className="p-2">{r.resourceSize}</td>
                      <td className="p-2">{r.price}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td className="p-2 text-muted-foreground" colSpan={7}>No bundles generated yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
