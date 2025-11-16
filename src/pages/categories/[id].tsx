import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import DesktopNavbar from '@/components/topnav';
import Footer from '@/components/footer';
import ProductCard from '@/components/productcard';
import { useRouter } from 'next/router';

type Product = {
  id: number;
  sku?: string;
  name: string;
  slog?: string;
  description?: string | null;
  price: number;
  currency?: string;
  images?: string[] | null;
  thumbnail?: string | null;
  available_sizes?: string[] | null;
  stock?: Record<string, number> | null;
  category?: string | null;
  brand?: string | null;
  metadata?: Record<string, any> | null;
  is_active: boolean;
  created_at?: string;
};

type Props = {
  initialProducts: Product[];
  totalCount: number;
  category: string;
};

const ITEMS_PER_PAGE = 12;

const CategoryPage = ({ initialProducts, totalCount, category }: Props) => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages) return;

    setIsLoading(true);
    const offset = (page - 1) * ITEMS_PER_PAGE;

    try {
      const res = await fetch(
        `/api/categories/${encodeURIComponent(category)}/products?limit=${ITEMS_PER_PAGE}&offset=${offset}`
      );

      if (!res.ok) throw new Error('Failed to fetch products');

      const data = await res.json();
      setProducts(data.products ?? []);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DesktopNavbar />
      <div className="min-h-screen bg-white font-['Urbanist'] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">{category}</h1>
            <p className="text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} products
            </p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="cursor-pointer"
                  >
                    <ProductCard
                      pid={String(product.id)}
                      name={product.name}
                      price={product.price}
                      images={product.images ?? (product.thumbnail ? [product.thumbnail] : [])}
                      description={product.description ?? undefined}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-black transition"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={isLoading}
                      className={`px-3 py-2 rounded-lg transition ${
                        page === currentPage
                          ? 'bg-black text-white'
                          : 'border border-gray-300 hover:border-black'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-black transition"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { params, req } = context;
  const id = params?.id;

  if (!id || Array.isArray(id)) {
    return { notFound: true };
  }

  const host = req.headers.host;
  const proto = (req.headers['x-forwarded-proto'] as string) || 'http';
  const base = host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  try {
    const res = await fetch(
      `${base}/api/categories/${encodeURIComponent(String(id))}/products?limit=${ITEMS_PER_PAGE}&offset=0`
    );

    if (!res.ok) {
      console.error('Category fetch failed');
      return { notFound: true };
    }

    const data = await res.json();

    return {
      props: {
        initialProducts: data.products ?? [],
        totalCount: data.count ?? 0,
        category: String(id),
      }
    };
  } catch (err) {
    console.error('getServerSideProps error for category:', err);
    return { notFound: true };
  }
};
