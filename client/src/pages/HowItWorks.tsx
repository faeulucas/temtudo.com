import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle, Search, TrendingUp, UserPlus, Zap } from "lucide-react";
import { Link } from "wouter";

const STEPS = [
  {
    icon: UserPlus,
    title: "Crie sua conta",
    description: "Entre com sua conta para acessar favoritos, painel e cadastro de anúncios.",
  },
  {
    icon: Zap,
    title: "Publique seu anúncio",
    description: "Preencha título, categoria, preço, localização e fotos para colocar seu negócio no ar.",
  },
  {
    icon: Search,
    title: "Seja encontrado",
    description: "Seu anúncio aparece na busca, nas categorias e nas páginas regionais do site.",
  },
  {
    icon: TrendingUp,
    title: "Ganhe destaque",
    description: "Ative o Booster para melhorar visibilidade e aumentar os contatos.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-10">
        <section className="rounded-[28px] bg-white p-8 shadow-sm">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Como funciona
            </p>
            <h1 className="mt-3 font-display text-4xl font-black text-gray-900">
              Entenda o fluxo do Norte Vivo
            </h1>
            <p className="mt-4 text-gray-500">
              O foco da plataforma é aproximar compradores e anunciantes do Norte Pioneiro com um processo simples e direto.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-black text-gray-300">0{index + 1}</span>
                </div>
                <h2 className="font-display text-xl font-bold text-gray-900">{step.title}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-500">{step.description}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-[28px] bg-blue-950 p-8 text-white shadow-xl">
          <h2 className="font-display text-2xl font-black">Boas práticas para vender melhor</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              "Use fotos nítidas e uma capa forte",
              "Defina preço claro ou marque como negociável",
              "Escreva uma descrição objetiva e completa",
              "Mantenha seu WhatsApp atualizado",
            ].map(item => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                <CheckCircle className="h-5 w-5 text-emerald-300" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/anunciar">
              <Button className="rounded-2xl bg-white px-6 py-6 font-bold text-blue-900 hover:bg-blue-50">
                Publicar meu anúncio
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
