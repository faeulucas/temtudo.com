import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context helpers
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function createUserContext(overrides?: Partial<TrpcContext["user"]>): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user-001",
      name: "Test User",
      email: "test@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      ...overrides,
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return createUserContext({ role: "admin", openId: "admin-001" });
}

describe("Norte Vivo — Marketplace Routes", () => {
  // ─── Public routes ──────────────────────────────────────────────────────────
  describe("public.cities", () => {
    it("returns a list (array)", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.public.cities();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("public.categories", () => {
    it("returns a list (array)", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.public.categories();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("public.plans", () => {
    it("returns a list (array)", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.public.plans();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("public.featuredListings", () => {
    it("returns an array with limit", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.public.featuredListings({ limit: 5 });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(5);
    });
  });

  describe("public.recentListings", () => {
    it("returns an array with limit", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.public.recentListings({ limit: 8 });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(8);
    });
  });

  describe("public.searchListings", () => {
    it("returns items and total", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.public.searchListings({ q: "test", limit: 10, page: 1 });
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.items)).toBe(true);
    });
  });

  // ─── Auth routes ─────────────────────────────────────────────────────────────
  describe("auth.me", () => {
    it("returns null for unauthenticated user", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.auth.me();
      expect(result).toBeNull();
    });

    it("returns user for authenticated user", async () => {
      const caller = appRouter.createCaller(createUserContext());
      const result = await caller.auth.me();
      expect(result).not.toBeNull();
      expect(result?.openId).toBe("test-user-001");
    });
  });

  describe("auth.logout", () => {
    it("clears cookie and returns success", async () => {
      const clearedCookies: string[] = [];
      const ctx: TrpcContext = {
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: { clearCookie: (name: string) => clearedCookies.push(name) } as TrpcContext["res"],
      };
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.logout();
      expect(result.success).toBe(true);
    });
  });

  // ─── Advertiser routes (protected) ──────────────────────────────────────────
  describe("advertiser.stats", () => {
    it("returns stats object for authenticated user", async () => {
      const caller = appRouter.createCaller(createUserContext());
      const result = await caller.advertiser.stats();
      expect(result).toHaveProperty("totalListings");
      expect(result).toHaveProperty("totalViews");
      expect(result).toHaveProperty("totalContacts");
      expect(result).toHaveProperty("activeBoosters");
      expect(result).toHaveProperty("listings");
    });
  });

  // ─── Admin routes (admin only) ───────────────────────────────────────────────
  describe("admin.stats", () => {
    it("returns admin stats for admin user", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.admin.stats();
      expect(result).toHaveProperty("totalUsers");
      expect(result).toHaveProperty("totalListings");
      expect(result).toHaveProperty("activeBoosters");
    });

    it("throws FORBIDDEN for regular user", async () => {
      const caller = appRouter.createCaller(createUserContext());
      await expect(caller.admin.stats()).rejects.toThrow();
    });
  });

  describe("admin.allUsers", () => {
    it("returns users array for admin", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.admin.allUsers({});
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
