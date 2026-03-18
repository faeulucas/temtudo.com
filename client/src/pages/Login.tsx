import { useState } from "react";
import { Link, useLocation } from "wouter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import {
  HelpCircle,
  LogIn,
  Mail,
  UserPlus,
  ShieldCheck,
  Store,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type Mode = "login" | "register";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [personType, setPersonType] = useState<"pf" | "pj">("pf");
  const [whatsapp, setWhatsapp] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/anunciante");
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/anunciante");
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const isPending = loginMutation.isPending || registerMutation.isPending;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (mode === "register") {
      await registerMutation.mutateAsync({
        name,
        email,
        password,
        personType,
        whatsapp: whatsapp || undefined,
        cpfCnpj: cpfCnpj || undefined,
        companyName: personType === "pj" ? companyName || undefined : undefined,
      });
      return;
    }

    await loginMutation.mutateAsync({
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
      <Header />

      <main className="container py-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_50%,#f97316_130%)] p-6 text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)] sm:p-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4" />
                Acesso ao Norte Vivo
              </div>

              <h1 className="mt-4 font-display text-3xl font-black leading-tight sm:text-5xl">
                {mode === "login"
                  ? "Entre na sua conta e continue vendendo com mais facilidade."
                  : "Crie sua conta e comece a anunciar hoje mesmo."}
              </h1>

              <p className="mt-4 text-sm leading-7 text-blue-50/90 sm:text-lg">
                {mode === "login"
                  ? "Acesse seu painel, acompanhe seus anúncios, favoritos e contatos dentro do Norte Vivo."
                  : "Cadastre-se para publicar anúncios, criar sua presença no portal e começar a aparecer para novos clientes."}
              </p>

              <div className="mt-8 grid gap-4">
                <article className="rounded-[24px] bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        Sua vitrine dentro da plataforma
                      </p>
                      <p className="mt-1 text-sm leading-6 text-blue-50/85">
                        Anuncie produtos, serviços ou crie presença digital para
                        sua loja local.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-[24px] bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        Mais controle e mais segurança
                      </p>
                      <p className="mt-1 text-sm leading-6 text-blue-50/85">
                        Gerencie seus dados, contatos e anúncios em um painel mais
                        organizado.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-[24px] bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        Entre para vender ou descobrir
                      </p>
                      <p className="mt-1 text-sm leading-6 text-blue-50/85">
                        A conta também ajuda o usuário a salvar favoritos e acompanhar
                        novidades do portal.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="px-5 pb-8 pt-8 sm:px-8">
              <div className="mx-auto max-w-md text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                  {mode === "login" ? "Entrar" : "Criar conta"}
                </p>

                <h2 className="mt-3 font-display text-3xl font-black leading-tight text-slate-900">
                  {mode === "login"
                    ? "Acesse sua conta"
                    : "Cadastre-se no Norte Vivo"}
                </h2>

                <p className="mt-3 text-base leading-7 text-slate-500">
                  {mode === "login"
                    ? "Entre para acessar seu painel, anúncios e contatos."
                    : "Crie sua conta para publicar anúncios, gerenciar sua loja e crescer no portal."}
                </p>
              </div>

              {mode === "login" && (
                <>
                  <div className="mt-8 flex items-center justify-center gap-5">
                    <button
                      type="button"
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-bold text-slate-700 shadow-sm transition-transform hover:-translate-y-0.5"
                      aria-label="Entrar com Google em breve"
                      title="Entrar com Google em breve"
                    >
                      G
                    </button>

                    <button
                      type="button"
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1877F2] text-3xl font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
                      aria-label="Entrar com Facebook em breve"
                      title="Entrar com Facebook em breve"
                    >
                      f
                    </button>
                  </div>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-sm font-medium text-slate-400">
                      Ou continue com email
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                </>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                {mode === "register" && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                          Tipo de cadastro
                        </label>
                        <Select
                          value={personType}
                          onValueChange={(value) => setPersonType(value as "pf" | "pj")}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pf">Pessoa física</SelectItem>
                            <SelectItem value="pj">Pessoa jurídica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                          WhatsApp
                        </label>
                        <Input
                          value={whatsapp}
                          onChange={(event) => setWhatsapp(event.target.value)}
                          placeholder="(43) 99999-9999"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                        {personType === "pj" ? "Nome do responsável" : "Nome"}
                      </label>
                      <Input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder={
                          personType === "pj"
                            ? "Nome do responsável"
                            : "Seu nome completo"
                        }
                        required
                      />
                    </div>

                    {personType === "pj" && (
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                          Empresa
                        </label>
                        <Input
                          value={companyName}
                          onChange={(event) => setCompanyName(event.target.value)}
                          placeholder="Nome fantasia ou razão social"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                        {personType === "pj" ? "CNPJ" : "CPF"}
                      </label>
                      <Input
                        value={cpfCnpj}
                        onChange={(event) => setCpfCnpj(event.target.value)}
                        placeholder={
                          personType === "pj"
                            ? "00.000.000/0000-00"
                            : "000.000.000-00"
                        }
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Senha
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    minLength={6}
                    required
                  />

                  {mode === "login" && (
                    <div className="mt-2 text-right">
                      <Link
                        href="/redefinir-senha"
                        className="text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-full bg-orange-500 py-6 text-base font-bold text-white hover:bg-orange-600"
                  disabled={isPending}
                >
                  {mode === "login" ? (
                    <LogIn className="mr-2 h-5 w-5" />
                  ) : (
                    <UserPlus className="mr-2 h-5 w-5" />
                  )}
                  {isPending
                    ? "Processando..."
                    : mode === "login"
                    ? "Acessar"
                    : "Criar conta"}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-slate-500">
                {mode === "login" ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                >
                  {mode === "login" ? "Cadastre-se" : "Entrar"}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-center sm:px-8">
              <Link
                href="/redefinir-senha"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                <HelpCircle className="h-4 w-4" />
                Preciso de ajuda
              </Link>
            </div>

            <div className="border-t border-slate-200 px-5 py-4 text-center text-xs leading-5 text-slate-400 sm:px-8">
              Ao continuar, você concorda com os Termos de Uso e a Política de
              Privacidade do Norte Vivo.
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}