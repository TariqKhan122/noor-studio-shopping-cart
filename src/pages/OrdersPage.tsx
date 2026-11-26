import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Edit3, Package, User as UserIcon } from 'lucide-react';
import { ProductImage } from '../components/ProductImage';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { formatCurrency, formatNumber, formatOrderDate } from '../utils/formatters';

export function OrdersPage() {
  const { user, updateProfile } = useAuth();
  const { language, t, localize } = useLanguage();

  // Ephemeral inline profile edit UI state kept local
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name ?? '');
  const [cityInput, setCityInput] = useState(user?.city ?? '');

  if (!user) {
    return null;
  }

  const handleSaveProfile = (event: FormEvent) => {
    event.preventDefault();
    if (!nameInput.trim() || !cityInput.trim()) {
      return;
    }
    updateProfile({
      name: nameInput.trim(),
      city: cityInput.trim(),
    });
    setIsEditing(false);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-editorial text-3xl font-semibold text-[#141413] sm:text-4xl">
          {t.orders.title}
        </h1>
        <p className="mt-1.5 text-sm text-[#141413]/65">{t.orders.subtitle}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Member Profile Card */}
        <section className="lg:col-span-4">
          <div className="rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#141413] text-[#C59B5F]">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-editorial text-xl font-semibold text-[#141413]">
                    {t.orders.profileHeading}
                  </h2>
                  {user.isDemo && (
                    <span className="inline-block rounded-full bg-[#B48A4E]/15 px-2 py-0.5 text-[10px] font-semibold text-[#936E38]">
                      {t.nav.demoBadge}
                    </span>
                  )}
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(user.name);
                    setCityInput(user.city);
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-[#E7E2D8] px-3 py-1.5 text-xs font-semibold text-[#141413] hover:border-[#B48A4E] cursor-pointer"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>{t.orders.editProfile}</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="mt-5 space-y-3 border-t border-[#E7E2D8] pt-4">
                <div>
                  <label className="block text-xs font-semibold text-[#141413]">
                    {t.checkout.fullName}
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3 py-2 text-sm focus:border-[#B48A4E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#141413]">
                    {t.checkout.city}
                  </label>
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3 py-2 text-sm focus:border-[#B48A4E] focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-[#141413] py-2 text-xs font-semibold text-white hover:bg-[#B48A4E] cursor-pointer"
                  >
                    {t.orders.saveProfile}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 rounded-full border border-[#E7E2D8] py-2 text-xs font-semibold text-[#141413] cursor-pointer"
                  >
                    {t.orders.cancelEdit}
                  </button>
                </div>
              </form>
            ) : (
              <dl className="mt-5 space-y-3 border-t border-[#E7E2D8] pt-4 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-[#141413]/60">{t.checkout.fullName}</dt>
                  <dd className="font-semibold text-[#141413]">{user.name}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#141413]/60">{t.auth.emailLabel}</dt>
                  <dd className="truncate text-[#141413]">{user.email}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#141413]/60">{t.checkout.city}</dt>
                  <dd className="text-[#141413]">{user.city}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#141413]/60">{t.orders.memberSince}</dt>
                  <dd className="text-[#141413]">{user.memberSince}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#141413]/60">{t.orders.totalOrders}</dt>
                  <dd className="font-bold text-[#936E38]">
                    {formatNumber(user.orders.length, language)}
                  </dd>
                </div>
              </dl>
            )}
          </div>
        </section>

        {/* Order History List */}
        <section className="lg:col-span-8">
          {user.orders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#D6CFC2] bg-white/70 px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F2EDE4] text-[#B48A4E]">
                <Package className="h-6 w-6" />
              </div>
              <h2 className="font-editorial mt-4 text-2xl font-semibold text-[#141413]">
                {t.orders.noOrdersTitle}
              </h2>
              <p className="mt-2 text-sm text-[#141413]/65">{t.orders.noOrdersSubtitle}</p>
              <Link
                to="/"
                className="mt-6 inline-block rounded-full bg-[#141413] px-6 py-2.5 text-xs font-semibold text-[#FAF8F5] hover:bg-[#B48A4E]"
              >
                {t.orders.startShopping}
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {user.orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-3xl border border-[#E7E2D8] bg-white p-6 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E2D8] pb-4">
                    <div>
                      <p className="font-mono text-sm font-bold text-[#141413]">{order.id}</p>
                      <p className="text-xs text-[#141413]/60">
                        {formatOrderDate(order.createdAt, language)} · {order.shippingAddress.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t.orders.statusConfirmed}
                      </span>
                      <span className="text-base font-bold text-[#141413]">
                        {formatCurrency(order.totalUSD, language)}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <li key={item.cartKey} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <ProductImage
                            src={item.image}
                            alt={localize(item.title)}
                            palette={item.accentPalette}
                            className="h-12 w-12 rounded-xl object-cover"
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
                        <span className="text-xs font-semibold text-[#141413]">
                          {formatCurrency(item.unitPriceUSD * item.quantity, language)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
