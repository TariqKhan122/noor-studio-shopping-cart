import { useEffect, useState } from 'react';
import { Check, MapPin, Minus, Plus, Star, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import type { Product } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { ProductImage } from './ProductImage';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem, toggleDrawer } = useCart();
  const { language, t, localize } = useLanguage();

  // Ephemeral gallery & variant UI state kept local
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setColorIndex(0);
    setSizeIndex(0);
    setQuantity(1);
    setAddedFeedback(false);
  }, [product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) {
    return null;
  }

  const selectedColor = product.colors[colorIndex] ?? product.colors[0];
  const selectedSize = product.sizes[sizeIndex] ?? product.sizes[0];
  const unitPrice = product.priceUSD + selectedSize.priceDeltaUSD;

  const handleAddAndOpenBag = () => {
    addItem(product, selectedColor, selectedSize, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => {
      onClose();
      toggleDrawer(true);
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={localize(product.title)}
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#141413]/55 backdrop-blur-xs"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#E7E2D8] bg-[#FAF8F5] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.shop.closeModal}
          className="absolute end-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#141413] shadow-sm transition-colors hover:bg-[#141413] hover:text-white cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="bg-[#F2EDE4] p-6">
            <div className="aspect-square overflow-hidden rounded-2xl bg-white">
              <ProductImage
                src={product.images[activeImageIndex] ?? product.images[0] ?? ''}
                alt={localize(product.title)}
                palette={product.accentPalette}
                className="h-full w-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={imgUrl}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                      idx === activeImageIndex
                        ? 'border-[#B48A4E] shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ProductImage
                      src={imgUrl}
                      alt={`${localize(product.title)} ${idx + 1}`}
                      palette={product.accentPalette}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2 text-xs text-[#141413]/65">
              <span className="font-semibold tracking-wider text-[#936E38] uppercase">
                {t.categories[product.category]}
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-[#141413]">
                <Star className="h-3.5 w-3.5 fill-[#B48A4E] text-[#B48A4E]" />
                {formatNumber(product.rating, language)} · {formatNumber(product.reviewCount, language)}
              </span>
            </div>

            <h2 className="font-editorial mt-2 text-3xl font-semibold text-[#141413]">
              {localize(product.title)}
            </h2>

            <p className="mt-2 text-xl font-bold text-[#141413]">
              {formatCurrency(unitPrice, language)}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-[#141413]/75">
              {localize(product.description)}
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#141413]/65">
              <MapPin className="h-3.5 w-3.5 text-[#B48A4E]" />
              <span>
                {t.shop.originLabel}: <strong className="text-[#141413]">{localize(product.artisanOrigin)}</strong>
              </span>
            </div>

            {/* Variants */}
            <div className="mt-6 space-y-4 border-t border-[#E7E2D8] pt-5">
              <div>
                <span className="block text-xs font-semibold text-[#141413]">
                  {t.shop.selectColor}:{' '}
                  <span className="font-normal text-[#141413]/70">{localize(selectedColor.label)}</span>
                </span>
                <div className="mt-2 flex gap-2.5">
                  {product.colors.map((color, idx) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setColorIndex(idx)}
                      aria-label={localize(color.label)}
                      className={`h-7 w-7 rounded-full border transition-transform cursor-pointer ${
                        idx === colorIndex
                          ? 'scale-110 border-[#141413] ring-2 ring-[#B48A4E] ring-offset-2'
                          : 'border-black/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#141413]">
                  {t.shop.selectSize}
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((size, idx) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSizeIndex(idx)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                        idx === sizeIndex
                          ? 'border-[#141413] bg-[#141413] text-[#FAF8F5]'
                          : 'border-[#E7E2D8] bg-white text-[#141413]/80 hover:border-[#B48A4E]'
                      }`}
                    >
                      {localize(size.label)}
                      {size.priceDeltaUSD > 0 && ` (+${formatCurrency(size.priceDeltaUSD, language)})`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="mt-6 rounded-2xl border border-[#E7E2D8] bg-white p-4">
              <h3 className="text-xs font-semibold tracking-wide text-[#141413]/60 uppercase">
                {t.shop.specifications}
              </h3>
              <dl className="mt-2.5 space-y-2 text-xs">
                {product.specs.map((spec) => (
                  <div key={spec.label.en} className="flex justify-between gap-4">
                    <dt className="text-[#141413]/60">{localize(spec.label)}</dt>
                    <dd className="font-medium text-[#141413] text-end">{localize(spec.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Quantity & Add CTA */}
            <div className="mt-6 flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-[#E7E2D8] bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#141413] hover:bg-[#F2EDE4] cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[2.25rem] text-center text-sm font-semibold">
                  {formatNumber(quantity, language)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#141413] hover:bg-[#F2EDE4] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddAndOpenBag}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors cursor-pointer ${
                  addedFeedback ? 'bg-emerald-700' : 'bg-[#141413] hover:bg-[#B48A4E]'
                }`}
              >
                {addedFeedback ? <Check className="h-4 w-4" /> : null}
                <span>
                  {addedFeedback ? t.shop.addedToCart : t.shop.addToCart} ·{' '}
                  {formatCurrency(unitPrice * quantity, language)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
