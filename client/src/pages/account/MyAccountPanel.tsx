import type React from "react";
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AdvertiserLayout, { NavItem } from "@/layouts/AdvertiserLayout";
import { LOGIN_ROUTE } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  CreditCard,
  LayoutGrid,
  Lock,
  LogIn,
  MapPin,
  Menu,
  MessageSquare,
  Pencil,
  Receipt,
  Rocket,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Store,
  User,
  Wallet,
  BadgeCheck,
} from "lucide-react";

type MainSection = {
  key: string;
  label: string;
  children: {
    key: string;
    label: string;
    href?: string;
  }[];
};

type DashboardCard = {
  key: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  visible?: boolean;
  status?: "ok" | "default";
};

function buildSections(
  isAdvertiser: boolean,
  isStoreOwner: boolean,
  storefrontHref: string
): MainSection[] {
  return [
    {
      key: "conta",
      label: "Minha Conta",
      children: [
        { key: "perfil", label: "Informacoes do Perfil", href: "/anunciante/meus-dados" },
        { key: "seguranca", label: "Seguranca" },
        { key: "enderecos", label: "Enderecos" },
        { key: "cartoes", label: "Cartoes" },
        { key: "comunicacoes", label: "Comunicacoes" },
        { key: "privacidade", label: "Privacidade" },
      ],
    },
    {
      key: "compras",
      label: "Minhas Compras",
      children: [
        { key: "pedidos", label: "Pedidos" },
        { key: "favoritos", label: "Favoritos", href: "/favoritos" },
        { key: "cashback", label: "Cashback" },
      ],
    },
    ...(isAdvertiser
      ? [
          {
            key: "anuncios",
            label: "Meus Anuncios",
            children: [
              { key: "ativos", label: "Anuncios Ativos", href: "/anunciante" },
              { key: "pausados", label: "Anuncios Pausados", href: "/anunciante" },
              { key: "novo", label: "Criar Novo Anuncio", href: "/anunciante/novo" },
              { key: "booster", label: "Booster", href: "/booster" },
            ],
          },
        ]
      : []),
    ...(isStoreOwner
      ? [
          {
            key: "lojas",
            label: "Minhas Lojas",
            children: [
              { key: "vitrine", label: "Minha Vitrine", href: storefrontHref },
              { key: "produtos-loja", label: "Produtos da Loja", href: "/anunciante" },
              { key: "pedidos-loja", label: "Pedidos da Loja" },
              {
                key: "config-loja",
                label: "Configuracoes da Loja",
                href: "/anunciante/meus-dados",
              },
            ],
          },
        ]
      : []),
    {
      key: "faturamento",
      label: "Faturamento",
      children: [
        { key: "extrato", label: "Extrato" },
        { key: "pagamentos", label: "Pagamentos" },
        { key: "planos", label: "Planos e Assinaturas", href: "/planos" },
      ],
    },
    {
      key: "configuracoes",
      label: "Configuracoes",
      children: [
        { key: "notificacoes", label: "Notificacoes" },
        { key: "preferencias", label: "Preferencias" },
        { key: "ajuda", label: "Ajuda" },
      ],
    },
  ];
}

