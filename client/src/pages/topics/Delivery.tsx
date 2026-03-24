import CityCategoryTemplate from "./CityCategoryTemplate";

export default function DeliveryPage() {
  return (
    <CityCategoryTemplate
      eyebrow="Entrega na sua cidade"
      title="Delivery perto de você"
      copy="Restaurantes, lanchonetes e comércios que entregam onde você está."
      categorySlug="delivery"
      searchTerm="delivery"
      type="food"
    />
  );
}
