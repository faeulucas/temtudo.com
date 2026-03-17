import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LOGIN_ROUTE } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  BadgePercent,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CreditCard,
  HandCoins,
  LayoutGrid,
  Lock,
  LogIn,
  MapPin,
  Menu,
  MessageSquare,
  ReceiptText,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Tag,
  User,
} from "lucide-react";

type SidebarItem = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { key: string; label: string; href?: string }[];
};

type ProfileCard = {
  key: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  tone?: "default" | "ok" | "premium";
  visible?: boolean;
};

function getSidebarItems(isAdvertiser: boolean, isStoreOwner: boolean): SidebarItem[] {
  return [
    {
      key: "compras",
      label: "Compras",
      icon: ShoppingBag,
      children: [
        { key: "pedidos", label: "Pedidos" },
        { key: "favoritos", label: "Favoritos", href: "/favoritos" },
        { key: "cashback", label: "Cashback" },
      ],
    },
    {
      key: "vendas",
      label: "Vendas",
      icon: Tag,
      children: isAdvertiser
        ? [
            { key: "ativos", label: "Anuncios ativos", href: "/anunciante" },
            { key: "pausados", label: "Anuncios pausados", href: "/anunciante" },
            { key: "novo", label: "Criar anuncio", href: "/anunciante/novo" },
          ]
        : [{ key: "vender", label: "Comecar a vender", href: "/anunciar" }],
    },
    {
      key: "marketing",
      label: "Marketing",
      icon: BadgePercent,
      children: [
        { key: "booster", label: "Booster", href: "/booster" },
        { key: "planos", label: "Planos", href: "/planos" },
      ],
    },
    {
      key: "emprestimos",
      label: "Emprestimos",
      icon: HandCoins,
      children: [{ key: "credito", label: "Em breve" }],
    },
    {
      key: "assinaturas",
      label: "Assinaturas",
      icon: Star,
      children: [{ key: "nortevivomais", label: "NorteVivo+", href: "/planos" }],
    },
    {
      key: "faturamento",
      label: "Faturamento",
      icon: ReceiptText,
      children: [
        { key: "extrato", label: "Extrato" },
        { key: "pagamentos", label: "Pagamentos" },
      ],
    },
    {
      key: "meu-perfil",
      label: "Meu perfil",
      icon: User,
      children: [
        { key: "perfil", label: "Informacoes do perfil", href: "/anunciante/meus-dados" },
        { key: "seguranca", label: "Seguranca" },
        { key: "cartoes", label: "Cartoes" },
        { key: "enderecos", label: "Enderecos" },
        { key: "privacidade", label: "Privacidade" },
        { key: "comunicacoes", label: "Comunicacoes" },
        ...(isStoreOwner
          ? [{ key: "loja", label: "Minha loja", href: "/anunciante/meus-dados" }]
          : []),
      ],
    },
    {
      key: "configuracoes",
      label: "Configuracoes",
      icon: Settings,
      children: [
        { key: "preferencias", label: "Preferencias" },
        { key: "ajuda", label: "Ajuda" },
      ],
    },
  ];
}

function getProfileCards(
  isAdvertiser: boolean,
  isStoreOwner: boolean,
  planActive: boolean
): ProfileCard[] {
  const cards: ProfileCard[] = [
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
      tone: "ok",
    },
    {
      key: "plus",
      title: "NorteVivo+",
      description: "Assinatura com beneficios exclusivos.",
      icon: MessageSquare,
      tone: "premium",
      visible: planActive,
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
      description: "Escolha que tipo de informacao voce quer receber.",
      icon: MessageSquare,
    },
    {
      key: "anuncios",
      title: "Meus anuncios",
      description: "Gerencie seus anuncios ativos e pausados.",
      icon: LayoutGrid,
      href: "/anunciante",
      visible: isAdvertiser,
    },
    {
      key: "loja",
      title: "Minha loja",
      description: "Gerencie sua vitrine e produtos.",
      icon: BriefcaseBusiness,
      href: "/anunciante/meus-dados",
      visible: isStoreOwner,
    },
  ];

  return cards.filter(card => card.visible !== false);
}

