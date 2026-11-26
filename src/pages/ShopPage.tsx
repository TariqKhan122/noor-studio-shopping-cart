import { useMemo, useState } from 'react';
import { ArrowDown, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { PRODUCTS } from '../data/products';
import { useLanguage } from '../hooks/useLanguage';
import type { CategoryFilter, Product } from '../types';
import { formatNumber } from '../utils/formatters';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

const CATEGORY_FILTERS: CategoryFilter[] = ['all', 'tech', 'desk', 'home', 'craft'];

export function ShopPage() {
  const { language, t } = useLanguage();

  // Ephemeral UI state kept strictly local to ShopPage
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matched = PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableFields = [
        product.title.en,
        product.title.ur,
        product.subtitle.en,
        product.subtitle.ur,
        product.artisanOrigin.en,
        product.artisanOrigin.ur,
        t.categories[product.category],
      ];

      return searchableFields.some((field) => field.toLowerCase().includes(query));
    });

    const sorted = [...matched];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.priceUSD - b.priceUSD);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.priceUSD - a.priceUSD);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        break;
    }

    return sorted;
  }, [searchQuery, selectedCategory, sortBy, t.categories]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      {/* Editorial Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-[#E7E2D8] bg-[#141413] px-6 py-14 text-[#FAF8F5] shadow-xl sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full bg-[#B48A4E]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 start-12 h-72 w-72 rounded-full bg-[#B48A4E]/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B48A4E]/40 bg-[#B48A4E]/10 px-3.5 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#D7B377] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.hero.eyebrow}</span>
          </div>

          <h1 className="font-editorial mt-5 text-4xl font-semibold tracking-tight text-[#FAF8F5] sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#FAF8F5]/75 sm:text-base">
            {t.hero.subtitle}
          </p>

          <a
            href="#collection-grid"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#B48A4E] px-6 py-3 text-sm font-semibold text-[#141413] transition-all hover:bg-[#C89F62] active:scale-[0.99]"
          >
            <span>{t.hero.exploreCta}</span>
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <section id="collection-grid" className="mt-12 space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Product categories">
            {CATEGORY_FILTERS.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#141413] text-[#FAF8F5] shadow-xs'
                      : 'border border-[#E7E2D8] bg-white text-[#141413]/75 hover:border-[#B48A4E] hover:text-[#141413]'
                  }`}
                >
                  {t.categories[category]}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#141413]/45" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.shop.searchPlaceholder}
                aria-label={t.shop.searchPlaceholder}
                className="w-full rounded-full border border-[#E7E2D8] bg-white py-2 ps-10 pe-4 text-xs text-[#141413] placeholder:text-[#141413]/45 focus:border-[#B48A4E] focus:outline-none"
              />
            </div>

            <div className="relative flex items-center">
              <SlidersHorizontal className="pointer-events-none absolute start-3.5 h-3.5 w-3.5 text-[#B48A4E]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort products"
                className="appearance-none rounded-full border border-[#E7E2D8] bg-white py-2 ps-9 pe-8 text-xs font-medium text-[#141413] focus:border-[#B48A4E] focus:outline-none cursor-pointer"
              >
                <option value="featured">{t.shop.sortFeatured}</option>
                <option value="price-asc">{t.shop.sortPriceAsc}</option>
                <option value="price-desc">{t.shop.sortPriceDesc}</option>
                <option value="rating">{t.shop.sortRating}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Meta */}
        <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3 text-xs text-[#141413]/60">
          <span>
            {formatNumber(filteredProducts.length, language)} {t.shop.resultsCount}
          </span>
          {(searchQuery || selectedCategory !== 'all' || sortBy !== 'featured') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="font-semibold text-[#936E38] underline hover:text-[#141413] cursor-pointer"
            >
              {t.shop.resetFilters}
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D6CFC2] bg-white/60 px-6 py-16 text-center">
            <h2 className="font-editorial text-2xl font-semibold text-[#141413]">
              {t.shop.noResultsTitle}
            </h2>
            <p className="mt-2 text-sm text-[#141413]/65">{t.shop.noResultsSubtitle}</p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 rounded-full bg-[#141413] px-6 py-2.5 text-xs font-semibold text-[#FAF8F5] hover:bg-[#B48A4E] cursor-pointer"
            >
              {t.shop.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onInspect={(selected) => setInspectedProduct(selected)}
              />
            ))}
          </div>
        )}
      </section>

      <ProductModal
        product={inspectedProduct}
        onClose={() => setInspectedProduct(null)}
      />
    </main>
  );
}