function buildCards(
  isAdvertiser: boolean,
  isStoreOwner: boolean,
  planActive: boolean,
  storefrontHref: string
): DashboardCard[] {
  const cards: DashboardCard[] = [
    {
      key: "perfil",
      title: "Informacoes do seu perfil",
      description: "Dados pessoais e da conta.",
      icon: User,
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
      icon: Star,
      href: "/planos",
      visible: planActive,
    },
    {
      key: "cartoes",
      title: "Meus Cartoes",
      description: "Cartoes salvos na sua conta.",
      icon: CreditCard,
    },
    {
      key: "enderecos",
      title: "Meus Enderecos",
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
      icon: MessageSquare,
    },
    {
      key: "pedidos",
      title: "Meus Pedidos",
      description: "Acompanhe suas compras e vendas.",
      icon: ShoppingBag,
    },
    {
      key: "anuncios",
      title: "Meus Anuncios",
      description: "Gerencie seus anuncios ativos e pausados.",
      icon: LayoutGrid,
      href: "/anunciante",
      visible: isAdvertiser,
    },
    {
      key: "loja",
      title: "Minha Loja",
      description: "Gerencie sua vitrine e produtos.",
      icon: Store,
      href: storefrontHref,
      visible: isStoreOwner,
    },
    {
      key: "booster",
      title: "Booster",
      description: "Impulsione seus anuncios e alcance mais clientes.",
      icon: Rocket,
      href: "/booster",
      visible: isAdvertiser,
    },
    {
      key: "faturamento",
      title: "Faturamento",
      description: "Visualize seu extrato e pagamentos.",
      icon: Wallet,
      href: "/planos",
    },
  ];

  return cards.filter(card => card.visible !== false);
}