export default function MyAccountPanel() {
  const { user, isAuthenticated, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("meu-perfil");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    compras: false,
    vendas: false,
    marketing: false,
    emprestimos: false,
    assinaturas: false,
    faturamento: false,
    "meu-perfil": true,
    configuracoes: false,
  });

  const { data: advertiserStats } = trpc.advertiser.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container py-20 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100">
            <LogIn className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="font-display text-3xl font-black text-gray-900">
            Entre para acessar sua conta
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Veja seus dados, compras, favoritos, anuncios e tudo o que voce
            movimenta dentro do Norte Vivo.
          </p>
          <Link href={LOGIN_ROUTE}>
            <Button className="mt-6 rounded-2xl bg-brand-gradient px-8 py-6 text-white">
              Entrar / Cadastrar
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName =
    user.personType === "pj" ? user.companyName || user.name : user.name;
  const avatarSrc = typeof user.avatar === "string" ? user.avatar : undefined;
  const displayInitial = displayName?.charAt(0)?.toUpperCase() || "N";
  const isStoreOwner = user.personType === "pj";
  const isAdvertiser = isStoreOwner || (advertiserStats?.totalListings ?? 0) > 0;
  const sidebarItems = useMemo(
    () => getSidebarItems(isAdvertiser, isStoreOwner),
    [isAdvertiser, isStoreOwner]
  );
  const profileCards = useMemo(
    () => getProfileCards(isAdvertiser, isStoreOwner, Boolean(user.trialStartedAt)),
    [isAdvertiser, isStoreOwner, user.trialStartedAt]
  );

  const renderSidebar = () => (
    <div className="flex h-full flex-col bg-[#f7f7f7]">
      <div className="flex items-center gap-4 px-6 py-7">
        <button
          type="button"
          className="rounded-full p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-800"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="text-2xl font-semibold text-slate-900">Minha conta</span>
      </div>

      <div className="space-y-2 px-3 py-6">
        {sidebarItems.map(item => {
          const Icon = item.icon;
          const isActive = item.key === activeSection;
          const isOpen = openGroups[item.key];

          return (
            <div key={item.key}>
              <button
                type="button"
                onClick={() => {
                  setActiveSection(item.key);
                  setOpenGroups(current => ({
                    ...current,
                    [item.key]: !current[item.key],
                  }));
                }}
                className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors ${
                  isActive ? "bg-white text-blue-600" : "text-slate-600 hover:bg-white"
                }`}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-blue-500" />
                  )}
                </div>
                <span className={`flex-1 text-[15px] ${isActive ? "font-semibold" : "font-medium"}`}>
                  {item.label}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && item.children?.length ? (
                <div className="ml-14 mt-1 space-y-1">
                  {item.children.map(child =>
                    child.href ? (
                      <Link
                        key={child.key}
                        href={child.href}
                        className="flex items-center rounded-xl px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-white hover:text-slate-900"
                      >
                        {child.label}
                      </Link>
                    ) : (
                      <div
                        key={child.key}
                        className="flex items-center rounded-xl px-3 py-2 text-sm text-slate-500"
                      >
                        {child.label}
                      </div>
                    )
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#efefef] text-slate-900">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[304px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200 bg-[#f7f7f7] lg:block">
          {renderSidebar()}
        </aside>

        <main className="min-w-0">
          <div className="px-5 py-5 lg:hidden">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl bg-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="mr-2 h-4 w-4" />
              Minha conta
            </Button>
          </div>

          <div className="px-5 pb-24 pt-4 sm:px-8 lg:px-12 lg:pt-8">
            <section className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="h-24 w-24 border border-white shadow-sm">
                <AvatarImage src={avatarSrc} alt={displayName || "Perfil"} />
                <AvatarFallback className="bg-white text-2xl font-bold text-slate-700">
                  {displayInitial}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <h1 className="truncate text-[22px] font-semibold text-slate-900 sm:text-[26px]">
                  {displayName}
                </h1>
                <p className="mt-1 text-lg text-slate-700">{user.email}</p>
              </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {profileCards.map(card => {
                const Icon = card.icon;
                const iconTone =
                  card.tone === "ok"
                    ? "text-slate-900"
                    : card.tone === "premium"
                      ? "text-slate-900"
                      : "text-slate-900";

                const cardInner = (
                  <article className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <Icon className={`h-7 w-7 ${iconTone}`} />
                      {card.tone === "ok" ? (
                        <CircleCheck className="h-6 w-6 text-emerald-500" />
                      ) : null}
                    </div>
                    <h2 className="mt-12 text-[20px] font-medium text-slate-900">
                      {card.title}
                    </h2>
                    <p className="mt-2 max-w-[280px] text-[16px] leading-8 text-slate-500">
                      {card.description}
                    </p>
                  </article>
                );

                return card.href ? (
                  <Link key={card.key} href={card.href} className="block">
                    {cardInner}
                  </Link>
                ) : (
                  <div key={card.key}>{cardInner}</div>
                );
              })}
            </section>
          </div>
        </main>
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[88vw] max-w-sm border-r-0 bg-[#f7f7f7] p-0">
          <SheetHeader className="border-b border-slate-200 px-5 py-5 text-left">
            <SheetTitle className="text-2xl font-semibold text-slate-900">
              Minha conta
            </SheetTitle>
            <SheetDescription>
              Navegue pelas areas da sua conta.
            </SheetDescription>
          </SheetHeader>
          <div className="h-full overflow-y-auto">{renderSidebar()}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
