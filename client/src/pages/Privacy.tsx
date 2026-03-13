import Footer from "@/components/Footer";
import Header from "@/components/Header";

const sections = [
  {
    title: "Dados coletados",
    body: "A plataforma pode coletar dados de cadastro, autenticação, anúncios publicados, interações e métricas de uso.",
  },
  {
    title: "Finalidade",
    body: "Os dados são usados para autenticação, funcionamento do painel, exibição de anúncios, comunicação com usuários e melhoria da experiência.",
  },
  {
    title: "Compartilhamento",
    body: "Dados públicos do anúncio podem ser exibidos a visitantes. Dados sensíveis devem ser tratados com acesso restrito e finalidade específica.",
  },
  {
    title: "Cookies e sessão",
    body: "A plataforma usa cookies de sessão para manter login e proteger áreas autenticadas.",
  },
  {
    title: "Revisão futura",
    body: "Antes do deploy público, a política final deve ser revisada para aderência às práticas reais de armazenamento, analytics e autenticação.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-10">
        <section className="rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Legal</p>
          <h1 className="mt-3 font-display text-4xl font-black text-gray-900">Política de Privacidade</h1>
          <p className="mt-4 max-w-3xl text-gray-500">
            Este conteúdo define uma base de privacidade para o projeto. A versão final deve refletir exatamente os serviços usados em produção.
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
