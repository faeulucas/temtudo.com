import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CitySource = "manual" | "profile" | "geo" | "ip" | "default";

type CurrentCityContextValue = {
  cityId: number | null;
  city: { id: number; name: string; state?: string | null; slug?: string | null } | null;
  source: CitySource | null;
  status: "resolving" | "ready";
  setCityId: (cityId: number | null) => void;
  refreshDetection: () => Promise<void>;
};

const MANUAL_CITY_KEY = "nv.manualCityId";
const DETECTED_CITY_KEY = "nv.detectedCityId";

const CurrentCityContext = createContext<CurrentCityContextValue | undefined>(undefined);

function normalize(value?: string | null) {
  if (!value) return "";
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

async function reverseGeocodeCity(
  coords: GeolocationCoordinates,
  availableCities: { id: number; name: string }[]
): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=pt`
    );
    const data = (await response.json()) as { city?: string; locality?: string; principalSubdivision?: string };
    const candidate = normalize(data.city || data.locality);
    if (!candidate) return null;
    const match = availableCities.find((city) => normalize(city.name) === candidate);
    return match?.id ?? null;
  } catch {
    return null;
  }
}

async function detectCityByIp(
  availableCities: { id: number; name: string }[]
): Promise<number | null> {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = (await response.json()) as { city?: string };
    const candidate = normalize(data.city);
    if (!candidate) return null;
    const match = availableCities.find((city) => normalize(city.name) === candidate);
    return match?.id ?? null;
  } catch {
    return null;
  }
}

export function CurrentCityProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { data: cities } = trpc.public.cities.useQuery();

  const [manualCityId, setManualCityId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem(MANUAL_CITY_KEY);
    return stored ? Number(stored) : null;
  });

  const [detectedCityId, setDetectedCityId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem(DETECTED_CITY_KEY);
    return stored ? Number(stored) : null;
  });

  const [cityId, setCityIdState] = useState<number | null>(null);
  const [source, setSource] = useState<CitySource | null>(null);
  const [status, setStatus] = useState<"resolving" | "ready">("resolving");

  const applyCity = useCallback((nextId: number | null, nextSource: CitySource) => {
    setCityIdState(nextId);
    setSource(nextSource);
    setStatus("ready");
  }, []);

  useEffect(() => {
    if (!cities?.length) return;

    let isMounted = true;

    const resolve = async () => {
      setStatus("resolving");

      if (manualCityId && isMounted) {
        applyCity(manualCityId, "manual");
        return;
      }

      if (user?.cityId && isMounted) {
        applyCity(user.cityId, "profile");
        return;
      }

      if (detectedCityId && isMounted) {
        applyCity(detectedCityId, "geo");
        return;
      }

      if (typeof window !== "undefined" && "geolocation" in navigator) {
        try {
          const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => resolve(position.coords),
              (err) => reject(err),
              { timeout: 3000, maximumAge: 5 * 60 * 1000 }
            );
          });
          const geoMatch = await reverseGeocodeCity(coords, cities);
          if (geoMatch && isMounted) {
            window.localStorage.setItem(DETECTED_CITY_KEY, String(geoMatch));
            applyCity(geoMatch, "geo");
            return;
          }
        } catch {
          // ignore and try IP fallback
        }
      }

      const ipMatch = await detectCityByIp(cities);
      if (ipMatch && isMounted) {
        window.localStorage.setItem(DETECTED_CITY_KEY, String(ipMatch));
        applyCity(ipMatch, "ip");
        return;
      }

      if (isMounted) {
        applyCity(cities[0]?.id ?? null, "default");
      }
    };

    void resolve();

    return () => {
      isMounted = false;
    };
  }, [applyCity, cities, detectedCityId, manualCityId, user?.cityId]);

  const handleSetCityId = useCallback(
    (nextId: number | null) => {
      if (typeof window !== "undefined") {
        if (nextId) {
          window.localStorage.setItem(MANUAL_CITY_KEY, String(nextId));
        } else {
          window.localStorage.removeItem(MANUAL_CITY_KEY);
        }
      }
      setManualCityId(nextId);
      applyCity(nextId, "manual");
    },
    [applyCity]
  );

  const refreshDetection = useCallback(async () => {
    setDetectedCityId(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DETECTED_CITY_KEY);
    }
    setStatus("resolving");
  }, []);

  const city = useMemo(
    () => cities?.find((item) => item.id === cityId) ?? null,
    [cities, cityId]
  );

  const value = useMemo(
    () => ({
      cityId,
      city,
      source,
      status,
      setCityId: handleSetCityId,
      refreshDetection,
    }),
    [cityId, city, source, status, handleSetCityId, refreshDetection]
  );

  return <CurrentCityContext.Provider value={value}>{children}</CurrentCityContext.Provider>;
}

export function useCurrentCity() {
  const ctx = useContext(CurrentCityContext);
  if (!ctx) {
    throw new Error("useCurrentCity must be used within CurrentCityProvider");
  }
  return ctx;
}
