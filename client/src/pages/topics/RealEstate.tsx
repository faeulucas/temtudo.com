import CityCategoryTemplate from "./CityCategoryTemplate";

export default function RealEstatePage() {
  return (
    <CityCategoryTemplate
      eyebrow="Imóveis"
      title="Imóveis na sua cidade"
      copy="Casas, apartamentos e terrenos disponíveis perto de você."
      categorySlug="imoveis"
      searchTerm="imovel"
      type="property"
    />
  );
}
