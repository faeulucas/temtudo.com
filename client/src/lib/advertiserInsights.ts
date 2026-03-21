type DashboardListing = {
  id: number;
  title: string;
  description?: string | null;
  createdAt: string | Date;
  status?: string | null;
  isBoosted?: boolean | null;
  viewCount?: number | null;
  contactCount?: number | null;
  favoriteCount?: number | null;
};

export type AdvertiserInsight = {
  id: string;
  tone: "blue" | "amber" | "emerald";
  title: string;
  description: string;
  actionLabel: string;
  listingId?: number;
  durationDays?: number;
};

function ageInDays(createdAt: string | Date) {
  const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
}

export function getAdvertiserInsights(listings: DashboardListing[]): AdvertiserInsight[] {
  const activeListings = listings.filter(listing => listing.status === "active");
  
  // Usar um Map para encontrar a primeira correspondência para cada tipo de insight em uma única passagem (O(N)).
  // Isso é mais eficiente do que múltiplos loops .find() (O(K*N)).
  const insightsMap = new Map<string, AdvertiserInsight>();

  for (const listing of activeListings) {
    // Para de procurar quando um insight de cada tipo for encontrado
    if (insightsMap.size === 4) break;

    const days = ageInDays(listing.createdAt);
    const views = listing.viewCount ?? 0;
    const contacts = listing.contactCount ?? 0;
    const descriptionLength = listing.description?.trim().length ?? 0;

    // 1. Anúncio estagnado
    if (!insightsMap.has("stale") && days >= 10 && contacts === 0) {
      insightsMap.set("stale", {
        id: `stale-${listing.id}`,
        tone: "amber",
        title: "Esse anuncio pode precisar de revisao",
        description: `${listing.title} ja esta no ar ha ${days} dias sem novos contatos. Atualizar titulo, preco ou fotos pode ajudar.`,
        actionLabel: "Revisar anuncio",
        listingId: listing.id,
      });
    }

    // 2. Alta visualização, poucos contatos
    if (!insightsMap.has("conversion") && views >= 25 && contacts <= 1) {
      insightsMap.set("conversion", {
        id: `conversion-${listing.id}`,
        tone: "blue",
        title: "Muita visualizacao e pouca conversa",
        description: `${listing.title} chamou atencao, mas quase nao gerou contato. Pode ser um bom momento para revisar preco e descricao.`,
        actionLabel: "Ajustar detalhes",
        listingId: listing.id,
      });
    }

    // 3. Descrição curta
    if (!insightsMap.has("description") && descriptionLength > 0 && descriptionLength < 60) {
      insightsMap.set("description", {
        id: `description-${listing.id}`,
        tone: "emerald",
        title: "Descricao curta demais",
        description: `${listing.title} pode vender melhor com mais detalhes sobre estado, diferenciais ou condicoes.`,
        actionLabel: "Melhorar descricao",
        listingId: listing.id,
      });
    }

    // 4. Candidato a Booster
    if (!insightsMap.has("boost") && !listing.isBoosted && views >= 8) {
      insightsMap.set("boost", {
        id: `boost-${listing.id}`,
        tone: "blue",
        title: "Esse item tem potencial para um booster",
        description: `${listing.title} ja esta chamando atencao. Um impulsionamento de 24h pode aumentar o alcance agora.`,
        actionLabel: "Impulsionar 24h",
        listingId: listing.id,
        durationDays: 1,
      });
    }
  }

  // Monta o array de insights na ordem de prioridade
  const insights: AdvertiserInsight[] = [];
  if (insightsMap.has("stale")) insights.push(insightsMap.get("stale")!);
  if (insightsMap.has("conversion")) insights.push(insightsMap.get("conversion")!);
  if (insightsMap.has("description")) insights.push(insightsMap.get("description")!);
  if (insightsMap.has("boost")) insights.push(insightsMap.get("boost")!);

  if (insights.length === 0 && activeListings.length > 0) {
    insights.push({
      id: "healthy-account",
      tone: "emerald",
      title: "Seus anuncios estao com boa base",
      description: "Continue renovando fotos, atualizando preco e ativando booster so nos itens com mais potencial.",
      actionLabel: "Ver anuncios",
    });
  }

  return insights.slice(0, 3);
}
