export type BusinessSegment =
  | "generic"
  | "food"
  | "vehicles"
  | "fashion"
  | "electronics";

export function getSegmentFromCategorySlug(slug?: string | null): BusinessSegment {
  if (!slug) return "generic";

  if (["onde-comer", "delivery", "restaurantes", "lanchonetes", "pizzarias"].includes(slug)) {
    return "food";
  }

  if (["veiculos", "autopecas", "motos", "carros"].includes(slug)) {
    return "vehicles";
  }

  if (["moda-acessorios", "roupas", "calcados"].includes(slug)) {
    return "fashion";
  }

  if (["eletronicos", "informatica", "celulares"].includes(slug)) {
    return "electronics";
  }

  return "generic";
}

export const SEGMENT_CONTENT: Record<
  BusinessSegment,
  {
    badge: string;
    title: string;
    description: string;
    highlights: string[];
  }
> = {
  generic: {
    badge: "Painel padrao",
    title: "Painel de operacao do anunciante",
    description: "Ideal para quem anuncia produtos, servicos e oportunidades em geral.",
    highlights: [
      "Gerencie anuncios, plano e performance",
      "Use booster para ganhar visibilidade",
      "Acompanhe favoritos, contatos e alcance",
    ],
  },
  food: {
    badge: "Segmento alimentacao",
    title: "Painel de loja e cardapio",
    description: "Para lanchonetes, delivery e restaurantes, o painel evolui para uma operacao mais completa.",
    highlights: [
      "Cardapio, combos e adicionais",
      "Horarios, entrega e retirada",
      "Promocoes e cashback para recompra",
    ],
  },
  vehicles: {
    badge: "Segmento veiculos",
    title: "Painel de estoque automotivo",
    description: "Para loja de carros e motos, com foco em estoque e conversao.",
    highlights: [
      "Estoque com destaque por modelo",
      "Ano, km e ficha do veiculo",
      "Atendimento e visibilidade dos anuncios",
    ],
  },
  fashion: {
    badge: "Segmento moda",
    title: "Painel de catalogo e colecoes",
    description: "Para lojas de roupas e acessorios com foco em variedade e recompra.",
    highlights: [
      "Colecoes, tamanhos e cores",
      "Promocoes e vitrines sazonais",
      "Cashback para fidelizar clientes",
    ],
  },
  electronics: {
    badge: "Segmento eletronicos",
    title: "Painel de vitrine tecnica",
    description: "Para eletronicos e tecnologia, com foco em especificacao e oferta.",
    highlights: [
      "Catalogo com detalhes tecnicos",
      "Promocoes e bundles",
      "Comparacao de itens e destaque rapido",
    ],
  },
};
