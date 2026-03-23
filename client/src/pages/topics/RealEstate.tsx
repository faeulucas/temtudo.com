import BaseTopicPage from "./BaseTopicPage";

export default function RealEstatePage() {
  return (
    <BaseTopicPage
      title="Imóveis"
      description="Casas, apartamentos, terrenos e oportunidades imobiliárias."
      icon="https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229864/im%C3%B3veis_bqgzqe.png?v=2"
      emoji="🏡"
      ctaHref="/busca?type=property"
      ctaLabel="Ver imóveis"
    />
  );
}
