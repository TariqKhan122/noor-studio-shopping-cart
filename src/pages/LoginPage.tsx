import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

interface LocationState {
  from?: {
    pathname: string;
    search?: string;
  };
  redirectReason?: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export function LoginPage() {
  const { isAuthenticated, loginWithCredentials, loginAsDemoUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = (location.state as LocationState | null) ?? null;
  const redirectTarget = locationState?.from
    ? `${locationState.from.pathname}${locationState.from.search ?? ''}`
    : '/';

  // Ephemeral form input & validation state kept local
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});

  if (isAuthenticated) {
    return <Navigate to={redirectTarget} replace />;
  }

  const validate = (): boolean => {
    const nextErrors: LoginFormErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = t.auth.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = t.auth.emailInvalid;
    }

    if (!password) {
      nextErrors.password = t.auth.passwordRequired;
    } else if (password.length < 6) {
      nextErrors.password = t.auth.passwordMinLength;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    loginWithCredentials({ email, name });
    navigate(redirectTarget, { replace: true });
  };

  const handleDemoLogin = () => {
    loginAsDemoUser();
    navigate(redirectTarget, { replace: true });
  };

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-lg items-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-[2rem] border border-[#E7E2D8] bg-white p-7 shadow-xl sm:p-10">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#B48A4E] uppercase">
          <Lock className="h-3.5 w-3.5" />
          <span>{t.brand.name}</span>
        </div>

        <h1 className="font-editorial mt-3 text-3xl font-semibold text-[#141413]">
          {t.auth.welcomeTitle}
        </h1>
        <p className="mt-2 text-sm text-[#141413]/65">{t.auth.welcomeSubtitle}</p>

        {locationState?.redirectReason === 'protected' && (
          <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-[#B48A4E]/40 bg-[#B48A4E]/10 p-3.5 text-xs text-[#735427]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#B48A4E]" />
            <span>{t.auth.redirectNotice}</span>
          </div>
        )}

        {/* One-Click Demo Login */}
        <div className="mt-6 rounded-2xl border border-[#E7E2D8] bg-[#FAF8F5] p-4">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#B48A4E] px-5 py-3 text-sm font-semibold text-[#141413] shadow-xs transition-all hover:bg-[#C69B5C] active:scale-[0.99] cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>{t.auth.demoLoginButton}</span>
          </button>
          <p className="mt-2 text-center text-[11px] text-[#141413]/60">{t.auth.demoHint}</p>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E7E2D8]" />
          <span className="text-[11px] font-medium text-[#141413]/45 uppercase">
            {t.auth.orDivider}
          </span>
          <div className="h-px flex-1 bg-[#E7E2D8]" />
        </div>

        {/* Standard Email/Password Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="login-name" className="block text-xs font-semibold text-[#141413]">
              {t.auth.nameLabel}
            </label>
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.auth.namePlaceholder}
              className="mt-1.5 w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#141413] placeholder:text-[#141413]/35 focus:border-[#B48A4E] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-[#141413]">
              {t.auth.emailLabel}
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder={t.auth.emailPlaceholder}
              className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#141413] placeholder:text-[#141413]/35 focus:outline-none ${
                errors.email
                  ? 'border-rose-500 focus:border-rose-600'
                  : 'border-[#E7E2D8] focus:border-[#B48A4E]'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-[#141413]">
              {t.auth.passwordLabel}
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder={t.auth.passwordPlaceholder}
              className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#141413] placeholder:text-[#141413]/35 focus:outline-none ${
                errors.password
                  ? 'border-rose-500 focus:border-rose-600'
                  : 'border-[#E7E2D8] focus:border-[#B48A4E]'
              }`}
            />
            {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-[#141413] px-6 py-3 text-sm font-semibold text-[#FAF8F5] shadow-md transition-colors hover:bg-[#292826] cursor-pointer"
          >
            {t.auth.signInButton}
          </button>
        </form>
      </div>
    </main>
  );
}
