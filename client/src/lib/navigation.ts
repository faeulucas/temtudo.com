export function advertiserHref(path: string, isAuthenticated: boolean): string {
  const target = path.startsWith("/") ? path : `/${path}`;
  return isAuthenticated
    ? target
    : `/login?redirect=${encodeURIComponent(target)}`;
}
