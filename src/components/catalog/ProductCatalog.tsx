import React, { useState, useMemo } from 'react';
import { Search, Filter, Sliders, ArrowUpRight, Gauge, Zap } from 'lucide-react';
import type { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../lib/pricingEngine';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');

  const categories: ProductCategory[] = [
    'All',
    'Sports Coupe',
    'Electric GT',
    'Hypercar',
    'Performance SUV',
  ];

  // Memoized live search and filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Catalog Header */}
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>Product Lineup</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Explore The Fleet
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
          Select an automotive platform below to begin real-time 3D styling, wheel selection, and option configuration.
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model, speed, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            aria-label="Search models"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none" role="tablist">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block mr-1" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              role="tab"
              aria-selected={selectedCategory === category}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30"
            >
              {/* Product Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Category Badge */}
                <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider text-cyan-300 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-cyan-800/40">
                  {product.category}
                </span>

                {product.isFeatured && (
                  <span className="absolute top-3 right-3 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-amber-600/40">
                    Flagship
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {product.tagline}
                  </p>

                  {/* Micro Specs */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                    <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-950/50 border border-slate-800/60">
                      <Gauge className="w-3 h-3 text-cyan-400" />
                      <span>{product.specs.acceleration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-950/50 border border-slate-800/60">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span>{product.specs.horsepower}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">From</div>
                    <div className="text-base font-bold text-white font-mono">
                      {formatCurrency(product.basePrice)}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectProduct(product)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 bg-cyan-950/40 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-800/60 transition-all duration-200"
                  >
                    <span>Configure</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-8">
          <p className="text-base text-slate-300 font-medium">
            No automotive platforms match your criteria "{searchQuery}"
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search terms or clearing the category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
