import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FileText, GraduationCap, LayoutDashboard, LogOut, Menu, UserPlus, Wallet, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { roleLabel } from "../config/roles";

const NAV = [
  { to: "/painel", label: "Painel", icon: LayoutDashboard },
  { to: "/treinamentos", label: "Treinamentos", icon: GraduationCap },
  { to: "/documentos", label: "Documentos", icon: FileText },
  { to: "/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/convites", label: "Usuários e convites", icon: UserPlus, adminOnly: true },
];

export default function AppLayout() {
  const { session, signOut } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const isAdmin = session?.scope === "admin";

  const links = NAV.filter((n) => !n.adminOnly || isAdmin).map(({ to, label, icon: Icon }) => (
    <NavLink key={to} to={to} onClick={() => setOpen(false)}
      className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${isActive ? "bg-white text-petroleo font-semibold" : "text-white/90 hover:bg-white/10"}`}>
      <Icon size={18} aria-hidden /> {label}
    </NavLink>
  ));

  return (
    <div className="min-h-screen md:flex">
      <aside className={`${open ? "block" : "hidden"} md:block md:w-60 shrink-0 bg-petroleo p-4 md:min-h-screen`}>
        <div className="mb-6 text-white font-semibold">Atlas T.E.C.<span className="block text-xs font-normal text-white/70">Hub Operacional</span></div>
        <nav aria-label="Navegação principal" className="space-y-1">{links}</nav>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="flex items-center justify-between gap-3 border-b border-petroleo/20 bg-white px-4 py-3">
          <button className="md:hidden flex items-center gap-2 text-sm" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />} {open ? "Fechar menu" : "Abrir menu"}
          </button>
          <div className="ml-auto flex items-center gap-4 text-sm">
            {/* O login não devolve o nome; não inventamos a partir do token. */}
            <span><strong>Minha conta</strong> · {roleLabel(session?.scope)}</span>
            <button onClick={() => { signOut(); nav("/login"); }} className="flex items-center gap-1 rounded-md border border-petroleo/30 px-3 py-1.5 hover:bg-fundo">
              <LogOut size={16} aria-hidden /> Sair da conta
            </button>
          </div>
        </header>
        <main className="p-4 md:p-8 max-w-5xl"><Outlet /></main>
      </div>
    </div>
  );
}
