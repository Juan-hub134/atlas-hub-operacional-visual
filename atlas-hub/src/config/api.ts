// VITE_API_URL pode sobrescrever a origem do backend em cada ambiente.
const apiOrigin = (import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? "http://localhost:8080" : "https://hub-operacional-atlas.onrender.com"
)).replace(/\/+$/, "");
export const API_ROOT = import.meta.env.DEV ? "/atlashub" : `${apiOrigin}/atlashub`;

// Todos os caminhos documentados ficam aqui. Nada de URL espalhada pelos componentes.
export const ENDPOINTS = {
  login: "/api/login",
  cadastro: "/api/cadastro",
  gerarConvite: "/api/admin/registro",
  registrarMovimentacao: "/api/admin/registrar/movimentacao/financeira",
} as const;
