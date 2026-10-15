import { useEffect, useState } from "react";
import { TRACKS } from "../config/topics";
import { treinamentos } from "../services/api";
import { ErrorBox } from "../components/Field";
import type { ApiError } from "../services/http";
import { btnGhost } from "../components/ui";

export default function TreinamentosPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<ApiError | null>(null);
  const [loadError, setLoadError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressLoaded, setProgressLoaded] = useState(false);

  async function loadProgress() {
    setLoading(true);
    setLoadError(null);
    try {
      const progress = await treinamentos.listar();
      setDone(Object.fromEntries(
        progress.map(({ area, descricao, checklist }) => [`${area}|${descricao}`, checklist])
      ));
      setProgressLoaded(true);
    } catch (e) {
      setLoadError(e as ApiError);
      setProgressLoaded(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProgress();
  }, []);

  async function toggle(area: string, name: string) {
    const key = `${area}|${name}`;
    if (busy || loading || !progressLoaded) return;
    setBusy(key); setErr(null);
    try {
      await treinamentos.marcar(area, name, !done[key]);
      setDone((d) => ({ ...d, [key]: !d[key] }));
    } catch (e) { setErr(e as ApiError); }
    finally { setBusy(null); }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-petroleo">Treinamentos</h1>
      <p className="rounded-md border border-ambar/60 bg-ambar/10 p-3 text-sm">
        Marque os conteúdos conforme concluir. Seu progresso é carregado e salvo pela API para o membro autenticado.
      </p>
      {loadError && <ErrorBox message={loadError.message} technical={loadError.technical} />}
      {err && <ErrorBox message={err.message} technical={err.technical} />}
      {loading && <p role="status" className="text-sm">Carregando progresso salvo…</p>}
      {busy && <p role="status" className="text-sm">Salvando progresso…</p>}
      {loadError && !loading && (
        <button type="button" className={btnGhost} onClick={() => void loadProgress()}>
          Tentar carregar novamente
        </button>
      )}
      <div className="space-y-8">
        {TRACKS.map((t) => {
          const topicCount = t.groups.reduce((count, group) => count + group.topics.length, 0);
          const completedCount = t.groups.reduce((count, group) =>
            count + group.topics.filter((topic) => done[`${t.area}|${topic.name}`]).length, 0);
          const progress = topicCount ? Math.round((completedCount / topicCount) * 100) : 0;

          return (
            <section key={t.area} aria-labelledby={`track-${t.area}`} className="space-y-4">
              <header className="rounded-lg border border-petroleo/20 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 id={`track-${t.area}`} className="text-xl font-semibold text-petroleo">Trilha de {t.area}</h2>
                    <p className="mt-1 text-sm">{t.project}</p>
                    <p className="mt-1 text-xs text-texto/70"><strong>Tecnologias:</strong> {t.stack}</p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-medium">{completedCount}/{topicCount} concluídos</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-petroleo/10" role="progressbar"
                  aria-label={`Progresso da trilha de ${t.area}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                  <div className="h-full rounded-full bg-verde transition-all" style={{ width: `${progress}%` }} />
                </div>
              </header>
              <div className="grid gap-4 lg:grid-cols-2">
                {t.groups.map((g) => (
                  <fieldset key={g.title} className="rounded-lg border border-petroleo/20 bg-white p-4">
                    <legend className="px-1 text-sm font-semibold">{g.title}</legend>
                    <p className="mb-2 text-xs text-texto/70">{g.objective}</p>
                    <div className="divide-y divide-petroleo/10">
                      {g.topics.map((tp) => {
                        const key = `${t.area}|${tp.name}`;
                        const on = !!done[key];
                        return (
                          <label key={tp.name} className="flex cursor-pointer items-start gap-3 py-2">
                            <input type="checkbox" className="mt-1 h-4 w-4 accent-verde" checked={on}
                              disabled={loading || !progressLoaded || busy !== null} onChange={() => toggle(t.area, tp.name)} />
                            <span>
                              <span className="block text-sm font-medium">{tp.name}</span>
                              <span className="block text-xs text-texto/80">{tp.desc}</span>
                              <span className="sr-only">{on ? "Concluído" : "Não concluído"}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
