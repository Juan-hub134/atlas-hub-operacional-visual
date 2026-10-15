import { useEffect, useRef, type ReactNode } from "react";
import type { ApiError } from "../services/http";
import { ErrorBox } from "./Field";

export const btn = "rounded-md bg-petroleo px-4 py-2 text-white text-sm disabled:opacity-60";
export const btnGhost = "rounded-md border border-petroleo/30 bg-white px-3 py-1.5 text-sm disabled:opacity-60";
export const input = "w-full rounded-md border border-petroleo/30 bg-white px-3 py-2 text-sm";

export function Load({ loading, error, onRetry, children }: { loading: boolean; error: ApiError | null; onRetry: () => void; children: ReactNode }) {
  if (loading) return <p role="status">Carregando…</p>;
  if (error) return (
    <div className="space-y-2">
      <ErrorBox message={error.message} technical={error.technical} />
      <button className={btnGhost} onClick={onRetry}>Tentar de novo</button>
    </div>
  );
  return <>{children}</>;
}

export function Dialog({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="dlg-title" className="m-auto w-full max-w-md rounded-lg p-5 backdrop:bg-black/40">
      <h2 id="dlg-title" className="mb-3 text-lg font-semibold text-petroleo">{title}</h2>
      {open && children}
    </dialog>
  );
}

export function Confirm({ open, title, text, action, busy, onYes, onNo }: { open: boolean; title: string; text: string; action: string; busy?: boolean; onYes: () => void; onNo: () => void }) {
  return (
    <Dialog open={open} title={title} onClose={onNo}>
      <p className="mb-4 text-sm">{text}</p>
      <div className="flex justify-end gap-2">
        <button className={btnGhost} onClick={onNo}>Cancelar</button>
        <button className="rounded-md bg-red-700 px-4 py-2 text-sm text-white disabled:opacity-60" disabled={busy} onClick={onYes}>{busy ? "Aguarde…" : action}</button>
      </div>
    </Dialog>
  );
}
