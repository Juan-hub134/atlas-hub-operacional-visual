import { useAuth } from "../context/AuthContext";
import { useLoad } from "../hooks/useLoad";
import { fin, METRICAS, metrica } from "../services/api";
import { brl } from "../utils/format";
import { Load } from "../components/ui";
import type { MovimentacaoResp } from "../services/api";

function Card({ title, path, kind }: { title: string; path: string; kind: "entrada" | "saida" | "saldo" | "pendente" }) {
  const { data, error, loading, reload } = useLoad(() => metrica(path));
  const sign = data === null ? "" : kind === "saldo" || kind === "pendente" ? (data >= 0 ? "Positivo" : "Negativo") : kind === "entrada" ? "Entrada" : "Saída";
  const color = kind === "entrada" ? "text-verde" : kind === "saida" ? "text-red-700" :
    (data ?? 0) >= 0 ? "text-verde" : "text-red-700";
  return (
    <div className="rounded-lg border border-petroleo/20 bg-white p-4">
      <h2 className="text-sm font-medium">{title}</h2>
      <Load loading={loading} error={error} onRetry={reload}>
        <p className={`mt-1 text-2xl font-semibold ${color}`}>{data !== null && brl(data)}</p>
        <p className="text-xs">{sign}</p>
        {kind === "pendente" && <p className="mt-1 text-xs">Receitas pendentes menos despesas pendentes.</p>}
      </Load>
    </div>
  );
}

function FinanceChart({ movements }: { movements: MovimentacaoResp[] }) {
  const totals = movements.reduce((result, movement) => {
    const key = `${movement.tipo}-${movement.status}` as keyof typeof result;
    result[key] += movement.valor;
    return result;
  }, {
    "receita-pago": 0,
    "despesas-pago": 0,
    "receita-pendente": 0,
    "despesas-pendente": 0,
  });
  const slices = [
    { label: "Receitas pagas", value: totals["receita-pago"], color: "#2E7D5E", legend: "bg-verde" },
    { label: "Despesas pagas", value: totals["despesas-pago"], color: "#b42318", legend: "bg-red-700" },
    { label: "Receitas pendentes", value: totals["receita-pendente"], color: "#0D4F6C", legend: "bg-petroleo" },
    { label: "Despesas pendentes", value: totals["despesas-pendente"], color: "#E0A045", legend: "bg-ambar" },
  ];
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const circumference = 2 * Math.PI * 42;
  let offset = 0;

  return (
    <div className="rounded-lg border border-petroleo/20 bg-white p-4">
      <h2 className="text-lg font-semibold text-petroleo">Distribuição financeira</h2>
      <p className="text-sm text-gray-600">Valores por tipo e status</p>
      {total === 0 ? (
        <p className="mt-4 text-sm">Ainda não há movimentações para exibir no gráfico.</p>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <svg className="h-40 w-40 shrink-0" viewBox="0 0 100 100" role="img"
            aria-label={`Gráfico de movimentações financeiras. ${slices.map((slice) => `${slice.label}: ${brl(slice.value)}`).join("; ")}.`}>
            <g transform="rotate(-90 50 50)">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="14" />
              {slices.map((slice) => {
                const arc = (slice.value / total) * circumference;
                const currentOffset = offset;
                offset += arc;
                return slice.value > 0 ? (
                  <circle key={slice.label} cx="50" cy="50" r="42" fill="none" stroke={slice.color} strokeWidth="14"
                    strokeDasharray={`${arc} ${circumference - arc}`} strokeDashoffset={-currentOffset} />
                ) : null;
              })}
            </g>
            <text x="50" y="48" textAnchor="middle" className="fill-texto text-[8px]">Movimentado</text>
            <text x="50" y="58" textAnchor="middle" className="fill-texto text-[7px]">{brl(total)}</text>
          </svg>
          <dl className="space-y-3 text-sm">
            {slices.map((slice) => (
              <div key={slice.label}>
                <dt className="flex items-center gap-2"><span aria-hidden="true" className={`h-3 w-3 rounded-full ${slice.legend}`} />{slice.label}</dt>
                <dd className="ml-5 font-semibold">{brl(slice.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

export default function PainelPage() {
  const { session } = useAuth();
  if (session?.scope !== "admin")
    return (
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-petroleo">Bem-vindo ao Hub</h1>
        <p>Use o menu ao lado para acompanhar seus treinamentos e acessar os documentos da Atlas T.E.C.</p>
      </section>
    );
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-petroleo">Painel</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Entradas pagas" path={METRICAS.entradas} kind="entrada" />
        <Card title="Saídas pagas" path={METRICAS.saidas} kind="saida" />
        <Card title="Resultado financeiro (entradas − saídas pagas)" path={METRICAS.saldo} kind="saldo" />
        <Card title="Saldo pendente líquido" path={METRICAS.pendente} kind="pendente" />
      </div>
      <FinanceOverview />
    </section>
  );
}

function FinanceOverview() {
  const { data, error, loading, reload } = useLoad(fin.listar);

  return (
    <Load loading={loading} error={error} onRetry={reload}>
      {data && <FinanceChart movements={data} />}
    </Load>
  );
}
