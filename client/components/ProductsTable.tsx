import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
  id: string;
  productCategory: string;
  resourceType: string;
  validity: string;
  productType: string;
  nccId: string;
}

interface ProductsTableProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductsTable({ products, loading = false }: ProductsTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products Overview
          </CardTitle>
          <CardDescription>Recent products in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products Overview
          </CardTitle>
          <CardDescription>Recent products in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No products found in the system. Products will appear here once they are added.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Products Overview
        </CardTitle>
        <CardDescription>
          Showing {products.length} product{products.length !== 1 ? 's' : ''} in the system
        </CardDescription>
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
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.productCategory}
                  </TableCell>
                  <TableCell>
                    <Badge className={getResourceTypeColor(product.resourceType)}>
                      {product.resourceType}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.validity}</TableCell>
                  <TableCell>
                    <Badge className={getProductTypeColor(product.productType)}>
                      {product.productType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {product.nccId}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
