'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Filter, ShoppingBag, Zap } from 'lucide-react';
import { BRANDS, getProducts, Product } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

export default function CategoryPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [loading, setLoading] = useState(true);

  const brand = BRANDS.find(b => b.id === brandId);

  useEffect(() => {
    const all = getProducts();
    const filtered = all.filter(p => p.brand.toLowerCase() === (brand?.name.toLowerCase() || ''));
    setProducts(filtered);
    setLoading(false);
  }, [brand]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl text-white font-bold mb-2">Brand Not Found</h2>
          <Link href="/" className="text-primary hover:underline">← Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-dark">
      <Navbar />

      {/* Brand Hero */}
      <section
        className="pt-28 pb-16 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${brand.color}22 0%, #0A0A0A 60%)` }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(${brand.color}88 1px, transparent 1px), linear-gradient(90deg, ${brand.color}88 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
          style={{ background: `${brand.color}15` }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm font-semibold tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-5 mb-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl"
              style={{ background: `${brand.color}22`, border: `2px solid ${brand.color}44` }}
            >
              {brand.logo}
            </div>
            <div>
              <h1
                className="text-6xl md:text-7xl text-white"
                style={{ fontFamily: 'Bebas Neue, serif', letterSpacing: '0.03em' }}
              >
                {brand.name}
              </h1>
              <p className="text-gray-400 text-lg mt-1">{brand.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase"
              style={{ background: `${brand.color}22`, border: `1px solid ${brand.color}44`, color: brand.color }}
            >
              {products.length} Products In Stock
            </span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-40 bg-dark/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search batteries..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-dark-3 border border-white/10 focus:border-primary/50 text-white rounded-xl text-sm outline-none transition-colors font-medium"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            <Filter className="w-4 h-4 text-gray-500 shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all ${
                  filterCat === cat
                    ? 'bg-primary text-white'
                    : 'bg-dark-3 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="shimmer h-48 w-full" />
                <div className="p-4 space-y-2">
                  <div className="shimmer h-4 w-3/4 rounded" />
                  <div className="shimmer h-3 w-1/2 rounded" />
                  <div className="shimmer h-6 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl text-gray-500 font-bold mb-2">No products found</h3>
            <p className="text-gray-600">
              {products.length === 0
                ? 'No products added yet. Check back soon!'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, idx) => (
              <ProductCard key={product.id} product={product} delay={idx} brandColor={brand.color} />
            ))}
          </div>
        )}
      </section>

      <Footer />
      <FloatingButtons />
    </main>
  );
}

function ProductCard({ product, delay, brandColor }: { product: Product; delay: number; brandColor: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="product-card rounded-2xl overflow-hidden group"
      style={{ animationDelay: `${delay * 0.05}s`, animation: 'fadeUp 0.5s ease-out both' }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-dark-3">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="img-placeholder h-full">
            <Zap className="w-16 h-16 opacity-20" />
          </div>
        )}

        {/* Stock badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
          product.inStock ? 'badge-instock' : 'badge-outstock'
        }`}>
          {product.inStock ? '● In Stock' : '● Out of Stock'}
        </div>

        {/* Category tag */}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-semibold bg-black/60 text-gray-300 backdrop-blur-sm">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Warranty */}
        <div className="badge-warranty inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold mb-3">
          🛡️ {product.warranty} Warranty
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-2xl font-bold text-gradient-red"
              style={{ fontFamily: 'Bebas Neue, serif', letterSpacing: '0.03em' }}
            >
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>
          <a
            href="tel:+918513908681"
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all hover:scale-105 ${
              product.inStock
                ? 'bg-primary hover:bg-primary-dark text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none'
            }`}
          >
            {product.inStock ? 'Enquire' : 'Unavailable'}
          </a>
        </div>
      </div>
    </div>
  );
}
