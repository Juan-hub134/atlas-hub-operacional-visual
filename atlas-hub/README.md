# Hub Operacional Atlas T.E.C. — frontend (etapa 1: base)

## Rodar
    npm install
    # Crie .env com VITE_API_URL=http://localhost:8080
    npm run dev

A API é montada como `${VITE_API_URL}/atlashub` + caminho. `VITE_API_URL` contém apenas a origem do backend, sem `/atlashub`. Em desenvolvimento, o proxy do Vite usa essa URL (ou `http://localhost:8080` quando não estiver definida). Para produção, configure `VITE_API_URL` no ambiente de build do frontend com a URL pública HTTPS do backend; se frontend e API estiverem no mesmo domínio com proxy reverso, deixe-a vazia.

## Estado
- Funcional (a validar contra o backend): login (JWT em texto), cadastro com convite, sessão, rotas protegidas, layout responsivo, geração de convite (admin).
- Pendente: Painel, Treinamentos, Documentos, Financeiro (próximas etapas).
- Não validado contra o servidor real: nenhum teste de integração foi executado.

## Incompatibilidades conhecidas do backend
- Cargo `trainer` não é reconhecido pela segurança (existe `trainee`); fica desabilitado em `src/config/roles.ts`.
- Cadastro de movimentações financeiras usa `POST /api/admin/registrar/movimentacao/financeira` (requer cargo admin).
- Exclusão financeira usa POST e remoção de documento usa GET (contrato atual, a ajustar no backend).
- Não existe GET do progresso de treinamentos.
- Se o navegador bloquear as chamadas por CORS, o backend precisa liberar `http://localhost:5173`.

O painel administrativo apresenta um gráfico de receitas e despesas pagas com base nas movimentações retornadas pela API financeira.

## Treinamento de back-end
- [Roteiro de treinamento Java e Spring](./TREINAMENTO-BACKEND-JAVA.md)

## Segurança
Token em `sessionStorage` é solução temporária de desenvolvimento (`src/services/session.ts`). O frontend não é a autoridade de acesso; o backend é.
