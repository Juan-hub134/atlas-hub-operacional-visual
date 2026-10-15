// Development uses the Vite proxy; production uses the Vercel rewrite to the Render API.
export const API_ROOT = "/atlashub";

// Todos os caminhos documentados ficam aqui. Nada de URL espalhada pelos componentes.
export const ENDPOINTS = {
  login: "/api/login",
  cadastro: "/api/cadastro",
  gerarConvite: "/api/admin/registro",
  registrarMovimentacao: "/api/admin/registrar/movimentacao/financeira",
} as const;
