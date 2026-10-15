# Hub Operacional Atlas T.E.C. — frontend (etapa 1: base)

## Rodar
    npm install
    # Crie .env com VITE_API_URL=http://localhost:8080
    npm run dev

A API é chamada pelo caminho `/atlashub` + `/api/...`. Em desenvolvimento, o proxy do Vite encaminha as chamadas para `VITE_API_URL` ou, por padrão, `http://localhost:8080`. Em produção, a Vercel encaminha `/atlashub/*` para `https://hub-operacional-atlas.onrender.com/atlashub/*`, evitando chamada cross-origin do navegador.

## Estado
- Frontend integrado às rotas de login, cadastro, treinamentos, documentos e financeiro; validar os fluxos no ambiente publicado.
- O painel financeiro consome métricas e movimentações da API; confirme os cálculos com dados reais.

## Incompatibilidades conhecidas do backend
- Cargo `trainer` não é reconhecido pela segurança (existe `trainee`); fica desabilitado em `src/config/roles.ts`.
- Cadastro de movimentações financeiras usa `POST /api/admin/registrar/movimentacao/financeira` (requer cargo admin).
- Exclusão financeira usa POST e remoção de documento usa GET (contrato atual, a ajustar no backend).
- O progresso de treinamentos é carregado por `GET /atlashub/api/treinamento` e registrado por `POST /atlashub/api/treinamento`; ambos devem identificar o usuário autenticado via JWT.
- O proxy de produção está definido em `vercel.json`; o frontend não chama o backend Render diretamente.

O painel administrativo apresenta um gráfico de receitas e despesas pagas com base nas movimentações retornadas pela API financeira.

## Treinamento de back-end
- [Roteiro de treinamento Java e Spring](./TREINAMENTO-BACKEND-JAVA.md)

## Segurança
Token em `sessionStorage` é solução temporária de desenvolvimento (`src/services/session.ts`). O frontend não é a autoridade de acesso; o backend é.
