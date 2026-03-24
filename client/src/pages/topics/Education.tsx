import CityCategoryTemplate from "./CityCategoryTemplate";

export default function EducationPage() {
  return (
    <CityCategoryTemplate
      eyebrow="Educação"
      title="Educação na sua cidade"
      copy="Escolas, cursos, professores e serviços educacionais da cidade atual."
      searchTerm="educacao"
      type="service"
    />
  );
}
