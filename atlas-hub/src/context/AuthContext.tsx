import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "../types";
import { clearSession, getSession, saveToken } from "../services/session";
import { SESSION_EXPIRED_EVENT } from "../services/http";

interface AuthValue {
  session: Session | null;
  signIn: (token: string) => boolean;
  signOut: () => void;
}
const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => getSession());

  const signIn = useCallback((token: string) => {
    const s = saveToken(token);
    setSession(s);
    return s !== null;
  }, []);
  const signOut = useCallback(() => { clearSession(); setSession(null); }, []);

  useEffect(() => {
    const onExpired = () => setSession(null);
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  return <Ctx.Provider value={{ session, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return v;
}
