import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { LOGIN_ROUTE } from "./const";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});

// Base URL da API: obrigatória em produção
const apiBaseUrlRaw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
console.log("[tRPC] VITE_API_BASE_URL:", apiBaseUrlRaw ?? "<undefined>");

if (import.meta.env.PROD && !apiBaseUrlRaw) {
  throw new Error(
    "[API] VITE_API_BASE_URL não definida em produção. Configure a URL pública do backend (Railway) no Vercel."
  );
}

const apiBaseUrl = apiBaseUrlRaw ? apiBaseUrlRaw.replace(/\/+$/, "") : "";
const trpcEndpoint = `${apiBaseUrl || ""}/api/trpc`;
console.log("[tRPC] Endpoint configurado:", trpcEndpoint);

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;
  if (!isUnauthorized) return;

  window.location.href = LOGIN_ROUTE;
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

// ---------------------------------------------------------------------------
// Service Worker hygiene (evita PWA servir versão antiga, sem matar PWA)
// ---------------------------------------------------------------------------
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker
    .getRegistrations()
    .then(registrations => {
      registrations.forEach(reg => {
        // Pede atualização do SW; evita unregister para não quebrar PWA
        reg.update().catch(() => {
          /* ignore update errors */
        });
      });
    })
    .catch(() => {
      /* ignore SW errors */
    });
}

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      // Em produção não há fallback: sempre usa o Railway
      url: trpcEndpoint,
      transformer: superjson,
      async fetch(input, init) {
        // Debug: loga URL efetiva da requisição
        if (typeof input === "string") {
          console.log("[tRPC fetch] input:", input);
        } else if (input instanceof Request) {
          console.log("[tRPC fetch] input (Request.url):", input.url);
        } else {
          console.log("[tRPC fetch] input (URL):", input.toString());
        }
        const response = await globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
          // Garantir que cookies sejam enviados em ambiente cross-site
          headers: {
            ...(init?.headers ?? {}),
            "x-requested-with": "trpc-client",
          },
        });

        const contentType = response.headers.get("content-type") ?? "";
        const isJson = contentType.includes("application/json");

        if (!isJson) {
          const preview = await response.text();
          console.error(
            `[API] Resposta não-JSON. status=${response.status} content-type=${contentType} body=${preview.slice(
              0,
              300
            )}`
          );
          throw new TRPCClientError(
            `Resposta não-JSON do servidor (status ${response.status}). Verifique a URL da API.`
          );
        }

        return response;
      },
    }),
  ],
});

// PWA desativado temporariamente para evitar SW interferindo em rotas/API
// Remova este bloco comentado quando estabilizar a estratégia de cache e liberar PWA.
// if ("serviceWorker" in navigator && import.meta.env.PROD) {
//   window.addEventListener("load", () => {
//     let refreshing = false;
//
//     navigator.serviceWorker.addEventListener("controllerchange", () => {
//      if (refreshing) return;
//       refreshing = true;
//       window.location.reload();
//     });
//
//     navigator.serviceWorker
//       .register("/sw.js")
//       .then(registration => {
//         registration.update().catch(error => {
//           console.warn("[PWA] Service worker update check failed:", error);
//         });
//
//         registration.addEventListener("updatefound", () => {
//           const newWorker = registration.installing;
//           if (!newWorker) return;
//
//           newWorker.addEventListener("statechange", () => {
//             if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
//               newWorker.postMessage({ type: "SKIP_WAITING" });
//             }
//           });
//         });
//       })
//       .catch(error => {
//         console.warn("[PWA] Service worker registration failed:", error);
//       });
//   });
// }

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
