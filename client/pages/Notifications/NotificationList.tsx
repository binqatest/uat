import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { MessageCircle, Home, Eye, Trash2, Download, RefreshCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

interface NotificationItem {
  id: string;
  nccId: string;
  content: string;
  businessUnit: string;
  resourceType: string;
  validity: string;
  bundleType: string;
  notificationType: string;
}

const BUSINESS_UNITS = ['CBU','EBU','M-PESA'] as const;
const RESOURCE_TYPES = ['DATA','VOICE','SMS'] as const;
const VALIDITY = ['DAILY','WEEKLY','MONTHLY','UNLIMITED','MEGA'] as const;

export default function NotificationList() {
  const [filters, setFilters] = useState({
    businessUnit: '',
    resourceType: '',
    validity: '',
    bundleType: '',
    notificationType: '',
    search: '',
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    const q = new URLSearchParams();
    Object.entries(filters).forEach(([k,v]) => { if (v) q.set(k, String(v)); });
    q.set('page', String(page));
    q.set('pageSize', String(pageSize));
    return q.toString();
  }, [filters, page, pageSize]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/notifications?${query}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load');
        setItems(data.items);
        setTotal(data.total);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const remove = async (id: string) => {
    const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    }
  };

  const regen = async (id: string) => {
    await fetch(`/api/notifications/${id}/regenerate`, { method: 'POST' });
    const res = await fetch(`/api/notifications?${query}`);
    const data = await res.json();
    if (res.ok) { setItems(data.items); }
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
              <BreadcrumbPage>All Notifications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Notification List</h1>
          <p className="text-muted-foreground">Filter, view, and manage notifications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div>
              <Label>Business Unit</Label>
              <Select value={filters.businessUnit || "__all__"} onValueChange={(v) => setFilters((f) => ({ ...f, businessUnit: v === "__all__" ? "" : v }))}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All</SelectItem>
                  {BUSINESS_UNITS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Resource Type</Label>
              <Select value={filters.resourceType || "__all__"} onValueChange={(v) => setFilters((f) => ({ ...f, resourceType: v === "__all__" ? "" : v }))}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All</SelectItem>
                  {RESOURCE_TYPES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Validity</Label>
              <Select value={filters.validity || "__all__"} onValueChange={(v) => setFilters((f) => ({ ...f, validity: v === "__all__" ? "" : v }))}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All</SelectItem>
                  {VALIDITY.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Bundle Type</Label>
              <Input className="mt-2" value={filters.bundleType} onChange={(e) => setFilters((f) => ({ ...f, bundleType: e.target.value }))} placeholder="Bundle Type" />
            </div>
            <div>
              <Label>Notification Type</Label>
              <Input className="mt-2" value={filters.notificationType} onChange={(e) => setFilters((f) => ({ ...f, notificationType: e.target.value }))} placeholder="Notification Type" />
            </div>
            <div>
              <Label>Search</Label>
              <Input className="mt-2" value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} placeholder="NCC ID or content" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" /> Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Notification ID</TableHead>
                    <TableHead>NCC ID</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell className="font-mono text-sm">{it.id}</TableCell>
                      <TableCell className="font-mono text-sm">{it.nccId}</TableCell>
                      <TableCell className="truncate max-w-[400px]" title={it.content}>{it.content}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/notification/${it.id}`} className="inline-flex"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></Link>
                          <Button variant="ghost" size="icon" onClick={() => regen(it.id)}><RefreshCcw className="h-4 w-4" /></Button>
                          <a href={`/api/notifications/${it.id}/download`} className="inline-flex"><Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button></a>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete notification?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => remove(it.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-6">{loading ? 'Loading...' : 'No notifications found.'}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
