import BaseTopicPage from "./BaseTopicPage";

export default function DeliveryPage() {
  return (
    <BaseTopicPage
      title="Delivery"
      description="Peça comida e produtos com entrega rápida na sua região."
      icon="https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229863/delivery_dh1ldp.png?v=2"
      emoji="🍽️"
      ctaHref="/busca?type=food"
      ctaLabel="Ver delivery"
    />
  );
}
