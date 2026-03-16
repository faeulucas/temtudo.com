import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { LOGIN_ROUTE } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Plus,
  Search,
  Settings,
  Shield,
  User,
  X,
  Zap,
} from "lucide-react";

interface HeaderProps {
  selectedCity?: number | null;
  onCityChange?: (cityId: number | null) => void;
  onSearch?: (q: string) => void;
}

export default function Header({
  selectedCity,
  onCityChange,
  onSearch,
}: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [searchQ, setSearchQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName =
    user?.personType === "pj"
      ? user?.companyName || user?.name || "Loja"
      : user?.name || "Usuario";
  const displayInitial = displayName.charAt(0)?.toUpperCase() || "U";

  const { data: cities } = trpc.public.cities.useQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQ);
    else navigate(`/busca?q=${encodeURIComponent(searchQ)}`);
  };

  return (
    <header className="sticky top-0 z-50 max-w-full overflow-x-clip border-b border-gray-100 bg-white shadow-md">
      <div className="hidden bg-brand-gradient px-4 py-1.5 text-center text-[11px] font-medium text-white sm:block sm:text-xs">
        Encontre lojas, servicos, produtos e negocios perto de voce no portal
        local do Norte Pioneiro.
      </div>

      <div className="container">
        <div className="hidden items-center gap-2 py-3 sm:flex sm:gap-3">
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-xl font-black text-gray-900">
                Norte
              </span>
              <span
                className="font-display text-xl font-black"
                style={{ color: "oklch(0.68 0.19 45)" }}
              >
                Vivo
              </span>
            </div>
          </Link>

          <div className="hidden shrink-0 items-center gap-1 text-sm text-gray-600 md:flex">
            <MapPin className="h-4 w-4 text-blue-600" />
            <Select
              value={selectedCity ? String(selectedCity) : "all"}
              onValueChange={v =>
                onCityChange?.(v === "all" ? null : Number(v))
              }
            >
              <SelectTrigger className="h-auto w-[140px] border-0 p-0 text-sm font-medium text-gray-700 shadow-none focus:ring-0">
                <SelectValue placeholder="Todas as cidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cities?.map(city => (
                  <SelectItem key={city.id} value={String(city.id)}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <form onSubmit={handleSearch} className="min-w-0 max-w-2xl flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Buscar lojas, produtos, servicos, imoveis..."
                className="w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-20 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 sm:pr-24"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-brand-gradient px-2.5 py-1.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-90 sm:px-3 sm:text-xs"
              >
                Buscar
              </button>
            </div>
          </form>

          <div className="flex shrink-0 items-center gap-2">
            <Link href={isAuthenticated ? "/anunciante/novo" : LOGIN_ROUTE}>
              <Button className="hidden items-center gap-1.5 rounded-xl bg-orange-gradient px-4 font-bold text-white shadow-md hover:opacity-90 sm:flex">
                <Plus className="h-4 w-4" />
                Anunciar
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/favoritos">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-red-500"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-brand-gradient text-sm font-bold text-white">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          displayInitial
                        )}
                      </div>
                      <ChevronDown className="hidden h-3 w-3 text-gray-500 sm:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/anunciante")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Meu Painel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/anunciante/meus-dados")}
                    >
                      <Settings className="mr-2 h-4 w-4" /> Meus dados
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/favoritos")}>
                      <Heart className="mr-2 h-4 w-4" /> Favoritos
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Shield className="mr-2 h-4 w-4" /> Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href={LOGIN_ROUTE}>
                <Button
                  variant="outline"
                  className="hidden items-center gap-1.5 rounded-xl border-blue-200 font-semibold text-blue-700 hover:bg-blue-50 sm:flex"
                >
                  <User className="h-4 w-4" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-3 py-3 sm:hidden">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex min-w-0 items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-gradient shadow-md">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-black leading-none text-gray-900">
                  Norte
                  <span style={{ color: "oklch(0.68 0.19 45)" }}>Vivo</span>
                </p>
                <p className="text-[11px] font-medium text-gray-500">
                  Guia, lojas e marketplace
                </p>
              </div>
            </Link>

            <div className="ml-auto flex items-center gap-2">
              <Select
                value={selectedCity ? String(selectedCity) : "all"}
                onValueChange={v =>
                  onCityChange?.(v === "all" ? null : Number(v))
                }
              >
                <SelectTrigger className="h-10 max-w-[140px] rounded-2xl border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 shadow-none">
                  <MapPin className="mr-1 h-4 w-4 text-blue-600" />
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cities?.map(city => (
                    <SelectItem key={city.id} value={String(city.id)}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                type="button"
                onClick={() => navigate(isAuthenticated ? "/anunciante" : LOGIN_ROUTE)}
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
              </button>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-2xl border border-slate-200 bg-slate-50"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="O que voce procura no Norte Pioneiro?"
                className="h-12 w-full rounded-[20px] border border-slate-200 bg-slate-50 py-3 pl-11 pr-24 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-2xl bg-brand-gradient px-4 py-2 text-xs font-semibold text-white"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>

      {mobileOpen && (
        <div className="space-y-3 border-t border-gray-100 bg-white px-4 py-4 sm:hidden">
          <Link href={isAuthenticated ? "/anunciante/novo" : LOGIN_ROUTE}>
            <Button className="w-full rounded-xl bg-orange-gradient font-bold text-white">
              <Plus className="mr-2 h-4 w-4" /> Anunciar gratis
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/anunciante">
                <Button variant="outline" className="w-full rounded-xl">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Abrir painel
                </Button>
              </Link>
              <Link href="/favoritos">
                <Button variant="outline" className="w-full rounded-xl">
                  <Heart className="mr-2 h-4 w-4" /> Favoritos
                </Button>
              </Link>
            </>
          ) : (
            <Link href={LOGIN_ROUTE}>
              <Button variant="outline" className="w-full rounded-xl">
                <User className="mr-2 h-4 w-4" /> Entrar / Cadastrar
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
