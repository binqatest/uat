import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Home, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface MasterNotification {
  id: string;
  businessUnits: string[];
  resourceType: string;
  validity: string;
  bundleType: string;
  notificationType: string;
  dynamicPrice?: boolean;
  price?: number | null;
  name: string;
  content: { en: string; am: string; om: string; so: string; ti: string };
}

export default function MasterNotificationDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState<MasterNotification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setError(null);
      const res = await fetch(`/api/master-notifications/${id}`);
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
      const res = await fetch(`/api/master-notifications/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: item.content, price: item.price }),
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
              <BreadcrumbPage>Master Notification Detail</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {item && (
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{item.name}</h1>
            <p className="text-muted-foreground">View metadata, edit multilingual template content</p>
          </div>
        )}

        {message && (<Alert className="border-green-200 bg-green-50 text-green-800"><AlertDescription>{message}</AlertDescription></Alert>)}
        {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}

        {item && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div><span className="text-muted-foreground">Business Unit:</span> <span className="font-medium">{item.businessUnits.join(', ')}</span></div>
                <div><span className="text-muted-foreground">Resource Type:</span> <span className="font-medium">{item.resourceType}</span></div>
                <div><span className="text-muted-foreground">Validity:</span> <span className="font-medium">{item.validity}</span></div>
                <div><span className="text-muted-foreground">Bundle Type:</span> <span className="font-medium">{item.bundleType}</span></div>
                <div><span className="text-muted-foreground">Notification Type:</span> <span className="font-medium">{item.notificationType}</span></div>
                <div><span className="text-muted-foreground">Dynamic Price:</span> <span className="font-medium">{item.dynamicPrice ? 'Yes' : 'No'}</span></div>
                <div><span className="text-muted-foreground">Price:</span> <span className="font-medium">{item.price ?? '—'}</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Edit Template Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {(['en','am','om','so','ti'] as const).map((lang) => (
                    <div key={lang}>
                      <Label>Content ({lang.toUpperCase()})</Label>
                      <textarea className="mt-2 w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={item.content[lang]} onChange={(e) => setItem((it) => it ? { ...it, content: { ...it.content, [lang]: e.target.value } } : it)} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button className="bg-brand hover:bg-brand-600" type="button" onClick={update} disabled={saving}><Save className="h-4 w-4 mr-2" /> Save</Button>
                  <Button variant="outline" type="button" onClick={() => nav('/master_notification_list')}>Back</Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
