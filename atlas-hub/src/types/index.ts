export interface LoginRequest { email: string; senha: string }
export interface CadastroRequest { nome: string; email: string; senha: string; token: string }
export interface ConviteRequest { tipoRegistro: string }

export interface Session {
  token: string;
  sub: string;   // id do usuário no banco
  scope: string; // cargo
  exp: number;   // segundos desde epoch
}
