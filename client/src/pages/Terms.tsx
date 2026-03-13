import Footer from "@/components/Footer";
import Header from "@/components/Header";

const sections = [
  {
    title: "Uso da plataforma",
    body: "O Norte Vivo conecta usuários, anunciantes e negócios regionais. O conteúdo publicado é de responsabilidade de quem anuncia.",
  },
  {
    title: "Responsabilidade dos anúncios",
    body: "O anunciante deve fornecer informações verdadeiras, manter dados de contato atualizados e respeitar a legislação aplicável ao seu produto ou serviço.",
  },
  {
    title: "Condutas proibidas",
    body: "Não é permitido publicar conteúdo ilegal, enganoso, ofensivo, fraudulento ou que infrinja direitos de terceiros.",
  },
  {
    title: "Moderação",
    body: "O Norte Vivo pode remover anúncios, suspender contas e limitar acessos quando houver indícios de abuso, fraude ou violação destes termos.",
  },
  {
    title: "Planos e destaques",
    body: "Recursos pagos como planos ou boosters podem ter regras próprias de duração, renovação e entrega, informadas na contratação.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-10">
        <section className="rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Legal</p>
          <h1 className="mt-3 font-display text-4xl font-black text-gray-900">Termos de Uso</h1>
          <p className="mt-4 max-w-3xl text-gray-500">
            Este texto estabelece as regras gerais para uso da plataforma. Antes do lançamento público, vale revisar juridicamente a versão final.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          {sections.map(section => (
            <article key={section.title} className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-gray-900">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{section.body}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
