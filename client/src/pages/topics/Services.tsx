import BaseTopicPage from "./BaseTopicPage";

export default function ServicesPage() {
  return (
    <BaseTopicPage
      title="Serviços"
      description="Prestadores, reparos, manutenção e serviços gerais da sua cidade."
      icon="https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229865/servi%C3%A7os_yvvovd.png?v=2"
      emoji="🛠️"
      ctaHref="/busca?q=servicos"
      ctaLabel="Encontrar serviços"
    />
  );
}
