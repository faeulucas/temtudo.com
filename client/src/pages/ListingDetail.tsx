import { useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  MapPin, Phone, MessageCircle, Heart, Share2, Eye, Clock, BadgeCheck,
  ChevronLeft, ChevronRight, Zap, Star, Flag, ArrowLeft
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);

  const { data: listing, isLoading } = trpc.public.listingById.useQuery({ id: Number(id) });
  const favMutation = trpc.advertiser.toggleFavorite.useMutation({
    onSuccess: (data) => toast.success(data.favorited ? "Adicionado aos favoritos!" : "Removido dos favoritos"),
  });

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-200 rounded-2xl" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-gray-700 mb-4">Anúncio não encontrado</h2>
        <Link href="/busca"><Button className="bg-brand-gradient text-white rounded-xl">Ver outros anúncios</Button></Link>
      </div>
    </div>
  );

  const images = listing.images || [];
  const formatPrice = () => {
    if (!listing.price || listing.priceType === "free") return "Grátis";
    if (listing.priceType === "on_request") return "Sob consulta";
    if (listing.priceType === "negotiable") return `R$ ${Number(listing.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (negociável)`;
    return `R$ ${Number(listing.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  const whatsappUrl = listing.whatsapp
    ? `https://wa.me/55${listing.whatsapp.replace(/\D/g, "")}?text=Olá! Vi seu anúncio "${listing.title}" no Norte Vivo e tenho interesse.`
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/busca" className="hover:text-blue-600">Anúncios</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium truncate">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-[16/10] bg-gray-100">
                {images.length > 0 ? (
                  <img
                    src={images[currentImage]?.url}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="text-blue-300 text-8xl font-black font-display">
                      {listing.title.charAt(0)}
                    </div>
                  </div>
                )}

                {/* Badges */}
                {listing.isBoosted && (
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-1 bg-amber-400 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                      <Zap className="w-4 h-4" /> DESTAQUE
                    </span>
                  </div>
                )}

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage(i => Math.max(0, i - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImage(i => Math.min(images.length - 1, i + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setCurrentImage(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? "bg-white w-4" : "bg-white/60"}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)} className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === currentImage ? "border-blue-500" : "border-transparent"}`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                  <div className="text-3xl font-black" style={{ color: "oklch(0.48 0.22 255)" }}>
                    {formatPrice()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { if (isAuthenticated) favMutation.mutate({ listingId: listing.id }); else toast.info("Faça login para favoritar"); }}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copiado!"); }}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 mb-6 text-sm text-gray-500">
                {listing.neighborhood && (
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{listing.neighborhood}</span>
                )}
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{listing.viewCount} visualizações</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true, locale: ptBR })}
                </span>
              </div>

              {/* Description */}
              {listing.description && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Seller + Contact */}
          <div className="space-y-4">
            {/* Contact card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              {/* Seller */}
              {listing.seller && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center text-white text-xl font-black">
                    {listing.seller.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-900">{listing.seller.name || "Anunciante"}</span>
                      {listing.seller.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                    </div>
                    <p className="text-xs text-gray-500">
                      Membro desde {new Date(listing.seller.createdAt).getFullYear()}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact buttons */}
              <div className="space-y-3">
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl py-6 text-base">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Chamar no WhatsApp
                    </Button>
                  </a>
                )}
                <Button variant="outline" className="w-full rounded-xl py-6 border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold text-base">
                  <Phone className="w-5 h-5 mr-2" />
                  Ver Telefone
                </Button>
              </div>

              {/* Safety tip */}
              <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-700 font-medium">
                  ⚠️ Nunca pague antecipado. Prefira negociar pessoalmente ou via WhatsApp.
                </p>
              </div>

              {/* Report */}
              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors mt-4 mx-auto">
                <Flag className="w-3 h-3" /> Denunciar anúncio
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
