import { getLoginUrl, hasOAuthConfig } from "@/const";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle, LogIn, Shield, Zap } from "lucide-react";

const BENEFITS = [
  "Publique seus anúncios em poucos minutos",
  "Gerencie favoritos, contatos e painel do anunciante",
  "Acompanhe desempenho e destaque com Booster",
];

export default function LoginPage() {
  const loginUrl = getLoginUrl();
  const oauthReady = hasOAuthConfig();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-10">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] bg-hero-gradient p-8 text-white shadow-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
              <Shield className="h-4 w-4" />
              Acesso seguro
            </div>
            <h1 className="font-display text-4xl font-black leading-tight">
              Entre no Norte Vivo
            </h1>
            <p className="mt-4 max-w-2xl text-blue-100">
              Use sua conta para anunciar, favoritar, acompanhar resultados e acessar os recursos da plataforma.
            </p>

            <div className="mt-8 space-y-3">
              {BENEFITS.map(item => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <CheckCircle className="h-5 w-5 text-emerald-300" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white">
              <LogIn className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900">
              Login e cadastro
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              O acesso é feito por autenticação externa. Após o login, você volta automaticamente para o site.
            </p>

            <div className="mt-6 space-y-3">
              <a href={oauthReady ? loginUrl : "#"}>
                <Button
                  className="w-full rounded-2xl bg-brand-gradient py-6 text-base font-bold text-white hover:opacity-90"
                  disabled={!oauthReady}
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Entrar ou criar conta
                </Button>
              </a>
              <a href="/anunciar">
                <Button variant="outline" className="w-full rounded-2xl py-6 text-base font-semibold">
                  <Zap className="mr-2 h-5 w-5" />
                  Quero anunciar
                </Button>
              </a>
            </div>

            {!oauthReady && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                As variáveis de autenticação ainda não foram configuradas neste ambiente.
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
