import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { ProductImage } from './ProductImage';

export function CartDrawer() {
  const {
    items,
    promoCode,
    promoError,
    isDrawerOpen,
    totals,
    removeItem,
    updateQuantity,
    applyPromoCode,
    removePromoCode,
    clearCart,
    toggleDrawer,
  } = useCart();
  const { language, isRTL, t, localize } = useLanguage();
  const navigate = useNavigate();

  // Ephemeral promo input field stays local
  const [promoInput, setPromoInput] = useState('');

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toggleDrawer(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen, toggleDrawer]);

  const handlePromoSubmit = (event: FormEvent) => {
    event.preventDefault();
    applyPromoCode(promoInput);
  };

  const handleProceedToCheckout = () => {
    toggleDrawer(false);
    navigate('/checkout');
  };

  const progressPercentage = Math.min(
    100,
    Math.round(
      ((totals.freeShippingThresholdUSD - totals.remainingForFreeShippingUSD) /
        totals.freeShippingThresholdUSD) *
        100
    )
  );

  const closedTranslateClass = isRTL ? '-translate-x-full' : 'translate-x-full';
  const DirectionalArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isDrawerOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
      }`}
      aria-hidden={!isDrawerOpen}
    >
      {/* Backdrop */}
      <div
        onClick={() => toggleDrawer(false)}
        className={`fixed inset-0 bg-[#141413]/45 backdrop-blur-xs transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Slide-over Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t.cart.title}
        className={`fixed inset-y-0 end-0 flex w-full max-w-md flex-col bg-[#FAF8F5] shadow-2xl transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-x-0' : closedTranslateClass
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7E2D8] px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#B48A4E]" />
            <h2 className="font-editorial text-xl font-semibold text-[#141413]">
              {t.cart.title}
            </h2>
            {totals.itemCount > 0 && (
              <span className="rounded-full bg-[#F2EDE4] px-2.5 py-0.5 text-xs font-semibold text-[#141413]/80">
                {formatNumber(totals.itemCount, language)}{' '}
                {totals.itemCount === 1 ? t.cart.itemCountSingular : t.cart.itemCountPlural}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => toggleDrawer(false)}
            aria-label={t.shop.closeModal}
            className="rounded-full p-2 text-[#141413]/60 transition-colors hover:bg-[#F2EDE4] hover:text-[#141413] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        {items.length > 0 && (
          <div className="border-b border-[#E7E2D8] bg-[#F2EDE4]/60 px-6 py-3">
            <p className="text-xs font-medium text-[#141413]/80">
              {totals.remainingForFreeShippingUSD === 0
                ? t.cart.freeShippingUnlocked
                : t.cart.freeShippingProgress.replace(
                    '{amount}',
                    formatCurrency(totals.remainingForFreeShippingUSD, language)
                  )}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E7E2D8]">
              <div
                className="h-full rounded-full bg-[#B48A4E] transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F2EDE4] text-[#B48A4E]">
                <ShoppingBag className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h3 className="font-editorial mt-4 text-xl font-semibold text-[#141413]">
                {t.cart.emptyTitle}
              </h3>
              <p className="mt-2 max-w-xs text-sm text-[#141413]/65">
                {t.cart.emptySubtitle}
              </p>
              <button
                type="button"
                onClick={() => {
                  toggleDrawer(false);
                  navigate('/');
                }}
                className="mt-6 rounded-full bg-[#141413] px-6 py-2.5 text-sm font-semibold text-[#FAF8F5] transition-colors hover:bg-[#2B2A28] cursor-pointer"
              >
                {t.cart.continueShopping}
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.cartKey}
                  className="flex gap-4 rounded-2xl border border-[#E7E2D8] bg-white p-3.5 shadow-2xs"
                >
                  <ProductImage
                    src={item.image}
                    alt={localize(item.title)}
                    palette={item.accentPalette}
                    className="h-22 w-20 shrink-0 rounded-xl object-cover"
                  />

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="truncate text-sm font-semibold text-[#141413]">
                          {localize(item.title)}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#141413]/60">
                          <span className="inline-flex items-center gap-1">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full border border-black/15"
                              style={{ backgroundColor: item.color.hex }}
                            />
                            {localize(item.color.label)}
                          </span>
                          <span>·</span>
                          <span>{localize(item.size.label)}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.cartKey)}
                        aria-label={`${t.cart.remove} ${localize(item.title)}`}
                        className="rounded-lg p-1 text-[#141413]/45 transition-colors hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-[#E7E2D8] bg-[#FAF8F5] p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[#141413]/70 transition-colors hover:bg-white cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[1.75rem] text-center text-xs font-semibold text-[#141413]">
                          {formatNumber(item.quantity, language)}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[#141413]/70 transition-colors hover:bg-white cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#141413]">
                        {formatCurrency(item.unitPriceUSD * item.quantity, language)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Totals & Actions */}
        {items.length > 0 && (
          <div className="border-t border-[#E7E2D8] bg-white px-6 py-5">
            {/* Promo Code Form */}
            <form onSubmit={handlePromoSubmit} className="mb-4">
              <label
                htmlFor="drawer-promo-input"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#141413]/75"
              >
                <Tag className="h-3.5 w-3.5 text-[#B48A4E]" />
                <span>{t.cart.promoLabel}</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="drawer-promo-input"
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder={t.cart.promoPlaceholder}
                  className="flex-1 rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3 py-2 text-xs text-[#141413] placeholder:text-[#141413]/40 focus:border-[#B48A4E] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl border border-[#141413] px-3.5 py-2 text-xs font-semibold text-[#141413] transition-colors hover:bg-[#141413] hover:text-white cursor-pointer"
                >
                  {t.cart.applyPromo}
                </button>
              </div>
              {promoError === 'INVALID_CODE' && (
                <p className="mt-1.5 text-xs text-rose-600">{t.cart.promoInvalid}</p>
              )}
              {promoError === 'MIN_SUBTOTAL_NOT_MET' && (
                <p className="mt-1.5 text-xs text-amber-700">{t.cart.promoMinNotMet}</p>
              )}
              {promoCode && (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-[#B48A4E]/10 px-3 py-1.5 text-xs">
                  <span className="font-medium text-[#936E38]">
                    {promoCode.code} · {localize(promoCode.label)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      removePromoCode();
                      setPromoInput('');
                    }}
                    className="font-semibold text-[#141413]/70 underline hover:text-[#141413] cursor-pointer"
                  >
                    {t.cart.removePromo}
                  </button>
                </div>
              )}
              {!promoCode && !promoError && (
                <p className="mt-1.5 text-[11px] text-[#141413]/50">{t.cart.promoHint}</p>
              )}
            </form>

            {/* Totals Breakdown */}
            <dl className="space-y-1.5 border-t border-[#E7E2D8] pt-3 text-xs">
              <div className="flex justify-between text-[#141413]/75">
                <dt>{t.cart.subtotal}</dt>
                <dd>{formatCurrency(totals.subtotalUSD, language)}</dd>
              </div>
              {totals.discountUSD > 0 && (
                <div className="flex justify-between font-medium text-emerald-700">
                  <dt>{t.cart.discount}</dt>
                  <dd>-{formatCurrency(totals.discountUSD, language)}</dd>
                </div>
              )}
              <div className="flex justify-between text-[#141413]/75">
                <dt>{t.cart.shipping}</dt>
                <dd>
                  {totals.shippingUSD === 0
                    ? t.cart.freeShipping
                    : formatCurrency(totals.shippingUSD, language)}
                </dd>
              </div>
              <div className="flex justify-between text-[#141413]/75">
                <dt>{t.cart.tax}</dt>
                <dd>{formatCurrency(totals.taxUSD, language)}</dd>
              </div>
              <div className="flex justify-between border-t border-[#E7E2D8] pt-2 text-base font-bold text-[#141413]">
                <dt>{t.cart.total}</dt>
                <dd>{formatCurrency(totals.totalUSD, language)}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#141413] px-5 py-3 text-sm font-semibold text-[#FAF8F5] shadow-md transition-all hover:bg-[#292826] active:scale-[0.99] cursor-pointer"
              >
                <span>{t.cart.proceedToCheckout}</span>
                <DirectionalArrow className="h-4 w-4 text-[#C59B5F]" />
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="w-full py-1.5 text-center text-xs font-medium text-[#141413]/55 transition-colors hover:text-rose-700 cursor-pointer"
              >
                {t.cart.clearCart}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
