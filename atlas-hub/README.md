# Hub Operacional Atlas T.E.C. — frontend (etapa 1: base)

## Rodar
    npm install
    # Crie .env com VITE_API_URL=http://localhost:8080
    npm run dev

A API é montada como `${VITE_API_URL}/atlashub` + caminho `/api/...`. `VITE_API_URL` contém apenas a origem do backend, sem `/atlashub`. Em desenvolvimento, o proxy do Vite encaminha `/atlashub` para essa URL (ou `http://localhost:8080` quando não estiver definida). Em produção, a origem padrão é `https://hub-operacional-atlas.onrender.com`; configure `VITE_API_URL` no ambiente de build apenas para sobrescrever esse padrão.

## Estado
- Frontend integrado às rotas de login, cadastro, treinamentos, documentos e financeiro; validar os fluxos no ambiente publicado.
- O painel financeiro consome métricas e movimentações da API; confirme os cálculos com dados reais.

## Incompatibilidades conhecidas do backend
- Cargo `trainer` não é reconhecido pela segurança (existe `trainee`); fica desabilitado em `src/config/roles.ts`.
- Cadastro de movimentações financeiras usa `POST /api/admin/registrar/movimentacao/financeira` (requer cargo admin).
- Exclusão financeira usa POST e remoção de documento usa GET (contrato atual, a ajustar no backend).
- O progresso de treinamentos é carregado por `GET /atlashub/api/treinamento` e registrado por `POST /atlashub/api/treinamento`; ambos devem identificar o usuário autenticado via JWT.
- Em produção, se o navegador bloquear as chamadas por CORS, o backend precisa liberar a origem pública do frontend.

O painel administrativo apresenta um gráfico de receitas e despesas pagas com base nas movimentações retornadas pela API financeira.

## Treinamento de back-end
- [Roteiro de treinamento Java e Spring](./TREINAMENTO-BACKEND-JAVA.md)

## Segurança
Token em `sessionStorage` é solução temporária de desenvolvimento (`src/services/session.ts`). O frontend não é a autoridade de acesso; o backend é.
