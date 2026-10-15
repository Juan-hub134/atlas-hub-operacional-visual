import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";
import { ApiError } from "../services/http";
import Field, { ErrorBox } from "../components/Field";

export default function LoginPage() {
  const { session, signIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [err, setErr] = useState<{ m: string; t?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  if (session) return <Navigate to="/painel" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!email.includes("@")) return setErr({ m: "Digite um email válido, como nome@exemplo.com." });
    if (!senha) return setErr({ m: "Digite sua senha." });
    setBusy(true);
    try {
      const token = await login({ email, senha });
      if (!signIn(token)) return setErr({ m: "O servidor respondeu algo inesperado. Avise quem cuida do backend." });
      nav("/painel", { replace: true });
    } catch (e) {
      const a = e as ApiError;
      const bad = a.status === 401 || a.status === 403;
      setErr({ m: bad ? "Email ou senha incorretos. Confira e tente de novo." : a.message, t: a.technical });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 border border-petroleo/20">
        <h1 className="text-xl font-semibold text-petroleo">Entrar no Hub Operacional</h1>
        <Field label="Email" type="email" placeholder="nome@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        <Field label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" />
        {err && <ErrorBox message={err.m} technical={err.t} />}
        <button disabled={busy} className="w-full rounded-md bg-petroleo py-2 text-white font-medium disabled:opacity-60">{busy ? "Entrando…" : "Entrar"}</button>
        <p className="text-sm">Recebeu um convite? <Link to="/cadastro" className="text-petroleo underline">Criar minha conta</Link></p>
      </form>
    </div>
  );
}
