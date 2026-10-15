import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { cadastrar } from "../services/authService";
import { ApiError } from "../services/http";
import Field, { ErrorBox } from "../components/Field";

// Sem campo de cargo: o backend define o cargo a partir do convite.
export default function CadastroPage() {
  const [f, setF] = useState({ nome: "", email: "", senha: "", token: "" });
  const [err, setErr] = useState<{ m: string; t?: string } | null>(null);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!f.nome.trim() || !f.email.includes("@") || f.senha.length < 6 || !f.token.trim())
      return setErr({ m: "Preencha todos os campos. A senha precisa ter pelo menos 6 caracteres." });
    setBusy(true);
    try {
      await cadastrar({ ...f, token: f.token.trim() });
      setOk(true);
    } catch (e) {
      const a = e as ApiError;
      setErr({ m: a.status === 400 || a.status === 404 ? "Convite inválido, expirado ou dados incorretos. Peça um novo convite a um administrador." : a.message, t: a.technical });
    } finally { setBusy(false); }
  }

  if (ok) return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="max-w-sm rounded-lg bg-white p-6 border border-verde/40 space-y-3">
        <h1 className="text-xl font-semibold text-verde">Conta criada</h1>
        <p className="text-sm">Agora você já pode entrar com seu email e senha.</p>
        <Link to="/login" className="inline-block rounded-md bg-petroleo px-4 py-2 text-white">Ir para o login</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 border border-petroleo/20">
        <h1 className="text-xl font-semibold text-petroleo">Criar conta</h1>
        <Field label="Nome completo" placeholder="Maria da Silva" value={f.nome} onChange={set("nome")} />
        <Field label="Email" type="email" placeholder="nome@exemplo.com" value={f.email} onChange={set("email")} />
        <Field label="Senha" type="password" value={f.senha} onChange={set("senha")} autoComplete="new-password" />
        <Field label="Código do convite" hint="Cole o código que um administrador enviou para você. Seu cargo vem do convite." value={f.token} onChange={set("token")} />
        {err && <ErrorBox message={err.m} technical={err.t} />}
        <button disabled={busy} className="w-full rounded-md bg-petroleo py-2 text-white font-medium disabled:opacity-60">{busy ? "Criando…" : "Criar conta"}</button>
        <p className="text-sm"><Link to="/login" className="text-petroleo underline">Voltar ao login</Link></p>
      </form>
    </div>
  );
}
