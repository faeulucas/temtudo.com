import BaseTopicPage from "./BaseTopicPage";

export default function MarketPage() {
  return (
    <BaseTopicPage
      title="Mercado"
      description="Mercados, mercearias e compras do dia a dia num só lugar."
      icon="https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229864/mercado_mklm3p.png?v=2"
      emoji="🛒"
      ctaHref="/busca?q=mercado"
      ctaLabel="Explorar mercados"
    />
  );
}
