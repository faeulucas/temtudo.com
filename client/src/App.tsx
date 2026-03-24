import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect, useMemo } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import MobileBottomNav from "./components/MobileBottomNav";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import MobileTopBar from "./components/MobileTopBar";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CurrentCityProvider } from "./contexts/CurrentCityContext";
import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import ListingDetailPage from "./pages/ListingDetail";
import CategoryPage from "./pages/Category";
import PlansPage from "./pages/Plans";
import AdvertiserDashboard from "./pages/advertiser/Dashboard";
import AdvertiserProfile from "./pages/advertiser/Profile";
import NewListing from "./pages/advertiser/NewListing";
import AdminDashboard from "./pages/admin/Dashboard";
import FavoritesPage from "./pages/Favorites";
import LoginPage from "./pages/Login";
import ResetPasswordPage from "./pages/ResetPassword";
import HowItWorksPage from "./pages/HowItWorks";
import TermsPage from "./pages/Terms";
import PrivacyPage from "./pages/Privacy";
import CityPage from "./pages/City";
import GuidePage from "./pages/Guide";
import StoresPage from "./pages/Stores";
import BoosterPage from "./pages/Booster";
import MyAccountPanel from "./pages/account/MyAccountPanel";
import StorefrontPage from "./pages/Storefront";
import IconsPreview from "./pages/dev/IconsPreview";
import PromotionsPage from "./pages/topics/Promotions";
import DeliveryPage from "./pages/topics/Delivery";
import MarketPage from "./pages/topics/Market";
import ServicesPage from "./pages/topics/Services";
import RealEstatePage from "./pages/topics/RealEstate";
import VehiclesPage from "./pages/topics/Vehicles";
import HealthPage from "./pages/topics/Health";
import EducationPage from "./pages/topics/Education";
import EventsPage from "./pages/topics/Events";
import JobsPage from "./pages/topics/Jobs";

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(to);
  }, [setLocation, to]);
  return null;
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/entrar" component={LoginPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/cadastro" component={LoginPage} />
      <Route path="/redefinir-senha" component={ResetPasswordPage} />
      <Route path="/busca" component={SearchPage} />
      <Route path="/guia" component={GuidePage} />
      <Route path="/lojas" component={StoresPage} />
      <Route path="/loja/:sellerId" component={StorefrontPage} />
      <Route path="/booster" component={BoosterPage} />
      <Route path="/minha-conta" component={MyAccountPanel} />
      <Route path="/anuncio/:id" component={ListingDetailPage} />
      <Route path="/categoria/:slug" component={CategoryPage} />
      <Route path="/cidade/:slug" component={CityPage} />
      <Route path="/planos" component={PlansPage} />
      <Route path="/promocoes" component={PromotionsPage} />
      <Route path="/saude" component={HealthPage} />
      <Route path="/educacao" component={EducationPage} />
      <Route path="/delivery" component={DeliveryPage} />
      <Route path="/mercado" component={MarketPage} />
      <Route path="/servicos" component={ServicesPage} />
      <Route path="/imoveis" component={RealEstatePage} />
      <Route path="/veiculos" component={VehiclesPage} />
      <Route path="/eventos" component={EventsPage} />
      <Route path="/empregos" component={JobsPage} />
      <Route path="/como-funciona" component={HowItWorksPage} />
      <Route path="/termos" component={TermsPage} />
      <Route path="/privacidade" component={PrivacyPage} />
      <Route path="/anunciante" component={AdvertiserDashboard} />
      <Route path="/anunciante/meus-dados" component={AdvertiserProfile} />
      <Route path="/painel" component={() => <Redirect to="/minha-conta" />} />
      <Route path="/cliente" component={MyAccountPanel} />
      <Route path="/painel-anunciante" component={() => <Redirect to="/anunciante" />} />
      <Route path="/anunciante/novo" component={NewListing} />
      <Route path="/anunciante/editar/:id" component={NewListing} />
      <Route path="/anunciar" component={NewListing} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/painel-admin" component={AdminDashboard} />
      <Route path="/favoritos" component={FavoritesPage} />
      <Route path="/dev/icons" component={IconsPreview} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  const hideMobileChrome = useMemo(
    () =>
      location.startsWith("/login") ||
      location.startsWith("/entrar") ||
      location.startsWith("/cadastro") ||
      location.startsWith("/redefinir-senha"),
    [location]
  );

  return (
    <ErrorBoundary>
      <CurrentCityProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <ScrollToTop />
            <Toaster />
            <PwaInstallPrompt />
            {!hideMobileChrome && <MobileTopBar />}
            <Router />
            {!hideMobileChrome && <MobileBottomNav />}
          </TooltipProvider>
        </ThemeProvider>
      </CurrentCityProvider>
    </ErrorBoundary>
  );
}

export default App;
