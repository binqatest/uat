import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Home, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const categoryDescriptions: { [key: string]: string } = {
  'CBU': 'Core Banking Unit - Essential banking products and services',
  'EBU': 'Electronic Banking Unit - Digital banking solutions',
  'M-PESA': 'Mobile Money Services - Financial transactions via mobile',
  'CVM': 'Customer Value Management - Personalized customer offerings',
  'Loan': 'Loan Products - Various lending solutions',
  'ROAMING': 'International Roaming - Global connectivity services',
  'S&D': 'Sales & Distribution - Channel management products',
  'J4U': 'Just For You - Personalized promotional offers'
};

const categoryTags: { [key: string]: string[] } = {
  'CBU': ['DATA', 'VOICE'],
  'EBU': ['DATA', 'SMS'],
  'M-PESA': ['VOICE', 'SMS'],
  'CVM': ['DATA'],
  'Loan': ['VOICE'],
  'ROAMING': ['DATA', 'VOICE', 'SMS'],
  'S&D': ['DATA', 'SMS'],
  'J4U': ['VOICE', 'SMS']
};

export default function BundlePage() {
  const { category } = useParams<{ category: string }>();
  
  if (!category) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive">Invalid Category</h1>
          <p className="text-muted-foreground mt-2">Category not specified</p>
          <Button asChild className="mt-4">
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const description = categoryDescriptions[category] || 'Product category';
  const tags = categoryTags[category] || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
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
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category} Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Button variant="outline" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-8 w-8 text-brand" />
            <h1 className="text-3xl font-bold text-foreground">{category} Products</h1>
          </div>
          <p className="text-muted-foreground">{description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className={
                  tag === 'DATA' ? "bg-blue-100 text-blue-800" :
                  tag === 'VOICE' ? "bg-green-100 text-green-800" :
                  tag === 'SMS' ? "bg-purple-100 text-purple-800" :
                  ""
                }
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {category} Product Management
            </CardTitle>
            <CardDescription>
              Manage and view products in the {category} category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                {category} Products Coming Soon
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                The {category} product management interface is being developed. 
                You'll be able to view, create, and manage {category} products here.
              </p>
              <div className="mt-6 space-x-3">
                <Button asChild>
                  <Link to="/">Return to Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/bundle_info">View Bundle Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand">0</div>
              <p className="text-sm text-muted-foreground">Products in {category}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">0</div>
              <p className="text-sm text-muted-foreground">Current subscriptions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">KES 0</div>
              <p className="text-sm text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
