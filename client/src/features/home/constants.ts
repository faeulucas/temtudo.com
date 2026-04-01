import { guideIcon } from "@/lib/cloudinary";
import { MapPin, ShoppingBag, Store } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CLOUD_ICONS = {
  promocoes: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229865/promo%C3%A7oes_mcwevy.png?v=2",
  delivery: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229863/delivery_dh1ldp.png?v=2",
  mercado: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229864/mercado_mklm3p.png?v=2",
  lojas: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229864/lojas_kkgcle.png?v=2",
  servicos: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229865/servi%C3%A7os_yvvovd.png?v=2",
  imoveis: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229864/im%C3%B3veis_bqgzqe.png?v=2",
  eventos: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229866/eventos_fmc6ux.png?v=2",
  empregos: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229863/empregos_bikklg.png?v=2",
  lanches: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229864/lanches_wfp564.png?v=2",
  pizza: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229865/pizza_xslxqr.png?v=2",
  burguer: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229864/hamburguer_uq4feq.png?v=2",
};

export const GUIDE_SHORTCUTS = [
  {
    title: "SaÃºde",
    description: "Hospitais, clÃ­nicas e farmÃ¡cias",
    href: "/busca?q=saude",
    image: guideIcon("guide-health") ?? undefined,
    fallbackImage: "/icons/things/guide-health.webp",
    emoji: "ð¥",
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "SeguranÃ§a",
    description: "PolÃ­cia, apoio e serviÃ§os Ãºteis",
    href: "/busca?q=seguranca",
    image: guideIcon("guide-security") ?? undefined,
    fallbackImage: "/icons/things/guide-security.webp",
    emoji: "ð¡ï¸",
    tone: "bg-blue-50 text-blue-700",
  },
  {
    title: "EmergÃªncias",
    description: "Atalhos rÃ¡pidos para urgÃªncias",
    href: "/busca?q=emergencia",
    image: guideIcon("guide-emergencies") ?? undefined,
    fallbackImage: "/icons/things/guide-emergencies.webp",
    emoji: "ð¨",
    tone: "bg-rose-50 text-rose-700",
  },
  {
    title: "Oficinas",
    description: "MecÃ¢nicos, eletricistas e reparos",
    href: "/busca?q=oficina",
    image: guideIcon("guide-workshops") ?? undefined,
    fallbackImage: "/icons/things/guide-workshops.webp",
    emoji: "ð ï¸",
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "ServiÃ§os",
    description: "Prestadores e negÃ³cios locais",
    href: "/busca?q=servicos",
    image: guideIcon("guide-services") ?? undefined,
    fallbackImage: "/icons/things/guide-services.webp",
    emoji: "ð§°",
    tone: "bg-violet-50 text-violet-700",
  },
  {
    title: "Empresas",
    description: "Lojas, comÃ©rcios e contatos Ãºteis",
    href: "/lojas",
    image: guideIcon("guide-businesses") ?? undefined,
    fallbackImage: "/icons/things/guide-businesses.webp",
    emoji: "ðª",
    tone: "bg-slate-100 text-slate-700",
  },
];

type Pillar = {
  label: string;
  description: string;
  href: string;
  emoji?: string;
  icon?: LucideIcon;
  badge: string;
  tone: string;
};

export const PILLARS: Pillar[] = [
  {
    label: "Guia Local",
    description: "Encontre telefones, serviÃ§os e empresas da sua cidade.",
    href: "/guia",
    emoji: "ð",
    icon: MapPin,
    badge: "Informativo local",
    tone: "border-blue-200 bg-white text-slate-900 hover:border-blue-300 hover:shadow-lg",
  },
  {
    label: "Marketplace Regional",
    description: "Descubra produtos, ofertas e oportunidades perto de vocÃª.",
    href: "/busca",
    emoji: "ðï¸",
    icon: ShoppingBag,
    badge: "Compra e venda",
    tone: "border-orange-200 bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg",
  },
  {
    label: "Crie sua Loja",
    description: "Monte sua vitrine online e apareÃ§a para novos clientes.",
    href: "/lojas",
    emoji: "ðª",
    icon: Store,
    badge: "Para quem nÃ£o tem site",
    tone: "border-slate-800 bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg",
  },
];

