import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppInstallBannerProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  iconUrl?: string;
  storageKey?: string;
};

// Banner inspirado no prompt de “usar o app”, com opção de fechar e lembrar a escolha.
export default function AppInstallBanner({
  title = "Use o aplicativo",
  subtitle = "Acesso rápido e fácil no app",
  ctaLabel = "Abrir",
  ctaHref = "/app",
  iconUrl,
  storageKey = "nv_app_banner_dismissed",
}: AppInstallBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    if (!dismissed) setVisible(true);
  }, [storageKey]);

  if (!visible) return null;

  return (
    <div className="container">
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <button
          type="button"
          className="text-slate-400 transition hover:text-slate-600"
          aria-label="Fechar banner"
          onClick={() => {
            localStorage.setItem(storageKey, "1");
            setVisible(false);
          }}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt="App"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-slate-700">App</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="truncate text-xs text-slate-500">{subtitle}</p>
        </div>

        <a href={ctaHref} className="shrink-0">
          <Button className="rounded-full bg-orange-500 px-4 text-white hover:bg-orange-600">
            {ctaLabel}
          </Button>
        </a>
      </div>
    </div>
  );
}
