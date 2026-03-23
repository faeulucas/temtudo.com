import BaseTopicPage from "./BaseTopicPage";

export default function EventsPage() {
  return (
    <BaseTopicPage
      title="Eventos"
      description="Agenda local, shows, feiras e atrações próximas de você."
      icon="https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229866/eventos_fmc6ux.png?v=2"
      emoji="📅"
      ctaHref="/busca?q=eventos"
      ctaLabel="Ver eventos"
    />
  );
}