export const QUICK_SEGMENTS = [
  { label: "Seja d+", emoji: "â¨" },
  {
    label: "Lanches",
    emoji: "ð¥ª",
    image: CLOUD_ICONS.lanches,
  },
  {
    label: "Pizza",
    emoji: "ð",
    image: CLOUD_ICONS.pizza,
  },
  {
    label: "Burguer",
    emoji: "ð",
    image: CLOUD_ICONS.burguer,
  },
  { label: "PorÃ§Ãµes", emoji: "ð" },
  { label: "Marmita", emoji: "ð±" },
  { label: "Sushi", emoji: "ð£" },
];

export const MOBILE_TABS = [
  { label: "Tudo", href: "/", emoji: "â¨" },
  { label: "Restaurantes", href: "/busca?type=food", emoji: "ð½ï¸" },
  { label: "Mercados", href: "/busca?q=mercado", emoji: "ð" },
  { label: "Lojas", href: "/lojas", emoji: "ðª" },
  { label: "ServiÃ§os", href: "/busca?q=servicos", emoji: "ð ï¸" },
  { label: "Guia local", href: "/guia", emoji: "ð" },
];

export const CATEGORY_SHORTCUTS = [
  {
    label: "PromoÃ§Ãµes",
    href: "/promocoes",
    emoji: "ð¥",
    image: CLOUD_ICONS.promocoes,
    fallbackImage: CLOUD_ICONS.promocoes,
    tone: "bg-orange-50 text-orange-700",
  },
  {
    label: "Delivery",
    href: "/delivery",
    emoji: "ð",
    image: CLOUD_ICONS.delivery,
    fallbackImage: CLOUD_ICONS.delivery,
    tone: "bg-rose-50 text-rose-700",
  },
  {
    label: "Mercado",
    href: "/mercado",
    emoji: "ð",
    image: CLOUD_ICONS.mercado,
    fallbackImage: CLOUD_ICONS.mercado,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    label: "Lojas",
    href: "/lojas",
    emoji: "ð¬",
    image: CLOUD_ICONS.lojas,
    fallbackImage: CLOUD_ICONS.lojas,
    tone: "bg-indigo-50 text-indigo-700",
  },
  {
    label: "ServiÃ§os",
    href: "/servicos",
    emoji: "ð§°",
    image: CLOUD_ICONS.servicos,
    fallbackImage: CLOUD_ICONS.servicos,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "ImÃ³veis",
    href: "/imoveis",
    emoji: "ð ",
    image: CLOUD_ICONS.imoveis,
    fallbackImage: CLOUD_ICONS.imoveis,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    label: "Eventos",
    href: "/eventos",
    emoji: "ð",
    image: CLOUD_ICONS.eventos,
    fallbackImage: CLOUD_ICONS.eventos,
    tone: "bg-purple-50 text-purple-700",
  },
  {
    label: "Empregos",
    href: "/empregos",
    emoji: "ð¼",
    image: CLOUD_ICONS.empregos,
    fallbackImage: CLOUD_ICONS.empregos,
    tone: "bg-cyan-50 text-cyan-700",
  },
];

export const FILTER_CHIPS = ["Filtros", "Entrega grÃ¡tis", "PromoÃ§Ãµes"];

export const PROMO_BANNERS = [
  {
    id: "club-cupom",
    title: "clube de cupons",
    subtitle: "receba cupons exclusivos e economize todo mÃªs!",
    cta: "ver ofertas",
    href: "/busca?q=promo",
  },
  {
    id: "mega-off",
    title: "35% OFF",
    subtitle: "os rangos que sÃ£o sucesso com cupom: ESTRELAS",
    cta: "usar cupom",
    href: "/busca?q=estrelas",
  },
];

export const COLLECTION_CARD = {
  title: "coleÃ§Ãµes de lojas e promos",
  href: "/busca?q=promocoes",
  cardTitle: "Promos que adoramos",
  cardSubtitle: "sei que seu hobby Ã© pagar no precinho",
};





