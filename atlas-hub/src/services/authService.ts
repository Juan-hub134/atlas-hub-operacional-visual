import { ENDPOINTS } from "../config/api";
import type { CadastroRequest, ConviteRequest, LoginRequest } from "../types";
import { request } from "./http";

// A resposta do login é o JWT em TEXTO, não { token }.
export const login = (data: LoginRequest) =>
  request<string>(ENDPOINTS.login, { method: "POST", body: data, auth: false });

export const cadastrar = (data: CadastroRequest) =>
  request<string>(ENDPOINTS.cadastro, { method: "POST", body: data, auth: false });

// Resposta: UUID do convite em texto.
export const gerarConvite = (tipoRegistro: string) =>
  request<string>(ENDPOINTS.gerarConvite, { method: "POST", body: { tipoRegistro } satisfies ConviteRequest });
