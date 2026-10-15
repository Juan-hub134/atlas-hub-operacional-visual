// Fonte única dos cargos. O valor "value" é enviado ao backend e precisa ser IGUAL ao
// que a segurança do Spring espera (claim "scope" do JWT -> SCOPE_<value>).
export interface RoleOption {
  value: string;
  label: string;
  enabled: boolean;
  note?: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  { value: "admin", label: "Administrador", enabled: true },
  { value: "membro", label: "Membro", enabled: true },
  { value: "trainee", label: "Trainee", enabled: true },
  {
    value: "trainer",
    label: "Trainer",
    enabled: false,
    note: "O backend não reconhece 'trainer' nas regras de segurança. Precisa de decisão ou alteração no backend.",
  },
];

export const roleLabel = (scope?: string) =>
  ROLE_OPTIONS.find((r) => r.value === scope)?.label ?? scope ?? "Cargo desconhecido";
