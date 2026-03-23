import BaseTopicPage from "./BaseTopicPage";

export default function PromotionsPage() {
  return (
    <BaseTopicPage
      title="Promoções"
      description="Ofertas destacadas, cupons e oportunidades para economizar."
      icon="https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229865/promo%C3%A7oes_mcwevy.png?v=2"
      emoji="🧧"
      ctaHref="/busca?q=promo"
      ctaLabel="Ver promoções"
    />
  );
}
