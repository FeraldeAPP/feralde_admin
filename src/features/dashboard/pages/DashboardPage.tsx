import { Link } from 'react-router-dom';
import { useProducts } from '@/features/products/hooks/use-products';
import { IconBox, IconTag, IconPlus, IconSparkles, IconStar } from '@/components/Icons';
import { useAuth } from '@/hooks/use-auth';

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data } = useProducts({ per_page: 100 });
  const allProducts = data?.success ? data.data.products : [];
  const total = data?.success ? data.data.pagination.total : 0;
  const active = allProducts.filter((p) => p.is_active).length;
  const featured = allProducts.filter((p) => p.is_featured).length;
  const newArrivals = allProducts.filter((p) => p.is_new_arrival).length;

  const recent = [...allProducts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Page header */}
      <header>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user?.name}</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={total}
          icon={<IconBox className="w-5 h-5 text-indigo-600" />}
          color="bg-indigo-50"
        />
        <StatCard
          label="Active"
          value={active}
          icon={<IconTag className="w-5 h-5 text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          label="Featured"
          value={featured}
          icon={<IconStar className="w-5 h-5 text-amber-600" />}
          color="bg-amber-50"
        />
        <StatCard
          label="New Arrivals"
          value={newArrivals}
          icon={<IconSparkles className="w-5 h-5 text-purple-600" />}
          color="bg-purple-50"
        />
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-3">
        <Link
          to="/products/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <IconPlus className="w-4 h-4" />
          Add product
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <IconBox className="w-4 h-4" />
          View all products
        </Link>
      </div>

      {/* Recent products */}
      {recent.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent products</h2>
            <Link to="/products" className="text-xs text-indigo-600 hover:underline font-medium">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recent.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/products/${product.id}`}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-50 rounded-md flex items-center justify-center shrink-0">
                    <IconBox className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {product.is_featured && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                        Featured
                      </span>
                    )}
                    {product.is_new_arrival && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">
                        New
                      </span>
                    )}
                    <span className={`inline-flex text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
