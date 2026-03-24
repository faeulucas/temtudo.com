import { PropsWithChildren } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCurrentCity } from "@/contexts/CurrentCityContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Gauge,
  Home,
  Megaphone,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Store,
  UserCog,
  Wallet,
  Plus,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const DEFAULT_NAV: NavItem[] = [
  { label: "Visão geral", href: "/anunciante", icon: Home },
  { label: "Meus anúncios", href: "/anunciante/anuncios", icon: Package },
  { label: "Minha loja", href: "/lojas", icon: Store },
  { label: "Desempenho", href: "/anunciante/desempenho", icon: BarChart3 },
  { label: "Booster", href: "/planos", icon: Megaphone },
  { label: "Contatos", href: "/anunciante/contatos", icon: MessageSquare },
  { label: "Faturamento", href: "/anunciante/faturamento", icon: Wallet },
  { label: "Perfil", href: "/anunciante/meus-dados", icon: UserCog },
  { label: "Configurações", href: "/minha-conta", icon: Settings },
];

function Sidebar({ navItems }: { navItems: NavItem[] }) {
  const [location] = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[252px] shrink-0 border-r border-slate-200 bg-[#f5f5f5] px-4 py-6 lg:flex lg:flex-col">
      <div className="px-3">
        <div className="flex items-center gap-2 rounded-2xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700">
          <ShoppingBag className="h-4 w-4" />
          Painel Norte Vivo
        </div>
      </div>

      <nav className="mt-6 space-y-1">
        {navItems.map(item => {
          const active =
            location === item.href ||
            (item.href !== "/anunciante" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",
                  active
                    ? "border border-gray-200 bg-white text-gray-900 shadow-sm"
                    : "text-gray-700 hover:bg-gray-200"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"
                  )}
                />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

type DashboardHeaderProps = {
  title?: string;
  subtitle?: string;
  newButtonHref?: string;
  newButtonLabel?: string;
  showNewButton?: boolean;
};

function DashboardHeader({
  title = "Painel do anunciante",
  subtitle,
  newButtonHref = "/anunciante/novo",
  newButtonLabel = "Novo anúncio",
  showNewButton = true,
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const { city } = useCurrentCity();
  const [, navigate] = useLocation();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            {title}
          </p>
          <h1 className="font-display text-xl font-black text-slate-900">
            Olá, {user?.name ?? "Usuário"}
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            {subtitle || `Cidade: ${city?.name ?? "todas"}`}
          </p>
        </div>

        {showNewButton && (
          <Button
            onClick={() => navigate(newButtonHref)}
            className="rounded-xl bg-orange-500 font-bold text-white hover:bg-orange-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            {newButtonLabel}
          </Button>
        )}
      </div>
    </header>
  );
}

type AdvertiserLayoutProps = PropsWithChildren & {
  navItems?: NavItem[];
  headerTitle?: string;
  headerSubtitle?: string;
  headerNewButtonHref?: string;
  headerNewButtonLabel?: string;
  headerShowNewButton?: boolean;
};

export default function AdvertiserLayout({
  children,
  navItems = DEFAULT_NAV,
  headerTitle,
  headerSubtitle,
  headerNewButtonHref,
      headerNewButtonLabel,
      headerShowNewButton = true,
}: AdvertiserLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar navItems={navItems} />
        <div className="flex min-h-screen flex-1 flex-col lg:pl-[252px]">
          <DashboardHeader
            title={headerTitle}
            subtitle={headerSubtitle}
            newButtonHref={headerNewButtonHref}
            newButtonLabel={headerNewButtonLabel}
            showNewButton={headerShowNewButton}
          />
          <main className="flex-1 px-4 py-6 lg:px-6">
            <div className="mx-auto w-full max-w-[1160px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
