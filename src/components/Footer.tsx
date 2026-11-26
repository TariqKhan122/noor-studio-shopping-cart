import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-[#E7E2D8] bg-[#F2EDE4]/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <div>
          <p className="font-editorial text-lg font-semibold text-[#141413]">{t.brand.name}</p>
          <p className="text-xs text-[#141413]/60">{t.brand.tagline}</p>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-[#141413]/70">
          <Link to="/" className="hover:text-[#141413]">
            {t.nav.shop}
          </Link>
          <Link to="/orders" className="hover:text-[#141413]">
            {t.nav.orders}
          </Link>
          <Link to="/checkout" className="hover:text-[#141413]">
            {t.nav.checkout}
          </Link>
        </div>

        <p className="text-xs text-[#141413]/55">{t.brand.copyright}</p>
      </div>
    </footer>
  );
}
