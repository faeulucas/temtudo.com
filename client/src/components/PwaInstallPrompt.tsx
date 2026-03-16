import { X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandaloneMode() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

const DISMISS_KEY = "nortevivo:pwa-install-dismissed-at";
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || isStandaloneMode()) return;
    const dismissedAt = window.localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_TTL_MS) {
      setDismissed(true);
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setDismissed(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const shouldShowNativePrompt = Boolean(deferredPrompt);

  if (!shouldShowNativePrompt || dismissed || isStandaloneMode()) {
    return null;
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome !== "accepted") {
        setInstalling(false);
        return;
      }
      setDeferredPrompt(null);
    } finally {
      setInstalling(false);
    }
  };

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
    setDismissed(true);
  };

  return (
    <div className="fixed inset-x-3 top-3 z-50 md:left-auto md:right-6 md:top-6 md:max-w-md">
      <div className="rounded-[24px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center gap-3 p-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient shadow-sm">
            <Zap className="h-6 w-6 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900">Baixe o app agora mesmo</p>
            <p className="text-sm text-slate-500">Acesso rapido e facil ao Norte Vivo.</p>
          </div>

          <Button
            type="button"
            onClick={handleInstall}
            disabled={installing}
            className="rounded-full bg-orange-gradient px-5 text-white hover:opacity-90"
          >
            {installing ? "Abrindo..." : "Abrir"}
          </Button>
        </div>
      </div>
    </div>
  );
}
