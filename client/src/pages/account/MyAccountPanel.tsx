import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AdvertiserLayout, { NavItem } from "@/layouts/AdvertiserLayout";
import { LOGIN_ROUTE } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle,
  ClipboardList,
  CreditCard,
  FileText,
  Gem,
  LayoutGrid,
  Lock,
  LogIn,
  MapPin,
  Megaphone,
  MessageCircle,
  Settings,
  Shield,
  ShoppingBag,
  Store,
  User,
  Wallet,
} from "lucide-react";

type DashboardCard = {
  key: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  targetTab?: string;
  visible?: boolean;
  status?: "ok" | "default";
};

const SECTIONS: NavItem[] = [
  { label: "Visao geral", href: "/painel?tab=visao-geral", icon: LayoutGrid },
  { label: "Meus dados", href: "/painel?tab=meus-dados", icon: User },
  { label: "Meus anuncios", href: "/painel?tab=meus-anuncios", icon: ClipboardList },
  { label: "Minha loja", href: "/painel?tab=minha-loja", icon: Store },
  { label: "Contatos", href: "/painel?tab=contatos", icon: MessageCircle },
  { label: "Booster", href: "/painel?tab=booster", icon: Megaphone },
  { label: "Faturamento", href: "/painel?tab=faturamento", icon: Wallet },
  { label: "Configuracoes", href: "/painel?tab=configuracoes", icon: Settings },
];

const CARDS: DashboardCard[] = [
  {
    key: "perfil",
    title: "Informacoes do seu perfil",
    description: "Dados pessoais e da conta.",
    icon: ClipboardList,
    targetTab: "meus-dados",
  },
  {
    key: "seguranca",
    title: "Seguranca",
    description: "Voce configurou a seguranca da sua conta.",
    icon: Lock,
    status: "ok",
    targetTab: "configuracoes",
  },
  {
    key: "plus",
    title: "NorteVivo+",
    description: "Assinatura com beneficios exclusivos.",
    icon: Gem,
  },
  {
    key: "cartoes",
    title: "Cartoes",
    description: "Cartoes salvos na sua conta.",
    icon: CreditCard,
    targetTab: "faturamento",
  },
  {
    key: "enderecos",
    title: "Enderecos",
    description: "Enderecos salvos na sua conta.",
    icon: MapPin,
    targetTab: "meus-dados",
  },
  {
    key: "privacidade",
    title: "Privacidade",
    description: "Preferencias e controle do uso dos seus dados.",
    icon: Shield,
    targetTab: "configuracoes",
  },
  {
    key: "comunicacoes",
    title: "Comunicacoes",
    description: "Escolha que tipo de informacao quer receber.",
    icon: MessageCircle,
    targetTab: "configuracoes",
  },
  {
    key: "anuncios",
    title: "Meus Anuncios",
    description: "Gerencie seus anuncios ativos e pausados.",
    icon: LayoutGrid,
    targetTab: "meus-anuncios",
    visible: true,
  },
  {
    key: "loja",
    title: "Minha Loja",
    description: "Gerencie sua vitrine e produtos.",
    icon: Store,
    targetTab: "minha-loja",
    visible: true,
  },
  {
    key: "booster",
    title: "Booster",
    description: "Impulsione seus anuncios e alcance mais clientes.",
    icon: Megaphone,
    targetTab: "booster",
    visible: true,
  },
  {
    key: "faturamento",
    title: "Faturamento",
    description: "Visualize seu extrato e pagamentos.",
    icon: Wallet,
    targetTab: "faturamento",
  },
];

function getTabFromLocation(location: string) {
  const query = location.split("?")[1];
  if (!query) return "visao-geral";
  const params = new URLSearchParams(query);
  return params.get("tab") || "visao-geral";
}

