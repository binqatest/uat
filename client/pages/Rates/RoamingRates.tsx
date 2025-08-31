import Layout from '@/components/Layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home, Download, FileArchive, List } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface RateRow {
  country: string;
  callToEthiopia: number;
  callToLocal: number;
  callToOther: number;
  receivingCall: number;
  dataMb: number;
  sendingSms: number;
  receivingSms: number;
}

export default function RoamingRates() {
  const [items, setItems] = useState<RateRow[]>([]);
  const [excelFileName, setExcelFileName] = useState<string | null>(null);
  const [zipFileName, setZipFileName] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/rates/roaming');
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setExcelFileName(data.excelFileName || null);
        setZipFileName(data.zipFileName || null);
      }
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
              <BreadcrumbPage>Roaming Rates</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Roaming Rates</h1>
            <p className="text-muted-foreground">Current roaming rates for countries and services</p>
          </div>
          <div className="flex gap-2">
            <a href="/api/rates/roaming/download-excel"><Button variant="outline"><Download className="h-4 w-4 mr-2" /> Download Excel</Button></a>
            {zipFileName && (<a href="/api/rates/roaming/download-zip"><Button variant="outline"><FileArchive className="h-4 w-4 mr-2" /> Download Rate ID</Button></a>)}
            <Link to="/rate_mapping_table"><Button className="bg-brand hover:bg-brand-600"><List className="h-4 w-4 mr-2" /> Create Mapping Table</Button></Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Roaming Rate Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Countries</TableHead>
                    <TableHead>Call to Ethiopia (Birr/min)</TableHead>
                    <TableHead>Call to Local (Birr/min)</TableHead>
                    <TableHead>Call to Other Countries (Birr/min)</TableHead>
                    <TableHead>Receiving Call (Birr/min)</TableHead>
                    <TableHead>Data (Birr/MB)</TableHead>
                    <TableHead>Sending SMS (Birr/SMS)</TableHead>
                    <TableHead>Receiving SMS (Birr/SMS)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{r.country}</TableCell>
                      <TableCell>{r.callToEthiopia}</TableCell>
                      <TableCell>{r.callToLocal}</TableCell>
                      <TableCell>{r.callToOther}</TableCell>
                      <TableCell>{r.receivingCall}</TableCell>
                      <TableCell>{r.dataMb}</TableCell>
                      <TableCell>{r.sendingSms}</TableCell>
                      <TableCell>{r.receivingSms}</TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-6">No data available.</TableCell>
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
