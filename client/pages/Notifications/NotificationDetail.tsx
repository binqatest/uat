import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Home, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface NotificationItem {
  id: string;
  nccId: string;
  businessUnit: string;
  resourceType: string;
  validity: string;
  bundleType: string;
  notificationType: string;
  price: number | null;
  content: string;
  marketing: { en: string; am: string; om: string; so: string; ti: string };
  updatedAt: string;
  author: string;
  reason?: string;
}

export default function NotificationDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState<NotificationItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setError(null);
      const res = await fetch(`/api/notifications/${id}`);
      const data = await res.json();
      if (!res.ok) { setError(data?.error || 'Failed to load'); return; }
      setItem(data);
    };
    load();
  }, [id]);

  const update = async () => {
    if (!item) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/notifications/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketing: item.marketing, price: item.price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update');
      setMessage('Saved successfully');
      setItem(data);
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setSaving(false);
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
              <BreadcrumbPage>Notification Detail</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {item && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Information</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{item.id}</span></div>
                  <div><span className="text-muted-foreground">NCC ID:</span> <span className="font-mono">{item.nccId}</span></div>
                  <div><span className="text-muted-foreground">Business Unit:</span> {item.businessUnit}</div>
                  <div><span className="text-muted-foreground">Resource Type:</span> {item.resourceType}</div>
                  <div><span className="text-muted-foreground">Validity:</span> {item.validity}</div>
                  <div><span className="text-muted-foreground">Bundle Type:</span> {item.bundleType}</div>
                  <div><span className="text-muted-foreground">Notification Type:</span> {item.notificationType}</div>
                  <div><span className="text-muted-foreground">Price:</span> {item.price ?? '—'}</div>
                  <div><span className="text-muted-foreground">Updated:</span> {new Date(item.updatedAt).toLocaleString()}</div>
                  <div><span className="text-muted-foreground">Author:</span> {item.author}</div>
                  {item.reason && (<div><span className="text-muted-foreground">Reason:</span> {item.reason}</div>)}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Marketing Descriptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['en','am','om','so','ti'] as const).map((lang) => (
                      <div key={lang}>
                        <Label>Marketing ({lang.toUpperCase()})</Label>
                        <textarea className="mt-2 w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={item?.marketing[lang] || ''} onChange={(e) => setItem((it) => it ? { ...it, marketing: { ...it.marketing, [lang]: e.target.value } } : it)} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-brand hover:bg-brand-600" type="button" onClick={update} disabled={saving}><Save className="h-4 w-4 mr-2" /> Save</Button>
                    <Button variant="outline" type="button" onClick={() => nav('/notification_list')}>Back</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Finalized Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm whitespace-pre-wrap">{item.content}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!item && !error && (<p className="text-sm text-muted-foreground">Loading...</p>)}
        {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}
      </div>
    </Layout>
  );
}