export default function MyAccountPanel() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: advertiserStats } = trpc.advertiser.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("visao-geral");

  useEffect(() => {
    setActiveTab(getTabFromLocation(location));
  }, [location]);

  const isStoreOwner = user?.personType === "pj";
  const isAdvertiser = isStoreOwner || (advertiserStats?.totalListings ?? 0) > 0;

  const navItems = useMemo(() => {
    return SECTIONS.filter(item => {
      if (item.label === "Meus anuncios" || item.label === "Booster") {
        return isAdvertiser;
      }
      if (item.label === "Minha loja") {
        return isStoreOwner;
      }
      return true;
    });
  }, [isAdvertiser, isStoreOwner]);

  const cards = useMemo(
    () =>
      CARDS.filter(card => {
        if (card.key === "plus") {
          return Boolean(user?.trialStartedAt);
        }
        if (!isAdvertiser && ["anuncios", "booster"].includes(card.key)) return false;
        if (!isStoreOwner && card.key === "loja") return false;
        return card.visible !== false;
      }),
    [isAdvertiser, isStoreOwner, user?.trialStartedAt]
  );

  const displayName = user?.personType === "pj" ? user?.companyName || user?.name : user?.name;
  const avatarSrc = typeof user?.avatar === "string" ? user?.avatar : undefined;
  const avatarInitial = displayName?.charAt(0)?.toUpperCase() || "N";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <LogIn className="h-8 w-8 text-gray-700" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Entre na sua conta</h1>
          <p className="mt-3 text-base text-gray-500">
            Acesse compras, anuncios, faturamento e o seu perfil no Norte Vivo.
          </p>
          <Link href={LOGIN_ROUTE}>
            <Button className="mt-6 w-full rounded-full bg-orange-500 py-6 text-white hover:bg-orange-600">
              Entrar / Cadastrar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleNavigate = (tab: string) => {
    setLocation(`/painel?tab=${tab}`);
  };

  const renderSection = () => {
    switch (activeTab) {
      case "meus-dados":
        return (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Meus dados</h3>
            <p className="mt-2 text-sm text-gray-600">Edite suas informacoes pessoais e de conta.</p>
          </div>
        );
      case "meus-anuncios":
        return (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Meus anúncios</h3>
            <p className="mt-2 text-sm text-gray-600">
              Gere seus anúncios sem sair do painel. (Conteúdo detalhado pode ser plugado aqui)
            </p>
          </div>
        );
      case "minha-loja":
        return (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Minha loja</h3>
            <p className="mt-2 text-sm text-gray-600">Gerencie vitrine e produtos dentro do painel.</p>
          </div>
        );
      case "contatos":
        return (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Contatos</h3>
            <p className="mt-2 text-sm text-gray-600">Centralize mensagens e leads aqui.</p>
          </div>
        );
      case "booster":
        return (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Booster</h3>
            <p className="mt-2 text-sm text-gray-600">Configure impulsionamento dentro do painel.</p>
          </div>
        );
      case "faturamento":
        return (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Faturamento</h3>
            <p className="mt-2 text-sm text-gray-600">Veja extratos e pagamentos sem sair do painel.</p>
          </div>
        );
      case "configuracoes":
        return (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Configurações</h3>
            <p className="mt-2 text-sm text-gray-600">Ajuste preferências, segurança e notificações.</p>
          </div>
        );
      default:
        return (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map(card => {
              const Icon = card.icon;
              const cardContent = (
                <article className="flex h-full min-h-[180px] flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <Icon className="h-7 w-7 text-gray-700" />
                    {card.status === "ok" ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    ) : null}
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 leading-6">{card.description}</p>
                  </div>
                </article>
              );
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => handleNavigate(card.targetTab || "visao-geral")}
                  className="text-left"
                >
                  {cardContent}
                </button>
              );
            })}
          </section>
        );
    }
  };

  return (
    <AdvertiserLayout
      navItems={navItems}
      headerTitle="Painel"
      headerSubtitle={user.email ?? "Area do usuario"}
      headerShowNewButton={false}
    >
      <div className="space-y-8 bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gradient-to-br from-yellow-200 to-yellow-400">
            <Avatar className="h-full w-full">
              <AvatarImage src={avatarSrc} alt={displayName || "Perfil"} />
              <AvatarFallback className="text-lg font-semibold text-gray-800">
                {avatarInitial}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="mt-3 text-2xl font-bold capitalize text-gray-900">{displayName}</h1>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        {renderSection()}

        <p className="text-center text-sm text-gray-600">
          Voce pode{" "}
          <a className="text-blue-500 hover:underline" href="/painel?tab=configuracoes">
            cancelar sua conta
          </a>{" "}
          quando quiser.
        </p>
      </div>
    </AdvertiserLayout>
  );
}
