import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import ProductCategoryCard from '@/components/ProductCategoryCard';
import BundleDistributionChart from '@/components/BundleDistributionChart';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  Smartphone, 
  Wallet, 
  CreditCard, 
  Users, 
  Banknote, 
  Globe, 
  ShoppingCart, 
  Gift,
  Home
} from 'lucide-react';
import DashboardProductsTable, { DashboardProductRow } from '@/components/DashboardProductsTable';

interface ProductCategory {
  name: string;
  count: number;
  tags: string[];
  link: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface ChartData {
  category: string;
  count: number;
  color: string;
}

// Mock data - in real app, this would come from API
const mockProductCategories: ProductCategory[] = [
  {
    name: 'CBU',
    count: 25,
    tags: ['DATA', 'VOICE'],
    link: '/bundle_page/CBU',
    icon: <Smartphone className="h-5 w-5 text-blue-600" />,
    description: 'Core Banking Unit products',
    color: '#3B82F6'
  },
  {
    name: 'EBU',
    count: 18,
    tags: ['DATA', 'SMS'],
    link: '/bundle_page/EBU',
    icon: <Wallet className="h-5 w-5 text-green-600" />,
    description: 'Electronic Banking Unit',
    color: '#10B981'
  },
  {
    name: 'M-PESA',
    count: 32,
    tags: ['VOICE', 'SMS'],
    link: '/bundle_page/M-PESA',
    icon: <CreditCard className="h-5 w-5 text-orange-600" />,
    description: 'Mobile Money Services',
    color: '#F59E0B'
  },
  {
    name: 'CVM',
    count: 14,
    tags: ['DATA'],
    link: '/bundle_page/CVM',
    icon: <Users className="h-5 w-5 text-purple-600" />,
    description: 'Customer Value Management',
    color: '#8B5CF6'
  },
  {
    name: 'Loan',
    count: 22,
    tags: ['VOICE'],
    link: '/bundle_page/Loan',
    icon: <Banknote className="h-5 w-5 text-red-600" />,
    description: 'Loan Products',
    color: '#EF4444'
  },
  {
    name: 'ROAMING',
    count: 8,
    tags: ['DATA', 'VOICE', 'SMS'],
    link: '/bundle_page/ROAMING',
    icon: <Globe className="h-5 w-5 text-cyan-600" />,
    description: 'International Roaming',
    color: '#06B6D4'
  },
  {
    name: 'S&D',
    count: 16,
    tags: ['DATA', 'SMS'],
    link: '/bundle_page/S&D',
    icon: <ShoppingCart className="h-5 w-5 text-pink-600" />,
    description: 'Sales & Distribution',
    color: '#EC4899'
  },
  {
    name: 'J4U',
    count: 11,
    tags: ['VOICE', 'SMS'],
    link: '/bundle_page/J4U',
    icon: <Gift className="h-5 w-5 text-indigo-600" />,
    description: 'Just For You offers',
    color: '#6366F1'
  }
];

const resourceTypes = ['DATA', 'VOICE', 'SMS', 'COMBO'] as const;
const productTypes = ['Bundle', 'Package', 'Addon'] as const;

function generateProducts(categories: ProductCategory[], totalPerCategory = 12): DashboardProductRow[] {
  const rows: DashboardProductRow[] = [];
  let idSeq = 1;
  for (const cat of categories) {
    for (let i = 0; i < totalPerCategory; i++) {
      const rType = resourceTypes[i % resourceTypes.length];
      const pType = productTypes[(i + 1) % productTypes.length];
      const validityDays = [1, 7, 14, 30][i % 4];
      rows.push({
        id: `row-${idSeq++}`,
        productCategory: cat.name,
        resourceType: rType,
        validity: `${validityDays} days`,
        productType: pType,
        nccId: `${cat.name}-${String(i + 1).padStart(4, '0')}`,
      });
    }
  }
  return rows;
}

export default function Dashboard() {
  const [productCounts, setProductCounts] = useState<ProductCategory[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [allProducts, setAllProducts] = useState<DashboardProductRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProductCounts(mockProductCategories);
        const cData = mockProductCategories.map(category => ({
          category: category.name,
          count: category.count,
          color: category.color,
        }));
        setChartData(cData);
        setAllProducts(generateProducts(mockProductCategories, 12));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalProducts = productCounts.reduce((sum, category) => sum + category.count, 0);

  const filtered = useMemo(() => {
    return selectedCategory
      ? allProducts.filter(p => p.productCategory === selectedCategory)
      : allProducts;
  }, [allProducts, selectedCategory]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const rows = filtered.slice(start, end);

  const tableTitle = selectedCategory ? `Selected Category: ${selectedCategory}` : 'All Products';

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

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
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of products and system metrics</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-brand">{totalProducts}</div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </div>
        </div>

        {/* Product Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-32 bg-muted animate-pulse rounded-lg"></div>
            ))
          ) : (
            productCounts.map((category, index) => (
              <ProductCategoryCard
                key={index}
                category={category.name}
                count={category.count}
                tags={category.tags}
                link={category.link}
                icon={category.icon}
                description={category.description}
                onClick={handleCategoryClick}
              />
            ))
          )}
        </div>

        {/* Bundle Distribution Chart - Full Width */}
        <div className="w-full">
          {loading ? (
            <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
          ) : (
            <BundleDistributionChart data={chartData} />
          )}
        </div>

        {/* Dynamic Products Table */}
        <DashboardProductsTable
          title={tableTitle}
          rows={rows}
          total={total}
          page={currentPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        />
      </div>
    </Layout>
  );
}
