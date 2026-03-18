import type { InsertUser, User } from "../../drizzle/schema";

const DEV_LOCAL_AUTH_SEED = 1000;

let nextLocalUserId = DEV_LOCAL_AUTH_SEED;

const localUsersByOpenId = new Map<string, User>();
const localUsersByEmail = new Map<string, User>();

function toDate(value: Date | null | undefined, fallback: Date) {
  return value ?? fallback;
}

function createBaseUser(input: InsertUser & { id?: number }): User {
  const now = new Date();

  return {
    id: input.id ?? nextLocalUserId++,
    openId: input.openId,
    name: input.name ?? null,
    email: input.email ?? null,
    passwordHash: input.passwordHash ?? null,
    loginMethod: input.loginMethod ?? null,
    role: input.role ?? "user",
    phone: input.phone ?? null,
    whatsapp: input.whatsapp ?? null,
    avatar: input.avatar ?? null,
    bannerUrl: input.bannerUrl ?? null,
    bio: input.bio ?? null,
    openingHoursJson: input.openingHoursJson ?? null,
    personType: input.personType ?? "pf",
    cpfCnpj: input.cpfCnpj ?? null,
    companyName: input.companyName ?? null,
    cityId: input.cityId ?? null,
    neighborhood: input.neighborhood ?? null,
    planId: input.planId ?? null,
    planExpiresAt: input.planExpiresAt ?? null,
    trialStartedAt: input.trialStartedAt ?? null,
    trialUsed: input.trialUsed ?? false,
    isVerified: input.isVerified ?? false,
    isBanned: input.isBanned ?? false,
    createdAt: toDate(input.createdAt, now),
    updatedAt: toDate(input.updatedAt, now),
    lastSignedIn: toDate(input.lastSignedIn, now),
  };
}

function persistUser(user: User) {
  localUsersByOpenId.set(user.openId, user);

  if (user.email) {
    localUsersByEmail.set(user.email.toLowerCase(), user);
  }

  return user;
}

export function findLocalUserByEmail(email: string) {
  return localUsersByEmail.get(email.trim().toLowerCase());
}

export function findLocalUserByOpenId(openId: string) {
  return localUsersByOpenId.get(openId);
}

export function createLocalUser(input: InsertUser) {
  return persistUser(createBaseUser(input));
}

export function upsertLocalUser(input: InsertUser) {
  const existing = findLocalUserByOpenId(input.openId);

  if (!existing) {
    return createLocalUser(input);
  }

  const updated: User = {
    ...existing,
    ...input,
    id: existing.id,
    openId: existing.openId,
    email: input.email ?? existing.email,
    updatedAt: input.updatedAt ?? new Date(),
    lastSignedIn: input.lastSignedIn ?? existing.lastSignedIn,
  };

  if (existing.email && existing.email !== updated.email) {
    localUsersByEmail.delete(existing.email.toLowerCase());
  }

  return persistUser(updated);
}

export function sanitizeUser(user: User) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}
