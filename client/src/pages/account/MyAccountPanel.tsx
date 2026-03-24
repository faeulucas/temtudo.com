import type React from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AdvertiserLayout, { NavItem } from "@/layouts/AdvertiserLayout";
import { LOGIN_ROUTE } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  BadgeCheck,
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
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";

type DashboardCard = {
  key: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  visible?: boolean;
  status?: "ok" | "default";
};

const CARD_ORDER: DashboardCard[] = [
  {
    key: "perfil",
    title: "Informacoes do seu perfil",
    description: "Dados pessoais e da conta.",
    icon: ClipboardList,
    href: "/anunciante/meus-dados",
  },
  {
    key: "seguranca",
    title: "Seguranca",
    description: "Voce configurou a seguranca da sua conta.",
    icon: Lock,
    status: "ok",
  },
  {
    key: "plus",
    title: "NorteVivo+",
    description: "Assinatura com beneficios exclusivos.",
    icon: Gem,
    href: "/planos",
  },
  {
    key: "cartoes",
    title: "Cartoes",
    description: "Cartoes salvos na sua conta.",
    icon: CreditCard,
  },
  {
    key: "enderecos",
    title: "Enderecos",
    description: "Enderecos salvos na sua conta.",
    icon: MapPin,
  },
  {
    key: "privacidade",
    title: "Privacidade",
    description: "Preferencias e controle do uso dos seus dados.",
    icon: Shield,
  },
  {
    key: "comunicacoes",
    title: "Comunicacoes",
    description: "Escolha que tipo de informacao quer receber.",
    icon: MessageCircle,
  },
];

function buildNavItems(isAdvertiser: boolean): NavItem[] {
  return [
    { label: "Compras", href: "/minha-conta", icon: ShoppingBag },
    { label: "Vendas", href: "/minha-conta", icon: TrendingUp },
    { label: "Marketing", href: "/minha-conta", icon: Megaphone },
    { label: "Emprestimos", href: "/minha-conta", icon: Wallet },
    { label: "Assinaturas", href: "/minha-conta", icon: Gem },
    { label: "Faturamento", href: "/minha-conta", icon: FileText },
    { label: "Meu perfil", href: "/anunciante/meus-dados", icon: User },
    ...(isAdvertiser
      ? [{ label: "Painel do anunciante", href: "/anunciante", icon: LayoutGrid }]
      : []),
    { label: "Configuracoes", href: "/minha-conta", icon: Settings },
  ];
}

export default function MyAccountPanel() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: advertiserStats } = trpc.advertiser.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

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

  const isStoreOwner = user.personType === "pj";
  const isAdvertiser = isStoreOwner || (advertiserStats?.totalListings ?? 0) > 0;
  const displayName = user.personType === "pj" ? user.companyName || user.name : user.name;
  const avatarSrc = typeof user.avatar === "string" ? user.avatar : undefined;
  const avatarInitial = displayName?.charAt(0)?.toUpperCase() || "N";
  const navItems = buildNavItems(isAdvertiser);

  const cards = CARD_ORDER.filter(card => {
    if (card.key === "plus") {
      return Boolean(user.trialStartedAt);
    }
    return true;
  });

  return (
    <AdvertiserLayout
      navItems={navItems}
      headerTitle="Minha conta"
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
            return card.href ? (
              <Link key={card.key} href={card.href} className="block h-full">
                {cardContent}
              </Link>
            ) : (
              <div key={card.key} className="h-full">
                {cardContent}
              </div>
            );
          })}
        </section>

          <p className="text-center text-sm text-gray-600">
            Voce pode{" "}
            <a className="text-blue-500 hover:underline" href="/minha-conta/cancelar">
              cancelar sua conta
            </a>{" "}
            quando quiser.
        </p>
      </div>
    </AdvertiserLayout>
  );
}
