import CityCategoryTemplate from "./CityCategoryTemplate";

export default function ServicesPage() {
  return (
    <CityCategoryTemplate
      eyebrow="Serviços"
      title="Serviços e profissionais locais"
      copy="Profissionais e prestadores que atendem sua cidade."
      categorySlug="servicos-gerais"
      searchTerm="servicos"
      type="service"
    />
  );
}
