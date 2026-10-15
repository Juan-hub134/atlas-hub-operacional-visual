import { useState } from "react";
import { Copy } from "lucide-react";
import { ROLE_OPTIONS } from "../config/roles";
import { gerarConvite } from "../services/authService";
import { ApiError } from "../services/http";
import { ErrorBox } from "../components/Field";

export default function ConvitesPage() {
  const [cargo, setCargo] = useState("membro");
  const [token, setToken] = useState<string | null>(null);
  const [err, setErr] = useState<ApiError | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const selected = ROLE_OPTIONS.find((r) => r.value === cargo);

  async function gerar() {
    setErr(null); setToken(null); setCopied(false); setBusy(true);
    try { setToken((await gerarConvite(cargo)).trim()); }
    catch (e) { setErr(e as ApiError); }
    finally { setBusy(false); }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-petroleo">Convites de cadastro</h1>
      <p>Um convite permite que uma pessoa crie uma conta com o cargo escolhido aqui.</p>
      <div className="rounded-lg bg-white border border-petroleo/20 p-4 space-y-3 max-w-md">
        <label className="block">
          <span className="block text-sm font-medium mb-1">Cargo da pessoa convidada</span>
          <select value={cargo} onChange={(e) => setCargo(e.target.value)} className="w-full rounded-md border border-petroleo/30 bg-white px-3 py-2">
            {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value} disabled={!r.enabled}>{r.label}{r.enabled ? "" : " (indisponível)"}</option>)}
          </select>
        </label>
        {selected && !selected.enabled && <p className="text-sm">{selected.note}</p>}
        <button onClick={gerar} disabled={busy || !selected?.enabled} className="rounded-md bg-petroleo px-4 py-2 text-white disabled:opacity-60">{busy ? "Gerando…" : "Gerar convite"}</button>
        {err && <ErrorBox message={err.message} technical={err.technical} />}
        {token && (
          <div className="rounded-md border border-verde/40 bg-verde/5 p-3 space-y-2">
            <p className="text-sm font-medium">Convite gerado:</p>
            <code className="block break-all text-sm">{token}</code>
            <button onClick={async () => { await navigator.clipboard.writeText(token); setCopied(true); }} className="flex items-center gap-2 rounded-md border border-petroleo/30 px-3 py-1.5 text-sm">
              <Copy size={16} aria-hidden /> {copied ? "Convite copiado" : "Copiar convite"}
            </button>
            <p className="text-xs">Válido por 7 dias. Envie apenas para a pessoa certa.</p>
          </div>
        )}
      </div>
    </section>
  );
}
