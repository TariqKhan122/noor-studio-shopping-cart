import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Globe,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import { formatNumber } from '../utils/formatters';

export function Navbar() {
  const { language, t, toggleLanguage } = useLanguage();
  const { totals, toggleDrawer } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Ephemeral UI menu state kept strictly local
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileNavOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-[#B48A4E]'
        : 'text-[#141413]/75 hover:text-[#141413]'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#E7E2D8] bg-[#FAF8F5]/90 backdrop-blur-md">
      <div className="bg-[#141413] px-4 py-1.5 text-center text-xs tracking-wide text-[#FAF8F5]/90">
        {t.hero.promoBanner}
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Wordmark */}
        <Link
          to="/"
          className="group flex items-center gap-3 focus:outline-none"
          onClick={() => setIsMobileNavOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B48A4E]/40 bg-[#141413] text-[#FAF8F5] transition-transform duration-300 group-hover:scale-105">
            <span className="font-editorial text-lg font-semibold text-[#C59B5F]">
              {language === 'ur' ? 'ن' : 'N'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-xl font-semibold tracking-tight text-[#141413]">
              {t.brand.name}
            </span>
            <span className="hidden text-[10px] tracking-[0.14em] text-[#141413]/55 uppercase sm:block">
              {t.brand.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            {t.nav.shop}
          </NavLink>
          <NavLink to="/orders" className={navLinkClass}>
            {t.nav.orders}
          </NavLink>
          <NavLink to="/checkout" className={navLinkClass}>
            {t.nav.checkout}
          </NavLink>
        </div>

        {/* Utility Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle language between English and Urdu"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E2D8] bg-white px-3 py-1.5 text-xs font-semibold text-[#141413] shadow-xs transition-all hover:border-[#B48A4E] hover:text-[#936E38] cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5 text-[#B48A4E]" />
            <span>{t.nav.languageToggle}</span>
          </button>

          {/* Auth Status / User Menu */}
          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-[#E7E2D8] bg-white px-3 py-1.5 text-xs font-medium text-[#141413] transition-colors hover:border-[#B48A4E] cursor-pointer"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B48A4E]/15 text-[11px] font-bold text-[#936E38]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[110px] truncate sm:inline">{user.name}</span>
              </button>

              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="absolute end-0 mt-2 w-60 rounded-2xl border border-[#E7E2D8] bg-white p-2 shadow-xl"
                >
                  <div className="border-b border-[#E7E2D8] px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-[#141413]">{user.name}</p>
                    <p className="truncate text-xs text-[#141413]/60">{user.email}</p>
                    {user.isDemo && (
                      <span className="mt-1.5 inline-block rounded-full bg-[#B48A4E]/15 px-2 py-0.5 text-[10px] font-semibold text-[#936E38]">
                        {t.nav.demoBadge}
                      </span>
                    )}
                  </div>
                  <Link
                    to="/orders"
                    role="menuitem"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[#141413] transition-colors hover:bg-[#FAF8F5]"
                  >
                    <Package className="h-4 w-4 text-[#B48A4E]" />
                    <span>{t.nav.orders}</span>
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-start text-sm text-rose-700 transition-colors hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t.nav.signOut}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-full border border-[#E7E2D8] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#141413] transition-colors hover:border-[#141413] sm:inline-flex"
            >
              <UserIcon className="h-3.5 w-3.5 text-[#B48A4E]" />
              <span>{t.nav.signIn}</span>
            </Link>
          )}

          {/* Live Cart Drawer Button */}
          <button
            type="button"
            onClick={() => toggleDrawer(true)}
            aria-label={`${t.nav.cart} (${totals.itemCount})`}
            className="relative inline-flex items-center gap-2 rounded-full bg-[#141413] px-3.5 py-1.5 text-xs font-semibold text-[#FAF8F5] shadow-sm transition-all hover:bg-[#2A2927] active:scale-[0.98] cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#C59B5F]" />
            <span className="hidden sm:inline">{t.nav.cart}</span>
            <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[#B48A4E] px-1.5 py-0.5 text-[11px] font-bold text-white">
              {formatNumber(totals.itemCount, language)}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E7E2D8] bg-white text-[#141413] md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      {isMobileNavOpen && (
        <div className="border-t border-[#E7E2D8] bg-[#FAF8F5] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setIsMobileNavOpen(false)}
            >
              {t.nav.shop}
            </NavLink>
            <NavLink
              to="/orders"
              className={navLinkClass}
              onClick={() => setIsMobileNavOpen(false)}
            >
              {t.nav.orders}
            </NavLink>
            <NavLink
              to="/checkout"
              className={navLinkClass}
              onClick={() => setIsMobileNavOpen(false)}
            >
              {t.nav.checkout}
            </NavLink>
            {!isAuthenticated && (
              <NavLink
                to="/login"
                className={navLinkClass}
                onClick={() => setIsMobileNavOpen(false)}
              >
                {t.nav.signIn}
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
