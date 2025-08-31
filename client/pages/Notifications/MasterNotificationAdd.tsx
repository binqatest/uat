import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, Save } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BU_OPTIONS = ['CBU','EBU','M-PESA'] as const;
const RESOURCE_TYPES = ['DATA','VOICE','SMS'] as const;
const VALIDITY = ['DAILY','WEEKLY','MONTHLY','UNLIMITED','MEGA'] as const;

export default function MasterNotificationAdd() {
  const nav = useNavigate();
  const [bu, setBu] = useState<string[]>([]);
  const [resourceType, setResourceType] = useState('');
  const [validity, setValidity] = useState('');
  const [bundleType, setBundleType] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [dynamicPrice, setDynamicPrice] = useState(false);
  const [price, setPrice] = useState('');
  const [name, setName] = useState('');
  const [content, setContent] = useState({ en: '', am: '', om: '', so: '', ti: '' });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showPrice = validity === 'UNLIMITED' || validity === 'MEGA';

  const submit = async () => {
    setError(null);
    setMessage(null);
    if (bu.length === 0) return setError('Select at least one Business Unit.');
    if (!resourceType || !validity || !bundleType || !notificationType || !name) return setError('Fill all required fields.');

    setLoading(true);
    try {
      const res = await fetch('/api/master-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessUnits: bu,
          resourceType,
          validity,
          bundleType,
          notificationType,
          dynamicPrice,
          price: showPrice ? (dynamicPrice ? null : Number(price || 0)) : Number(price || 0),
          name,
          content,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create');
      setMessage('Template created');
      nav('/master_notification_list');
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
              <BreadcrumbPage>Add Master Notification</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Add Master Notification</h1>
          <p className="text-muted-foreground">Create a new template</p>
        </div>

        {message && (<Alert className="border-green-200 bg-green-50 text-green-800"><AlertDescription>{message}</AlertDescription></Alert>)}
        {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}

        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Business Units</Label>
                <div className="flex flex-wrap gap-2 pt-2">
                  {BU_OPTIONS.map((b) => (
                    <label key={b} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={bu.includes(b)} onCheckedChange={(v) => setBu((prev) => v ? [...prev, b] : prev.filter((x) => x !== b))} />
                      {b}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Resource Type</Label>
                <Select value={resourceType} onValueChange={setResourceType}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {RESOURCE_TYPES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Validity</Label>
                <Select value={validity} onValueChange={setValidity}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {VALIDITY.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Bundle Type</Label>
                <Input className="mt-2" value={bundleType} onChange={(e) => setBundleType(e.target.value)} placeholder="Bundle Type" />
              </div>
              <div>
                <Label>Notification Type</Label>
                <Input className="mt-2" value={notificationType} onChange={(e) => setNotificationType(e.target.value)} placeholder="Notification Type" />
              </div>
              {showPrice && (
                <div>
                  <Label>Dynamic Price</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox checked={dynamicPrice} onCheckedChange={(v) => setDynamicPrice(!!v)} />
                    <span className="text-sm">Enable dynamic price (hide fixed price)</span>
                  </div>
                </div>
              )}
              {(!showPrice || !dynamicPrice) && (
                <div>
                  <Label>Price</Label>
                  <Input className="mt-2" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
                </div>
              )}
              <div className="md:col-span-2">
                <Label>Notification Name</Label>
                <Input className="mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Template name" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {(['en','am','om','so','ti'] as const).map((lang) => (
                <div key={lang}>
                  <Label>Marketing Description ({lang.toUpperCase()})</Label>
                  <textarea className="mt-2 w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={(content as any)[lang]} onChange={(e) => setContent((c) => ({ ...c, [lang]: e.target.value }))} />
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button className="bg-brand hover:bg-brand-600" type="button" onClick={() => setConfirmOpen(true)} disabled={loading}><Save className="h-4 w-4 mr-2" /> Save</Button>
              <Button variant="outline" type="button" onClick={() => nav('/master_notification_list')}>Cancel</Button>
            </div>

            {confirmOpen && (
              <div className="rounded-md border p-4 mt-2">
                <p className="text-sm mb-2">Confirm creation of this template?</p>
                <div className="flex gap-2">
                  <Button type="button" className="bg-brand hover:bg-brand-600" onClick={() => { setConfirmOpen(false); submit(); }}>Confirm</Button>
                  <Button variant="outline" type="button" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
