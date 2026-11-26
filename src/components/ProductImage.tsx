import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  palette: [string, string];
  className?: string;
}

export function ProductImage({ src, alt, palette, className = '' }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden ${className}`}
        style={{
          background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`,
        }}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_60%)]" />
        <Sparkles className="h-8 w-8 text-white/80" strokeWidth={1.25} />
        <span className="mt-2 max-w-[80%] text-center text-xs font-medium tracking-widest text-white/80 uppercase">
          Noor Studio
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
