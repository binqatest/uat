import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export interface DashboardProductRow {
  id: string;
  productCategory: string;
  resourceType: string;
  validity: string;
  productType: string;
  nccId: string;
}

interface DashboardProductsTableProps {
  title: string;
  rows: DashboardProductRow[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const getResourceTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'data':
      return 'bg-blue-100 text-blue-800';
    case 'voice':
      return 'bg-green-100 text-green-800';
    case 'sms':
      return 'bg-purple-100 text-purple-800';
    case 'combo':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getProductTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'bundle':
      return 'bg-emerald-100 text-emerald-800';
    case 'package':
      return 'bg-cyan-100 text-cyan-800';
    case 'addon':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function DashboardProductsTable({ title, rows, total, page, pageSize, onPageChange, onPageSizeChange }: DashboardProductsTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger className="w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5,10,15,20].map(size => (
                <SelectItem key={size} value={String(size)}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Category</TableHead>
                <TableHead>Resource Type</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Product Type</TableHead>
                <TableHead>NCC ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.productCategory}</TableCell>
                  <TableCell>
                    <Badge className={getResourceTypeColor(row.resourceType)}>{row.resourceType}</Badge>
                  </TableCell>
                  <TableCell>{row.validity}</TableCell>
                  <TableCell>
                    <Badge className={getProductTypeColor(row.productType)}>{row.productType}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{row.nccId}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-6">No products found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {from}-{to} of {total}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); onPageChange(Math.max(1, page - 1)); }}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-3 py-2 text-sm">Page {page} of {totalPages}</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); onPageChange(Math.min(totalPages, page + 1)); }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
