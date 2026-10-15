// VITE_API_URL deve conter somente a origem do backend, sem /atlashub.
// Em desenvolvimento, o proxy do Vite encaminha /atlashub para o backend.
const apiOrigin = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
export const API_ROOT = import.meta.env.DEV ? "/atlashub" : `${apiOrigin}/atlashub`;

// Todos os caminhos documentados ficam aqui. Nada de URL espalhada pelos componentes.
export const ENDPOINTS = {
  login: "/api/login",
  cadastro: "/api/cadastro",
  gerarConvite: "/api/admin/registro",
  registrarMovimentacao: "/api/admin/registrar/movimentacao/financeira",
} as const;
