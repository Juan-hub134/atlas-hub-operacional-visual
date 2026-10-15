import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useLoad } from "../hooks/useLoad";
import { docs, type Documento } from "../services/api";
import type { ApiError } from "../services/http";
import { Confirm, Load, btn, btnGhost, input } from "../components/ui";
import { ErrorBox } from "../components/Field";

const TIPOS_DOCUMENTO = [
  { value: "PDF (.pdf)", label: "PDF (.pdf)" },
  { value: "Word (.doc, .docx)", label: "Word (.doc, .docx)" },
  { value: "OpenDocument texto (.odt)", label: "OpenDocument texto (.odt)" },
  { value: "Excel (.xls, .xlsx)", label: "Excel (.xls, .xlsx)" },
  { value: "Planilha CSV (.csv)", label: "Planilha CSV (.csv)" },
  { value: "OpenDocument planilha (.ods)", label: "OpenDocument planilha (.ods)" },
  { value: "PowerPoint (.ppt, .pptx)", label: "PowerPoint (.ppt, .pptx)" },
  { value: "OpenDocument apresentação (.odp)", label: "OpenDocument apresentação (.odp)" },
  { value: "Texto (.txt, .rtf, .md)", label: "Texto (.txt, .rtf, .md)" },
  { value: "Imagem JPEG (.jpg, .jpeg)", label: "Imagem JPEG (.jpg, .jpeg)" },
  { value: "Imagem PNG (.png)", label: "Imagem PNG (.png)" },
  { value: "Imagem GIF (.gif)", label: "Imagem GIF (.gif)" },
  { value: "Imagem WebP (.webp)", label: "Imagem WebP (.webp)" },
  { value: "Imagem SVG (.svg)", label: "Imagem SVG (.svg)" },
  { value: "JSON (.json)", label: "JSON (.json)" },
  { value: "XML (.xml)", label: "XML (.xml)" },
  { value: "Arquivo ZIP (.zip)", label: "Arquivo ZIP (.zip)" },
];
const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.odt,.xls,.xlsx,.csv,.ods,.ppt,.pptx,.odp,.txt,.rtf,.md,.jpg,.jpeg,.png,.gif,.webp,.svg,.json,.xml,.zip";

export default function DocumentosPage() {
  const admin = useAuth().session?.scope === "admin";
  const { data, error, loading, reload } = useLoad(docs.listar);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [tipoOutro, setTipoOutro] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string; tech?: string } | null>(null);
  const [del, setDel] = useState<Documento | null>(null);

  const fail = (e: unknown) => { const a = e as ApiError; setMsg({ ok: false, t: a.message, tech: a.technical }); };

  async function upload(e: FormEvent) {
    e.preventDefault(); setMsg(null);
    const tipoFinal = tipo === "Outro" ? tipoOutro.trim() : tipo;
    if (!titulo.trim() || !tipoFinal || !file) return setMsg({ ok: false, t: "Preencha título, tipo e escolha um arquivo." });
    setBusy(true);
    try { await docs.enviar(titulo.trim(), tipoFinal, file); setMsg({ ok: true, t: "Documento enviado." }); setTitulo(""); setTipo(""); setTipoOutro(""); setFile(null); (e.target as HTMLFormElement).reset(); reload(); }
    catch (x) { fail(x); } finally { setBusy(false); }
  }
  async function baixar(d: Documento) {
    setMsg(null);
    try {
      const blob = await docs.baixar(d.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = d.titulo; a.click(); URL.revokeObjectURL(url);
    } catch (x) { fail(x); }
  }
  async function remover() {
    if (!del) return; setBusy(true);
    try { await docs.remover(del.id); setMsg({ ok: true, t: "Documento excluído." }); setDel(null); reload(); }
    catch (x) { fail(x); setDel(null); } finally { setBusy(false); }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-petroleo">Documentos</h1>
      {msg && (msg.ok ? <p role="status" className="rounded-md border border-verde/40 bg-verde/10 p-2 text-sm">{msg.t}</p> : <ErrorBox message={msg.t} technical={msg.tech} />)}
      {admin && (
        <form onSubmit={upload} className="grid gap-3 rounded-lg border border-petroleo/20 bg-white p-4 sm:grid-cols-2">
          <label className="text-sm">Título do documento<input className={input} placeholder="Ex.: Estatuto da empresa" value={titulo} onChange={(e) => setTitulo(e.target.value)} /></label>
          <label className="text-sm">Tipo de arquivo
            <select className={input} value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="">Selecione o formato</option>
              {TIPOS_DOCUMENTO.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              <option value="Outro">Outro (informar extensão ou formato)</option>
            </select>
          </label>
          {tipo === "Outro" && (
            <label className="text-sm">Informe o formato<input className={input} placeholder="Ex.: .dwg ou Contrato" value={tipoOutro} onChange={(e) => setTipoOutro(e.target.value)} /></label>
          )}
          <label className="text-sm sm:col-span-2">Arquivo
            <input type="file" accept={ACCEPTED_EXTENSIONS} className={input} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <span className="mt-1 block text-xs text-texto/70">Formatos comuns: documentos, planilhas, apresentações, imagens, JSON, XML e ZIP. Use “Outro” para outro formato.</span>
          </label>
          <div className="sm:col-span-2"><button className={btn} disabled={busy}>{busy ? "Enviando…" : "Enviar documento"}</button></div>
        </form>
      )}
      <Load loading={loading} error={error} onRetry={reload}>
        {data && data.length === 0 ? <p>Nenhum documento ainda.{admin && " Envie o primeiro no formulário acima."}</p> : (
          <div className="overflow-x-auto rounded-lg border border-petroleo/20 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-fundo"><tr><th className="p-2">Título</th><th className="p-2">Tipo</th><th className="p-2">Ações</th></tr></thead>
              <tbody>{data?.map((d) => (
                <tr key={d.id} className="border-t border-petroleo/10">
                  <td className="p-2">{d.titulo}</td><td className="p-2">{d.tipo}</td>
                  <td className="flex gap-2 p-2">
                    <button className={btnGhost} onClick={() => baixar(d)}>Baixar documento</button>
                    {admin && <button className={btnGhost} onClick={() => setDel(d)}>Excluir documento</button>}
                  </td>
                </tr>))}</tbody>
            </table>
          </div>
        )}
      </Load>
      <Confirm open={!!del} title="Excluir documento?" text={`O documento "${del?.titulo}" será removido. Essa ação não pode ser desfeita.`} action="Excluir documento" busy={busy} onYes={remover} onNo={() => setDel(null)} />
    </section>
  );
}
