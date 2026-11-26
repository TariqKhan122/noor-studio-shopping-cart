import { useEffect, useState } from 'react';
import { Check, Eye, Plus, Star } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import type { Product } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  onInspect: (product: Product) => void;
}

export function ProductCard({ product, onInspect }: ProductCardProps) {
  const { addItem } = useCart();
  const { language, t, localize } = useLanguage();

  // Ephemeral UI selection & micro-interaction state kept local
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const selectedColor = product.colors[selectedColorIndex] ?? product.colors[0];
  const selectedSize = product.sizes[selectedSizeIndex] ?? product.sizes[0];
  const activePrice = product.priceUSD + selectedSize.priceDeltaUSD;

  useEffect(() => {
    if (!justAdded) {
      return;
    }
    const timer = window.setTimeout(() => setJustAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  const handleQuickAdd = () => {
    addItem(product, selectedColor, selectedSize, 1);
    setJustAdded(true);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-[#E7E2D8] bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#B48A4E]/50 hover:shadow-lg">
      {/* Image Stage */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EDE4]">
        <ProductImage
          src={product.images[0] ?? ''}
          alt={localize(product.title)}
          palette={product.accentPalette}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {product.badge && (
          <span className="absolute start-3.5 top-3.5 rounded-full bg-[#141413]/85 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#FAF8F5] backdrop-blur-xs">
            {localize(product.badge)}
          </span>
        )}

        <button
          type="button"
          onClick={() => onInspect(product)}
          aria-label={`${t.shop.quickView}: ${localize(product.title)}`}
          className="absolute end-3.5 bottom-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#141413] opacity-95 shadow-md backdrop-blur-xs transition-all hover:bg-[#141413] hover:text-white sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>{t.shop.quickView}</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-[#141413]/60">
          <span>{t.categories[product.category]}</span>
          <span className="inline-flex items-center gap-1 font-medium text-[#141413]/80">
            <Star className="h-3.5 w-3.5 fill-[#B48A4E] text-[#B48A4E]" />
            {formatNumber(product.rating, language)} ({formatNumber(product.reviewCount, language)})
          </span>
        </div>

        <button
          type="button"
          onClick={() => onInspect(product)}
          className="mt-2 text-start focus:outline-none cursor-pointer"
        >
          <h3 className="font-editorial text-xl font-semibold text-[#141413] transition-colors group-hover:text-[#936E38]">
            {localize(product.title)}
          </h3>
        </button>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#141413]/65">
          {localize(product.subtitle)}
        </p>

        {/* Variant Pickers */}
        <div className="mt-4 space-y-2.5 border-t border-[#E7E2D8]/80 pt-3.5">
          {/* Colors */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-[#141413]/60">
              {localize(selectedColor.label)}
            </span>
            <div className="flex items-center gap-1.5">
              {product.colors.map((color, idx) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColorIndex(idx)}
                  title={localize(color.label)}
                  aria-label={localize(color.label)}
                  className={`h-5 w-5 rounded-full border transition-transform cursor-pointer ${
                    idx === selectedColorIndex
                      ? 'scale-110 border-[#141413] ring-2 ring-[#B48A4E]/45 ring-offset-1'
                      : 'border-black/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size, idx) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setSelectedSizeIndex(idx)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                  idx === selectedSizeIndex
                    ? 'bg-[#141413] text-[#FAF8F5]'
                    : 'bg-[#F2EDE4] text-[#141413]/75 hover:bg-[#E7E2D8]'
                }`}
              >
                {localize(size.label)}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div>
            <span className="text-lg font-bold text-[#141413]">
              {formatCurrency(activePrice, language)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#141413] text-[#FAF8F5] hover:bg-[#B48A4E]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>{t.shop.addedToCart}</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>{t.shop.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