export default function MyAccountPanel() {
  const { user, isAuthenticated, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("conta");

  const { data: advertiserStats } = trpc.advertiser.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <LogIn className="h-8 w-8 text-slate-700" />
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">Entre na sua conta</h1>
          <p className="mt-3 text-base text-slate-500">
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
  const hasBuyerSignals = Boolean((advertiserStats?.totalContacts ?? 0) > 0);
  const accountType = isStoreOwner
    ? hasBuyerSignals
      ? "Ambos"
      : "Anunciante PJ"
    : isAdvertiser
      ? hasBuyerSignals
        ? "Ambos"
        : "Anunciante PF"
      : "Comprador";
  const storefrontHref = isStoreOwner && user.id ? `/loja/${user.id}` : "/lojas";
  const sections = buildSections(isAdvertiser, isStoreOwner, storefrontHref);
  const cards = buildCards(
    isAdvertiser,
    isStoreOwner,
    Boolean(user.trialStartedAt),
    storefrontHref
  );
  const currentSection = sections.find(section => section.key === activeSection) ?? sections[0];
  const displayName = user.personType === "pj" ? user.companyName || user.name : user.name;
  const avatarSrc = typeof user.avatar === "string" ? user.avatar : undefined;
  const avatarInitial = displayName?.charAt(0)?.toUpperCase() || "N";

  const visibleCards = cards.filter(card => {
    if (activeSection === "conta") {
      return [
        "perfil",
        "seguranca",
        "plus",
        "cartoes",
        "enderecos",
        "privacidade",
        "comunicacoes",
      ].includes(card.key);
    }
    if (activeSection === "compras") {
      return ["pedidos", "enderecos", "cartoes"].includes(card.key);
    }
    if (activeSection === "anuncios") {
      return ["anuncios", "booster"].includes(card.key);
    }
    if (activeSection === "lojas") {
      return ["loja", "anuncios"].includes(card.key);
    }
    if (activeSection === "faturamento") {
      return ["faturamento", "plus"].includes(card.key);
    }
    if (activeSection === "configuracoes") {
      return ["privacidade", "comunicacoes", "seguranca"].includes(card.key);
    }
    return true;
  });

  const renderSectionChips = () => (
    <div className="flex flex-wrap gap-2">
      {sections.map(section => (
        <button
          key={section.key}
          type="button"
          onClick={() => setActiveSection(section.key)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            section.key === activeSection
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
          }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  );

  const quickStats = [
    { key: "listings", label: "Anuncios", value: advertiserStats?.totalListings ?? 0 },
    { key: "contacts", label: "Contatos", value: advertiserStats?.totalContacts ?? 0 },
    { key: "boosters", label: "Boosters", value: advertiserStats?.totalBoosters ?? 0 },
  ];

  const navItems: NavItem[] = [
    { label: "Minha conta", href: "/minha-conta", icon: User },
    { label: "Pedidos", href: "/minha-conta", icon: ShoppingBag },
    { label: "Favoritos", href: "/favoritos", icon: Star },
    { label: "Pagamentos", href: "/minha-conta", icon: CreditCard },
    { label: "Enderecos", href: "/minha-conta", icon: MapPin },
    { label: "Seguranca", href: "/minha-conta", icon: Shield },
    { label: "Configuracoes", href: "/minha-conta", icon: Settings },
    ...(isAdvertiser
      ? [{ label: "Painel do anunciante", href: "/anunciante", icon: LayoutGrid }]
      : []),
  ];

  return (
    <AdvertiserLayout
      navItems={navItems}
      headerTitle="Minha conta"
      headerSubtitle="Area do usuario"
      headerShowNewButton={false}
    >
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border border-slate-200">
                  <AvatarImage src={avatarSrc} alt={displayName || "Perfil"} />
                  <AvatarFallback className="bg-slate-100 text-lg font-semibold text-slate-700">
                    {avatarInitial}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-600">
                    Minha conta
                  </p>
                  <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
                  <p className="text-sm text-slate-500">
                    {accountType} • {user.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/anunciante/meus-dados">
                  <Button variant="outline" className="rounded-xl">
                    <Pencil className="mr-2 h-4 w-4" />
                    Meus dados
                  </Button>
                </Link>
                {isAdvertiser && (
                  <Link href="/anunciante">
                    <Button className="rounded-xl bg-orange-500 text-white hover:bg-orange-600">
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      Abrir painel
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium">
                Plano: {user.trialStartedAt ? "Em teste" : "Gratuito"}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium">
                Tipo: {accountType}
              </span>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-sm font-semibold text-slate-800">Navegue pelas areas</p>
              {renderSectionChips()}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-600">
                Resumo rapido
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {quickStats.map(item => (
                  <div key={item.key} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-500">{item.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{currentSection.label}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-sm text-slate-600"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                  Trocar
                </Button>
              </div>
              <div className="mt-3 space-y-2">
                {currentSection.children.map(item =>
                  item.href ? (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-200 hover:bg-slate-50"
                    >
                      {item.label}
                      <span className="text-slate-400">{">"}</span>
                    </Link>
                  ) : (
                    <div
                      key={item.key}
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm text-slate-700"
                    >
                      {item.label}
                      <span className="text-slate-400">{">"}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Seguranca e privacidade</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span>Autenticacao</span>
                  <BadgeCheck className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span>Preferencias de comunicacao</span>
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-600">
                {currentSection.label}
              </p>
              <h2 className="text-lg font-semibold text-slate-900">Acoes rapidas</h2>
              <p className="text-sm text-slate-500">
                Atalhos organizados no mesmo visual do painel do anunciante.
              </p>
            </div>
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="mr-2 h-4 w-4" />
              Menu
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleCards.map(card => {
              const Icon = card.icon;
              const content = (
                <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-800">
                      <Icon className="h-5 w-5" />
                    </div>
                    {card.status === "ok" ? (
                      <BadgeCheck className="h-5 w-5 text-emerald-500" />
                    ) : null}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                  </div>
                </article>
              );

              return card.href ? (
                <Link key={card.key} href={card.href} className="block h-full">
                  {content}
                </Link>
              ) : (
                <div key={card.key} className="h-full">
                  {content}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[88vw] max-w-sm border-r-0 bg-white p-0">
          <SheetHeader className="border-b border-slate-200 px-5 py-5 text-left">
            <SheetTitle className="text-xl font-semibold text-slate-900">Minha Conta</SheetTitle>
            <SheetDescription>Navegue pelas areas do painel.</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 p-5">
            {sections.map(section => (
              <button
                key={section.key}
                type="button"
                onClick={() => {
                  setActiveSection(section.key);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium ${
                  section.key === activeSection
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {section.label}
                <Receipt className="h-4 w-4 opacity-40" />
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </AdvertiserLayout>
  );
}
