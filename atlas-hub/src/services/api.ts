import { ENDPOINTS } from "../config/api";
import { ApiError, request } from "./http";

export type Tipo = "receita" | "despesas";
export type Status = "pago" | "pendente";
export interface Movimentacao { tipo: Tipo; valor: number; descricao: string; categoria: string; status: Status }
export interface MovimentacaoResp extends Movimentacao { id: number }
export interface Documento { id: number; titulo: string; tipo: string }
export interface TreinamentoProgresso { area: string; descricao: string; checklist: boolean }

// Métricas: o backend devolve um número; validamos para não mostrar lixo.
export async function metrica(path: string): Promise<number> {
  const t = await request<string>(path);
  const n = Number(t);
  if (t.trim() === "" || Number.isNaN(n)) throw new ApiError("O servidor respondeu um valor inesperado.", null, `Resposta: ${t.slice(0, 60)}`);
  return n;
}
export const METRICAS = {
  entradas: "/api/admin/soma/entradas/financeiras",
  saidas: "/api/admin/soma/saidas/financeiras",
  saldo: "/api/admin/saldo/periodo",
  pendente: "/api/admin/soma/saldo/pendente",
};

export const fin = {
  listar: () => request<MovimentacaoResp[]>("/api/admin/listar/movimentacao/financeira", { as: "json" }),
  atualizar: (id: number, m: Movimentacao) => request(`/api/admin/${id}/atualizar/movimentacao/financeira`, { method: "POST", body: m }),
  excluir: (id: number) => request(`/api/admin/${id}/excluir/movimentacao/financeira`, { method: "POST" }),
  criar: (m: Movimentacao) => {
    if (!ENDPOINTS.registrarMovimentacao) return Promise.reject(new ApiError("Endpoint de criação ainda não confirmado.", null, "ENDPOINTS.registrarMovimentacao = null"));
    return request(ENDPOINTS.registrarMovimentacao, { method: "POST", body: m });
  },
};

export const docs = {
  listar: () => request<Documento[]>("/api/admin/arquivo/lista", { as: "json" }),
  enviar: (titulo: string, tipo: string, file: File) => {
    const f = new FormData(); f.append("titulo", titulo); f.append("tipo", tipo); f.append("file", file);
    return request("/api/admin/upload", { method: "POST", form: f });
  },
  baixar: (id: number) => request<Blob>(`/api/${id}/admin/arquivo/download`, { as: "blob" }),
  remover: (id: number) => request(`/api/${id}/admin/arquivo/remover`), // GET (contrato atual do backend)
};

export const treinamentos = {
  listar: () => request<TreinamentoProgresso[]>("/api/treinamento", { as: "json" }),
  marcar: (area: string, descricao: string, checklist: boolean) =>
    request("/api/treinamento", { method: "POST", body: { area, descricao, checklist } }),
};
