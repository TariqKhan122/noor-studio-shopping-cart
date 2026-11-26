import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Truck,
  Wallet,
} from 'lucide-react';
import { ProductImage } from '../components/ProductImage';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import type { OrderRecord, PaymentMethod, ShippingAddress } from '../types';
import { formatCurrency, formatNumber, formatOrderDate } from '../utils/formatters';

interface CheckoutFieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}

export function CheckoutPage() {
  const { user, recordOrder } = useAuth();
  const {
    items,
    promoCode,
    promoError,
    totals,
    applyPromoCode,
    removePromoCode,
    clearCart,
  } = useCart();
  const { language, t, localize } = useLanguage();

  // Ephemeral checkout UI state kept local
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: user?.name ?? '',
    email: user?.email ?? '',
    phone: '+92 300 5550192',
    streetAddress: '42 Gulberg Boulevard, Studio Wing',
    city: user?.city ?? 'Lahore',
    postalCode: '54660',
    country: 'Pakistan',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvc, setCardCvc] = useState('842');
  const [promoInput, setPromoInput] = useState('');
  const [errors, setErrors] = useState<CheckoutFieldErrors>({});
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  const updateShippingField = <K extends keyof ShippingAddress>(
    field: K,
    value: ShippingAddress[K]
  ) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateCheckout = (): boolean => {
    const nextErrors: CheckoutFieldErrors = {};

    if (!shipping.fullName.trim()) nextErrors.fullName = t.checkout.requiredField;
    if (!shipping.email.trim()) {
      nextErrors.email = t.checkout.requiredField;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email.trim())) {
      nextErrors.email = t.auth.emailInvalid;
    }

    const digitsOnlyPhone = shipping.phone.replace(/\D/g, '');
    if (!shipping.phone.trim()) {
      nextErrors.phone = t.checkout.requiredField;
    } else if (digitsOnlyPhone.length < 7) {
      nextErrors.phone = t.checkout.invalidPhone;
    }

    if (!shipping.streetAddress.trim()) nextErrors.streetAddress = t.checkout.requiredField;
    if (!shipping.city.trim()) nextErrors.city = t.checkout.requiredField;
    if (!shipping.postalCode.trim()) nextErrors.postalCode = t.checkout.requiredField;
    if (!shipping.country.trim()) nextErrors.country = t.checkout.requiredField;

    if (paymentMethod === 'card') {
      const digitsOnlyCard = cardNumber.replace(/\D/g, '');
      if (digitsOnlyCard.length < 16) {
        nextErrors.cardNumber = t.checkout.invalidCard;
      }
      if (!cardExpiry.trim()) nextErrors.cardExpiry = t.checkout.requiredField;
      if (!cardCvc.trim() || cardCvc.trim().length < 3) {
        nextErrors.cardCvc = t.checkout.requiredField;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = (event: FormEvent) => {
    event.preventDefault();
    if (items.length === 0 || !validateCheckout()) {
      return;
    }

    const newOrder: OrderRecord = {
      id: `NR-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      items: items.map((item) => ({ ...item })),
      subtotalUSD: totals.subtotalUSD,
      discountUSD: totals.discountUSD,
      shippingUSD: totals.shippingUSD,
      taxUSD: totals.taxUSD,
      totalUSD: totals.totalUSD,
      promoCodeUsed: promoCode ? promoCode.code : null,
      shippingAddress: { ...shipping },
      paymentMethod,
      status: 'confirmed',
    };

    recordOrder(newOrder);
    clearCart();
    setCompletedOrder(newOrder);
  };

  const paymentMethodLabels: Record<PaymentMethod, string> = {
    card: t.checkout.paymentCard,
    cod: t.checkout.paymentCod,
    wallet: t.checkout.paymentWallet,
  };

  // Interactive Order Receipt View
  if (completedOrder) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-[2rem] border border-[#E7E2D8] bg-white p-7 shadow-xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h1 className="font-editorial mt-4 text-3xl font-semibold text-[#141413] sm:text-4xl">
              {t.checkout.receiptTitle}
            </h1>
            <p className="mt-2 max-w-md text-sm text-[#141413]/70">
              {t.checkout.receiptSubtitle}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-[#E7E2D8] bg-[#FAF8F5] p-5 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold text-[#141413]/55 uppercase">
                {t.checkout.orderNumber}
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-[#141413]">
                {completedOrder.id}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#141413]/55 uppercase">
                {t.checkout.orderDate}
              </p>
              <p className="mt-1 text-sm font-medium text-[#141413]">
                {formatOrderDate(completedOrder.createdAt, language)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#141413]/55 uppercase">
                {t.checkout.paymentMethodLabel}
              </p>
              <p className="mt-1 text-sm font-medium text-[#141413]">
                {paymentMethodLabels[completedOrder.paymentMethod]}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#E7E2D8] p-5">
            <div className="flex items-start gap-2.5 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B48A4E]" />
              <div>
                <p className="text-xs font-semibold text-[#141413]/60 uppercase">
                  {t.checkout.shippingTo}
                </p>
                <p className="mt-1 font-semibold text-[#141413]">
                  {completedOrder.shippingAddress.fullName}
                </p>
                <p className="text-[#141413]/75">
                  {completedOrder.shippingAddress.streetAddress},{' '}
                  {completedOrder.shippingAddress.city}{' '}
                  {completedOrder.shippingAddress.postalCode},{' '}
                  {completedOrder.shippingAddress.country}
                </p>
                <p className="text-xs text-[#141413]/60">
                  {completedOrder.shippingAddress.email} · {completedOrder.shippingAddress.phone}
                </p>
              </div>
            </div>
          </div>

          <ul className="mt-6 divide-y divide-[#E7E2D8] border-t border-b border-[#E7E2D8]">
            {completedOrder.items.map((item) => (
              <li key={item.cartKey} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3.5">
                  <ProductImage
                    src={item.image}
                    alt={localize(item.title)}
                    palette={item.accentPalette}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#141413]">
                      {localize(item.title)}
                    </p>
                    <p className="text-xs text-[#141413]/60">
                      {localize(item.color.label)} · {localize(item.size.label)} ×{' '}
                      {formatNumber(item.quantity, language)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#141413]">
                  {formatCurrency(item.unitPriceUSD * item.quantity, language)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between text-[#141413]/75">
              <dt>{t.cart.subtotal}</dt>
              <dd>{formatCurrency(completedOrder.subtotalUSD, language)}</dd>
            </div>
            {completedOrder.discountUSD > 0 && (
              <div className="flex justify-between text-emerald-700">
                <dt>
                  {t.cart.discount}{' '}
                  {completedOrder.promoCodeUsed ? `(${completedOrder.promoCodeUsed})` : ''}
                </dt>
                <dd>-{formatCurrency(completedOrder.discountUSD, language)}</dd>
              </div>
            )}
            <div className="flex justify-between text-[#141413]/75">
              <dt>{t.cart.shipping}</dt>
              <dd>
                {completedOrder.shippingUSD === 0
                  ? t.cart.freeShipping
                  : formatCurrency(completedOrder.shippingUSD, language)}
              </dd>
            </div>
            <div className="flex justify-between text-[#141413]/75">
              <dt>{t.cart.tax}</dt>
              <dd>{formatCurrency(completedOrder.taxUSD, language)}</dd>
            </div>
            <div className="flex justify-between border-t border-[#E7E2D8] pt-3 text-base font-bold text-[#141413]">
              <dt>{t.cart.total}</dt>
              <dd>{formatCurrency(completedOrder.totalUSD, language)}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/orders"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#141413] px-6 py-3 text-sm font-semibold text-[#FAF8F5] transition-colors hover:bg-[#292826]"
            >
              <PackageCheck className="h-4 w-4 text-[#C59B5F]" />
              <span>{t.checkout.viewOrders}</span>
            </Link>
            <Link
              to="/"
              className="flex flex-1 items-center justify-center rounded-full border border-[#E7E2D8] bg-[#FAF8F5] px-6 py-3 text-sm font-semibold text-[#141413] transition-colors hover:border-[#141413]"
            >
              {t.checkout.continueShopping}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Empty Cart Guard
  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="rounded-[2rem] border border-[#E7E2D8] bg-white p-10 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2EDE4] text-[#B48A4E]">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="font-editorial mt-5 text-3xl font-semibold text-[#141413]">
            {t.checkout.emptyCartTitle}
          </h1>
          <p className="mt-2 text-sm text-[#141413]/65">{t.checkout.emptyCartSubtitle}</p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-[#141413] px-7 py-3 text-sm font-semibold text-[#FAF8F5] hover:bg-[#B48A4E]"
          >
            {t.checkout.backToShop}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-editorial text-3xl font-semibold text-[#141413] sm:text-4xl">
          {t.checkout.title}
        </h1>
        <p className="mt-1.5 text-sm text-[#141413]/65">{t.checkout.subtitle}</p>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        noValidate
        className="grid grid-cols-1 gap-8 lg:grid-cols-12"
      >
        {/* Left: Shipping & Payment */}
        <div className="space-y-6 lg:col-span-7">
          {/* Shipping Address */}
          <section className="rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-2xs sm:p-8">
            <h2 className="font-editorial text-2xl font-semibold text-[#141413]">
              {t.checkout.shippingHeading}
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#141413]">
                  {t.checkout.fullName}
                </label>
                <input
                  type="text"
                  value={shipping.fullName}
                  onChange={(e) => updateShippingField('fullName', e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-sm focus:outline-none ${
                    errors.fullName ? 'border-rose-500' : 'border-[#E7E2D8] focus:border-[#B48A4E]'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141413]">
                  {t.checkout.email}
                </label>
                <input
                  type="email"
                  value={shipping.email}
                  onChange={(e) => updateShippingField('email', e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-sm focus:outline-none ${
                    errors.email ? 'border-rose-500' : 'border-[#E7E2D8] focus:border-[#B48A4E]'
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141413]">
                  {t.checkout.phone}
                </label>
                <input
                  type="tel"
                  value={shipping.phone}
                  onChange={(e) => updateShippingField('phone', e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-sm focus:outline-none ${
                    errors.phone ? 'border-rose-500' : 'border-[#E7E2D8] focus:border-[#B48A4E]'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#141413]">
                  {t.checkout.streetAddress}
                </label>
                <input
                  type="text"
                  value={shipping.streetAddress}
                  onChange={(e) => updateShippingField('streetAddress', e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-sm focus:outline-none ${
                    errors.streetAddress
                      ? 'border-rose-500'
                      : 'border-[#E7E2D8] focus:border-[#B48A4E]'
                  }`}
                />
                {errors.streetAddress && (
                  <p className="mt-1 text-xs text-rose-600">{errors.streetAddress}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141413]">
                  {t.checkout.city}
                </label>
                <input
                  type="text"
                  value={shipping.city}
                  onChange={(e) => updateShippingField('city', e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-sm focus:outline-none ${
                    errors.city ? 'border-rose-500' : 'border-[#E7E2D8] focus:border-[#B48A4E]'
                  }`}
                />
                {errors.city && <p className="mt-1 text-xs text-rose-600">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141413]">
                  {t.checkout.postalCode}
                </label>
                <input
                  type="text"
                  value={shipping.postalCode}
                  onChange={(e) => updateShippingField('postalCode', e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-sm focus:outline-none ${
                    errors.postalCode
                      ? 'border-rose-500'
                      : 'border-[#E7E2D8] focus:border-[#B48A4E]'
                  }`}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-xs text-rose-600">{errors.postalCode}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#141413]">
                  {t.checkout.country}
                </label>
                <input
                  type="text"
                  value={shipping.country}
                  onChange={(e) => updateShippingField('country', e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-sm focus:outline-none ${
                    errors.country ? 'border-rose-500' : 'border-[#E7E2D8] focus:border-[#B48A4E]'
                  }`}
                />
                {errors.country && <p className="mt-1 text-xs text-rose-600">{errors.country}</p>}
              </div>
            </div>
          </section>

          {/* Payment Selector */}
          <section className="rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-2xs sm:p-8">
            <h2 className="font-editorial text-2xl font-semibold text-[#141413]">
              {t.checkout.paymentHeading}
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  id: 'card' as const,
                  title: t.checkout.paymentCard,
                  desc: t.checkout.paymentCardDesc,
                  Icon: CreditCard,
                },
                {
                  id: 'cod' as const,
                  title: t.checkout.paymentCod,
                  desc: t.checkout.paymentCodDesc,
                  Icon: Truck,
                },
                {
                  id: 'wallet' as const,
                  title: t.checkout.paymentWallet,
                  desc: t.checkout.paymentWalletDesc,
                  Icon: Wallet,
                },
              ].map(({ id, title, desc, Icon }) => {
                const isSelected = paymentMethod === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className={`flex flex-col items-start rounded-2xl border p-4 text-start transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#141413] bg-[#FAF8F5] ring-1 ring-[#B48A4E]'
                        : 'border-[#E7E2D8] bg-white hover:border-[#B48A4E]/60'
                    }`}
                  >
                    <Icon className="h-5 w-5 text-[#B48A4E]" />
                    <span className="mt-2.5 text-sm font-semibold text-[#141413]">{title}</span>
                    <span className="mt-1 text-[11px] text-[#141413]/60">{desc}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#E7E2D8] pt-5 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#141413]">
                    {t.checkout.cardNumber}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(e.target.value);
                      if (errors.cardNumber) {
                        setErrors((prev) => ({ ...prev, cardNumber: undefined }));
                      }
                    }}
                    className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-sm font-mono focus:outline-none ${
                      errors.cardNumber
                        ? 'border-rose-500'
                        : 'border-[#E7E2D8] focus:border-[#B48A4E]'
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-xs text-rose-600">{errors.cardNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#141413]">
                    {t.checkout.cardExpiry}
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-sm font-mono focus:outline-none ${
                      errors.cardExpiry
                        ? 'border-rose-500'
                        : 'border-[#E7E2D8] focus:border-[#B48A4E]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#141413]">
                    {t.checkout.cardCvc}
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-sm font-mono focus:outline-none ${
                      errors.cardCvc
                        ? 'border-rose-500'
                        : 'border-[#E7E2D8] focus:border-[#B48A4E]'
                    }`}
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-5">
          <div className="sticky top-28 rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-editorial text-2xl font-semibold text-[#141413]">
              {t.checkout.orderSummary}
            </h2>

            <ul className="mt-5 divide-y divide-[#E7E2D8]">
              {items.map((item) => (
                <li key={item.cartKey} className="flex items-center justify-between gap-3 py-3.5">
                  <div className="flex items-center gap-3">
                    <ProductImage
                      src={item.image}
                      alt={localize(item.title)}
                      palette={item.accentPalette}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#141413]">
                        {localize(item.title)}
                      </p>
                      <p className="text-xs text-[#141413]/60">
                        {localize(item.color.label)} · {localize(item.size.label)} ×{' '}
                        {formatNumber(item.quantity, language)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#141413]">
                    {formatCurrency(item.unitPriceUSD * item.quantity, language)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Promo Code Control */}
            <div className="mt-5 border-t border-[#E7E2D8] pt-5">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#141413]/75">
                <Tag className="h-3.5 w-3.5 text-[#B48A4E]" />
                <span>{t.cart.promoLabel}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder={t.cart.promoPlaceholder}
                  className="flex-1 rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3 py-2 text-xs focus:border-[#B48A4E] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => applyPromoCode(promoInput)}
                  className="rounded-xl border border-[#141413] px-4 py-2 text-xs font-semibold text-[#141413] hover:bg-[#141413] hover:text-white cursor-pointer"
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
                    className="font-semibold underline cursor-pointer"
                  >
                    {t.cart.removePromo}
                  </button>
                </div>
              )}
            </div>

            {/* Totals */}
            <dl className="mt-5 space-y-2 border-t border-[#E7E2D8] pt-4 text-sm">
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
              <div className="flex justify-between border-t border-[#E7E2D8] pt-3 text-lg font-bold text-[#141413]">
                <dt>{t.cart.total}</dt>
                <dd>{formatCurrency(totals.totalUSD, language)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#141413] px-6 py-3.5 text-sm font-semibold text-[#FAF8F5] shadow-md transition-all hover:bg-[#B48A4E] hover:text-[#141413] cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t.checkout.placeOrder}</span>
            </button>
          </div>
        </aside>
      </form>
    </main>
  );
}
