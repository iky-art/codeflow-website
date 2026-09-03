export function withSecurityHeaders(headers: Record<string, string> = {}): Record<string, string> {
  return {
    ...headers,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    // CSP intentionally left loose during active development (Phase 3-12);
    // tightened in Phase 13 — Security & Performance, once all asset
    // sources (fonts, etc.) are finalized.
  };
}

export function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  const body = status < 400 ? { data } : { error: data };
  return new Response(JSON.stringify(body), {
    status,
    headers: withSecurityHeaders({ "Content-Type": "application/json", ...extraHeaders }),
  });
}

export function noContent(extraHeaders: Record<string, string> = {}): Response {
  return new Response(null, { status: 204, headers: withSecurityHeaders(extraHeaders) });
}
