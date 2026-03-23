import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

type BaseTopicPageProps = {
  title: string;
  description: string;
  icon?: string;
  emoji?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function BaseTopicPage({
  title,
  description,
  icon,
  emoji = "✨",
  ctaHref = "/busca",
  ctaLabel = "Explorar",
}: BaseTopicPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="container max-w-5xl py-8 sm:py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            {icon ? (
              <img src={icon} alt={title} className="h-12 w-12 rounded-2xl object-contain" loading="lazy" />
            ) : (
              <span className="text-3xl">{emoji}</span>
            )}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">Guia do tema</p>
              <h1 className="font-display text-3xl font-black text-slate-900 sm:text-4xl">{title}</h1>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={ctaHref}>
              <a className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800">
                {ctaLabel}
              </a>
            </Link>
            <Link href="/">
              <a className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Voltar para home
              </a>
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Área para conteúdo dedicado deste tema (ofertas, destaques, FAQs, listas curadas).
            <br />
            Podemos integrar listagem filtrada, banners ou textos específicos aqui.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
