import type { HomeHighlightListing } from "./types";

export function parseHomeExtraData(value?: string | null) {
  if (!value) return {} as Record<string, string>;
  try {
    return JSON.parse(value) as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
}

export function isServiceProviderListing(item: HomeHighlightListing, categoryName?: string) {
  const haystack = [categoryName, item.subcategory, item.title]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return item.whatsapp != null || item.seller?.whatsapp != null
    ? item.title.toLowerCase().includes("serv") ||
        haystack.includes("serv") ||
        haystack.includes("oficina") ||
        haystack.includes("manut") ||
        haystack.includes("assist") ||
        haystack.includes("instal") ||
        haystack.includes("tecnico") ||
        haystack.includes("eletric") ||
        haystack.includes("encan") ||
        haystack.includes("limpeza") ||
        haystack.includes("delivery") ||
        haystack.includes("saude") ||
        haystack.includes("beleza")
    : false;
}

export function isFoodListing(item: HomeHighlightListing) {
  const haystack = [item.title, item.subcategory]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    item.type === "food" ||
    haystack.includes("lanche") ||
    haystack.includes("pizza") ||
    haystack.includes("hamb") ||
    haystack.includes("hamburguer") ||
    haystack.includes("hamburger") ||
    haystack.includes("espet") ||
    haystack.includes("pastel") ||
    haystack.includes("marmita") ||
    haystack.includes("porcao") ||
    haystack.includes("combo") ||
    haystack.includes("acai") ||
    haystack.includes("coxinha") ||
    haystack.includes("hot dog") ||
    haystack.includes("cachorro") ||
    haystack.includes("batata") ||
    haystack.includes("refeicao") ||
    haystack.includes("prato")
  );
}

export function isJobListing(item: HomeHighlightListing, categoryName?: string) {
  const haystack = [item.title, item.subcategory, categoryName]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    item.type === "job" ||
    haystack.includes("vaga") ||
    haystack.includes("emprego") ||
    haystack.includes("contrata") ||
    haystack.includes("freela") ||
    haystack.includes("diarista") ||
    haystack.includes("estagio")
  );
}

export function isEventListing(item: HomeHighlightListing, categoryName?: string) {
  const haystack = [item.title, item.subcategory, categoryName]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    haystack.includes("evento") ||
    haystack.includes("show") ||
    haystack.includes("feira") ||
    haystack.includes("festival") ||
    haystack.includes("rodeio") ||
    haystack.includes("festa") ||
    haystack.includes("encontro")
  );
}

export function formatListingPrice(price?: string | null, priceType?: string | null) {
  if (!price || priceType === "free") return "Grátis";
  if (priceType === "on_request") return "Sob consulta";

  const formatted = `R$ ${Number(price).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;

  if (priceType === "negotiable") return formatted;

  return formatted;
}

export function getPriceTypeLabel(priceType?: string | null) {
  if (priceType === "negotiable") return "Negociável";
  if (priceType === "on_request") return "Sob consulta";
  if (priceType === "free") return "Grátis";
  return "Preço fixo";
}
