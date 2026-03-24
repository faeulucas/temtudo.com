import CityCategoryTemplate from "./CityCategoryTemplate";

export default function VehiclesPage() {
  return (
    <CityCategoryTemplate
      eyebrow="Veículos"
      title="Veículos e lojas da sua cidade"
      copy="Carros, motos e revendas que atendem sua região."
      categorySlug="veiculos"
      searchTerm="veiculos"
      type="vehicle"
    />
  );
}
