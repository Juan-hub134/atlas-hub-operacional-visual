import { useState, type FormEvent } from "react";
import { ENDPOINTS } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useLoad } from "../hooks/useLoad";
import { fin, type Movimentacao, type MovimentacaoResp, type Status, type Tipo } from "../services/api";
import type { ApiError } from "../services/http";
import { brl } from "../utils/format";
import { Confirm, Dialog, Load, btn, btnGhost, input } from "../components/ui";
import { ErrorBox } from "../components/Field";

const TIPOS: { v: Tipo; l: string }[] = [{ v: "receita", l: "Receita" }, { v: "despesas", l: "Despesa" }];
const STATUS: { v: Status; l: string }[] = [{ v: "pago", l: "Pago" }, { v: "pendente", l: "Pendente" }];
const label = (list: { v: string; l: string }[], v: string) => list.find((x) => x.v === v)?.l ?? v;
const empty = { tipo: "" as Tipo | "", valor: "", descricao: "", categoria: "", status: "" as Status | "" };

export default function FinanceiroPage() {
  const admin = useAuth().session?.scope === "admin";
  const { data, error, loading, reload } = useLoad(fin.listar);
  const [fTipo, setFTipo] = useState(""); const [fStatus, setFStatus] = useState(""); const [q, setQ] = useState("");
  const [edit, setEdit] = useState<{ id: number | null } | null>(null);
  const [form, setForm] = useState(empty);
  const [del, setDel] = useState<MovimentacaoResp | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ m: string; t?: string } | null>(null);
  const [ok, setOk] = useState("");
  const canCreate = Boolean(ENDPOINTS.registrarMovimentacao);

  const rows = (data ?? []).filter((m) => (!fTipo || m.tipo === fTipo) && (!fStatus || m.status === fStatus) && m.descricao.toLowerCase().includes(q.toLowerCase()));

  function open(m?: MovimentacaoResp) {
    setErr(null); setOk("");
    setForm(m ? { tipo: m.tipo, valor: String(m.valor), descricao: m.descricao, categoria: m.categoria, status: m.status } : empty);
    setEdit({ id: m?.id ?? null });
  }
  async function save(e: FormEvent) {
    e.preventDefault(); setErr(null);
    const valor = Number(form.valor.replace(",", "."));
    if (!form.tipo || !form.status || !form.descricao.trim() || !form.categoria.trim() || !(valor > 0))
      return setErr({ m: "Preencha todos os campos. O valor precisa ser maior que zero (ex.: 150,00)." });
    const body: Movimentacao = { tipo: form.tipo, valor, descricao: form.descricao.trim(), categoria: form.categoria.trim(), status: form.status };
    setBusy(true);
    try {
      if (edit?.id == null) await fin.criar(body); else await fin.atualizar(edit.id, body);
      setOk(edit?.id == null ? "Movimentação registrada." : "Movimentação atualizada."); setEdit(null); reload();
    } catch (x) { const a = x as ApiError; setErr({ m: a.message, t: a.technical }); } finally { setBusy(false); }
  }
  async function remove() {
    if (!del) return; setBusy(true);
    try { await fin.excluir(del.id); setOk("Movimentação excluída."); setDel(null); reload(); }
    catch (x) { const a = x as ApiError; setErr({ m: a.message, t: a.technical }); setDel(null); } finally { setBusy(false); }
  }
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold text-petroleo">Financeiro</h1>
        {admin && <button className={btn} disabled={!canCreate} onClick={() => open()}>Registrar movimentação</button>}
      </div>
      {admin && !canCreate && <p className="rounded-md border border-ambar/60 bg-ambar/10 p-3 text-sm">Registrar movimentação está desativado porque a rota de criação não foi configurada em <code>src/config/api.ts</code>.</p>}
      {ok && <p role="status" className="rounded-md border border-verde/40 bg-verde/10 p-2 text-sm">{ok}</p>}
      {err && !edit && <ErrorBox message={err.m} technical={err.t} />}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm">Buscar por descrição<input className={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex.: projeto" /></label>
        <label className="text-sm">Tipo<select className={input} value={fTipo} onChange={(e) => setFTipo(e.target.value)}><option value="">Todos</option>{TIPOS.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}</select></label>
        <label className="text-sm">Status<select className={input} value={fStatus} onChange={(e) => setFStatus(e.target.value)}><option value="">Todos</option>{STATUS.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}</select></label>
      </div>
      <Load loading={loading} error={error} onRetry={reload}>
        {rows.length === 0 ? <p>{data?.length ? "Nenhuma movimentação com esses filtros." : "Nenhuma movimentação registrada."}</p> : (
          <div className="overflow-x-auto rounded-lg border border-petroleo/20 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-fundo"><tr><th className="p-2">Tipo</th><th className="p-2">Descrição</th><th className="p-2">Categoria</th><th className="p-2">Valor</th><th className="p-2">Status</th>{admin && <th className="p-2">Ações</th>}</tr></thead>
              <tbody>{rows.map((m) => (
                <tr key={m.id} className="border-t border-petroleo/10">
                  <td className="p-2">{label(TIPOS, m.tipo)}</td><td className="p-2">{m.descricao}</td><td className="p-2">{m.categoria}</td>
                  <td className="p-2 whitespace-nowrap">{m.tipo === "despesas" ? "− " : "+ "}{brl(m.valor)}</td>
                  <td className="p-2">{label(STATUS, m.status)}</td>
                  {admin && <td className="flex gap-2 p-2"><button className={btnGhost} onClick={() => open(m)}>Editar</button><button className={btnGhost} onClick={() => setDel(m)}>Excluir</button></td>}
                </tr>))}</tbody>
            </table>
          </div>
        )}
      </Load>
      <Dialog open={!!edit} title={edit?.id == null ? "Registrar movimentação" : "Editar movimentação"} onClose={() => setEdit(null)}>
        <form onSubmit={save} className="space-y-3">
          <label className="block text-sm">Tipo<select className={input} value={form.tipo} onChange={set("tipo")}><option value="">Selecione</option>{TIPOS.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}</select></label>
          <label className="block text-sm">Valor (R$)<input className={input} inputMode="decimal" placeholder="150,00" value={form.valor} onChange={set("valor")} /></label>
          <label className="block text-sm">Descrição<input className={input} placeholder="Ex.: Pagamento de projeto" value={form.descricao} onChange={set("descricao")} /></label>
          <label className="block text-sm">Categoria<input className={input} placeholder="Ex.: Projeto" value={form.categoria} onChange={set("categoria")} /></label>
          <label className="block text-sm">Status<select className={input} value={form.status} onChange={set("status")}><option value="">Selecione</option>{STATUS.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}</select></label>
          {err && <ErrorBox message={err.m} technical={err.t} />}
          <div className="flex justify-end gap-2"><button type="button" className={btnGhost} onClick={() => setEdit(null)}>Cancelar</button><button className={btn} disabled={busy}>{busy ? "Salvando…" : "Salvar movimentação"}</button></div>
        </form>
      </Dialog>
      <Confirm open={!!del} title="Excluir movimentação?" text={del ? `Será excluída: ${del.descricao} (${brl(del.valor)}). Essa ação não pode ser desfeita.` : ""} action="Excluir movimentação" busy={busy} onYes={remove} onNo={() => setDel(null)} />
    </section>
  );
}
