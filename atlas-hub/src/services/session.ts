import type { Session } from "../types";

// ATENÇÃO: sessionStorage é uma solução TEMPORÁRIA para desenvolvimento local.
// Não é garantia de segurança para produção (qualquer XSS lê o token).
// Senhas NUNCA são guardadas. A autoridade real de acesso é o backend.
const KEY = "atlashub.token";

function decode(token: string): Session | null {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const p = JSON.parse(atob(part));
    if (!p.sub || !p.exp) return null;
    return { token, sub: String(p.sub), scope: String(p.scope ?? ""), exp: Number(p.exp) };
  } catch {
    return null;
  }
}

export function saveToken(token: string): Session | null {
  const s = decode(token.trim());
  if (s) sessionStorage.setItem(KEY, s.token);
  return s;
}

export function getSession(): Session | null {
  const t = sessionStorage.getItem(KEY);
  const s = t ? decode(t) : null;
  if (!s || s.exp * 1000 <= Date.now()) {
    sessionStorage.removeItem(KEY);
    return null;
  }
  return s;
}

export const clearSession = () => sessionStorage.removeItem(KEY);
