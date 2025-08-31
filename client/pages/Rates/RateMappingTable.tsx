import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home, Download, GitCompare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface MappingRow {
  tariffPlanKey: string;
  callTypeKey: string;
  originationTypeKey: string;
  destinationTypeKey: string;
  peakKey: string;
  rateIdValue: string;
}

export default function RateMappingTable() {
  const [items, setItems] = useState<MappingRow[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/rates/mapping');
      const data = await res.json();
      if (res.ok) setItems(data.items || []);
    };
    load();
  }, []);

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
              <BreadcrumbPage>Rate Mapping Table</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Rate Mapping Table</h1>
            <p className="text-muted-foreground">Generated mapping table for roaming tariffs</p>
          </div>
          <div className="flex gap-2">
            <a href="/api/rates/mapping/download"><Button variant="outline"><Download className="h-4 w-4 mr-2" /> Download Mapping Table</Button></a>
            <Link to="/rate_mapping_compare"><Button className="bg-brand hover:bg-brand-600"><GitCompare className="h-4 w-4 mr-2" /> Compare with Old Version</Button></Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mapping Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>TariffPlan::key</TableHead>
                    <TableHead>Call_Type::key</TableHead>
                    <TableHead>Origination_Type::key</TableHead>
                    <TableHead>Destination_Type::key</TableHead>
                    <TableHead>Peak::key</TableHead>
                    <TableHead>Rate_ID::value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs">{r.tariffPlanKey}</TableCell>
                      <TableCell className="font-mono text-xs">{r.callTypeKey}</TableCell>
                      <TableCell className="font-mono text-xs">{r.originationTypeKey}</TableCell>
                      <TableCell className="font-mono text-xs">{r.destinationTypeKey}</TableCell>
                      <TableCell className="font-mono text-xs">{r.peakKey}</TableCell>
                      <TableCell className="font-mono text-xs">{r.rateIdValue}</TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-6">No data available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
