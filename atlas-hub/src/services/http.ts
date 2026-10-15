import { API_ROOT } from "../config/api";
import { clearSession, getSession } from "./session";

export class ApiError extends Error {
  status: number | null;
  technical: string;
  constructor(message: string, status: number | null, technical: string) {
    super(message);
    this.status = status;
    this.technical = technical;
  }
}

export const SESSION_EXPIRED_EVENT = "atlashub:session-expired";

function friendly(status: number): string {
  if (status === 400) return "Alguns dados estão inválidos. Confira os campos e tente de novo.";
  if (status === 401) return "Sua sessão não é válida ou expirou. Entre novamente.";
  if (status === 403) return "Seu cargo não tem permissão para esta ação. Se precisar dela, fale com um administrador.";
  if (status === 404) return "Não encontramos o item pedido. Ele pode ter sido removido.";
  if (status >= 500) return "O servidor teve um problema ao processar o pedido. Tente novamente em instantes.";
  return "Não foi possível concluir a ação. Tente novamente.";
}

interface Options {
  method?: "GET" | "POST";
  body?: unknown;       // JSON
  form?: FormData;      // multipart: NÃO definimos Content-Type, o navegador coloca o boundary
  auth?: boolean;       // padrão: true
  as?: "text" | "json" | "blob";
}

export async function request<T = string>(path: string, opt: Options = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opt.auth !== false) {
    const s = getSession();
    if (s) headers.Authorization = `Bearer ${s.token}`;
  }
  let body: BodyInit | undefined;
  if (opt.form) body = opt.form;
  else if (opt.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opt.body);
  }

  let res: Response;
  try {
    res = await fetch(`${API_ROOT}${path}`, { method: opt.method ?? "GET", headers, body });
  } catch (e) {
    throw new ApiError(
      "Não conseguimos falar com o servidor. O backend local pode estar desligado ou inacessível (confira se está rodando e se o endereço em VITE_API_URL está certo).",
      null,
      String(e)
    );
  }

  if (!res.ok) {
    if (res.status === 401 && opt.auth !== false) {
      clearSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    throw new ApiError(friendly(res.status), res.status, `HTTP ${res.status} em ${path}`);
  }

  if (opt.as === "json") return (await res.json()) as T;
  if (opt.as === "blob") return (await res.blob()) as T;
  return (await res.text()) as T; // login e convite devolvem texto simples
}
