import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Search,
  TrendingUp,
  UserPlus,
  Zap,
  Sparkles,
  Store,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";

const STEPS = [
  {
    icon: UserPlus,
    title: "Crie sua conta",
    description:
      "Entre com sua conta para acessar favoritos, painel e cadastro de anúncios.",
  },
  {
    icon: Zap,
    title: "Publique seu anúncio",
    description:
      "Preencha título, categoria, preço, localização e fotos para colocar seu negócio no ar.",
  },
  {
    icon: Search,
    title: "Seja encontrado",
    description:
      "Seu anúncio aparece na busca, nas categorias e nas páginas regionais do site.",
  },
  {
    icon: TrendingUp,
    title: "Ganhe destaque",
    description:
      "Ative o Booster para melhorar visibilidade e aumentar os contatos.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
      <Header />

      <main className="container py-10">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_50%,#f97316_130%)] p-8 text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)] sm:p-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
              <Sparkles className="h-4 w-4" />
              Como funciona o Norte Vivo
            </div>

            <h1 className="mt-4 font-display text-4xl font-black sm:text-5xl">
              Entenda como anunciar, aparecer e crescer dentro da plataforma.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-blue-50/90 sm:text-lg">
              O foco do Norte Vivo é aproximar compradores, anunciantes, lojas e
              serviços locais com um processo simples, direto e pensado para a
              realidade da região.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/anunciar">
                <Button className="h-12 rounded-2xl bg-white px-6 text-slate-900 hover:bg-slate-100">
                  Publicar meu anúncio
                </Button>
              </Link>

              <Link href="/planos">
                <Button className="h-12 rounded-2xl bg-white/10 px-6 text-white hover:bg-white/15">
                  Ver planos
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-orange-50 p-3 text-orange-600">
              <Store className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Simples de usar
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Entre, publique e comece a aparecer
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              A ideia é facilitar o cadastro para quem vende produto, serviço ou
              quer divulgar a própria loja.
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Clareza
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              O usuário entende rápido o valor da plataforma
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Aqui ele descobre como funciona o anúncio, a busca, o destaque e a
              geração de contatos.
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Resultado
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Mais visibilidade para quem quer vender
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Quanto melhor o anúncio e maior o destaque, maior a chance de gerar
              clique, contato e venda.
            </p>
          </article>
        </section>

        <section className="mt-10">
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              Passo a passo
            </p>
            <h2 className="mt-2 font-display text-3xl font-black text-slate-900">
              O fluxo do Norte Vivo em 4 etapas
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              O objetivo é fazer a pessoa entrar rápido, publicar com facilidade e
              ser encontrada na região.
            </p>
          </div>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-black text-slate-300">
                      0{index + 1}
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-bold text-slate-900">
                    {step.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </section>
        </section>

        <section className="mt-10 rounded-[28px] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Boas práticas
            </p>
            <h2 className="mt-2 font-display text-3xl font-black text-slate-900">
              Como vender melhor dentro do portal
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Não basta publicar. O anúncio precisa chamar atenção e passar
              confiança.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Use fotos nítidas e uma capa forte",
              "Defina preço claro ou marque como negociável",
              "Escreva uma descrição objetiva e completa",
              "Mantenha seu WhatsApp atualizado",
              "Escolha a categoria certa para aparecer melhor",
              "Use destaque quando quiser acelerar resultados",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3"
              >
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#f97316_140%)] p-6 text-white shadow-[0_22px_70px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">
                Pronto para começar?
              </p>
              <h2 className="mt-3 font-display text-3xl font-black">
                Publique seu anúncio e comece a aparecer na região.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-200 sm:text-base">
                O Norte Vivo foi feito para simplificar a presença digital de
                quem vende, presta serviço ou quer divulgar uma loja local.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[340px]">
              <Link href="/anunciar">
                <Button className="h-12 w-full rounded-2xl bg-white px-6 font-bold text-slate-900 hover:bg-slate-100">
                  Publicar anúncio
                </Button>
              </Link>

              <Link href="/planos">
                <Button className="h-12 w-full rounded-2xl bg-orange-500 px-6 font-bold text-white hover:bg-orange-600">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Ver planos
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}