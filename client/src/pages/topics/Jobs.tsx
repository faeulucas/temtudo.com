import BaseTopicPage from "./BaseTopicPage";

export default function JobsPage() {
  return (
    <BaseTopicPage
      title="Empregos"
      description="Vagas locais, oportunidades e networking profissional."
      icon="https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229867/emprego_trjdqa.png?v=2"
      emoji="💼"
      ctaHref="/busca?type=job"
      ctaLabel="Ver vagas"
    />
  );
}
