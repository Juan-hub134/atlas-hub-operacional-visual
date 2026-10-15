import type { InputHTMLAttributes } from "react";

export default function Field({ label, hint, ...props }: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      <input {...props} className="w-full rounded-md border border-petroleo/30 bg-white px-3 py-2" />
      {hint && <span className="block text-xs text-texto/70 mt-1">{hint}</span>}
    </label>
  );
}

export function ErrorBox({ message, technical }: { message: string; technical?: string }) {
  return (
    <div role="alert" className="rounded-md border border-red-700/40 bg-red-50 px-3 py-2 text-sm text-red-900">
      {message}
      {technical && (
        <details className="mt-1 text-xs opacity-80"><summary>Detalhes técnicos</summary>{technical}</details>
      )}
    </div>
  );
}
