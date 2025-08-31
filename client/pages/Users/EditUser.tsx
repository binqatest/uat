import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin'|'QA'|'Business'|'User';
  status: 'Active'|'Inactive';
}

export default function EditUser() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState<UserRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();
      if (!res.ok) { setError(data?.error || 'Failed to load'); return; }
      setForm(data);
    };
    load();
  }, [id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/users/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Update failed');
      setMessage('Saved successfully');
      setTimeout(() => nav('/user_management'), 800);
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
              <BreadcrumbPage>Edit User</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit User</h1>
          <p className="text-muted-foreground">Update user details</p>
        </div>

        {message && (<Alert className="border-green-200 bg-green-50 text-green-800"><AlertDescription>{message}</AlertDescription></Alert>)}
        {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}

        {form && (
          <Card>
            <CardHeader>
              <CardTitle>User #{form.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={save} className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...(form as any), firstName: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...(form as any), lastName: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...(form as any), email: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select id="status" value={form.status} onChange={(e) => setForm({ ...(form as any), status: e.target.value as any })} className="mt-2 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select id="role" value={form.role} onChange={(e) => setForm({ ...(form as any), role: e.target.value as any })} className="mt-2 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="Admin">Admin</option>
                    <option value="QA">QA</option>
                    <option value="Business">Business</option>
                    <option value="User">User</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full bg-brand hover:bg-brand-600" disabled={loading}><Save className="h-4 w-4 mr-2" /> {loading ? 'Saving...' : 'Save'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
