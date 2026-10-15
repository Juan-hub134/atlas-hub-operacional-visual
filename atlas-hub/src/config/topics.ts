export interface Topic { name: string; desc: string }
export interface Group { title: string; objective: string; topics: Topic[] }
export interface Track {
  area: "Front-end" | "Back-end";
  project: string;
  stack: string;
  groups: Group[];
}

export const TRACKS: Track[] = [
  {
    area: "Front-end",
    project: "Evoluir os projetos do portfólio até uma aplicação de tarefas em React integrada à API do Hub.",
    stack: "HTML, CSS, JavaScript, Git, React, TypeScript e Tailwind CSS",
    groups: [
      { title: "Semana 1 — HTML, CSS e Git", objective: "Construir uma página de perfil semântica e organizada.", topics: [
        { name: "Estrutura HTML", desc: "Usar doctype, head, viewport e body com as tags semânticas principais." },
        { name: "Conteúdo e acessibilidade", desc: "Criar seções Sobre, Habilidades, Projetos e Contato; incluir alt em imagens e links acessíveis." },
        { name: "CSS e Box Model", desc: "Aplicar seletores, cores, tipografia, margin, border e padding." },
        { name: "Pastas e ferramentas", desc: "Organizar index.html, css/style.css e assets; executar com Live Server." },
        { name: "Git e GitHub", desc: "Inicializar o repositório, criar commits e publicar o projeto." },
      ] },
      { title: "Semana 2 — CSS avançado e responsividade", objective: "Transformar a página em uma landing page adaptável a celular, tablet e desktop.", topics: [
        { name: "Flexbox", desc: "Alinhar elementos com eixos, gap, flex-grow, flex-shrink e flex-basis." },
        { name: "CSS Grid", desc: "Montar seções com grid-template, minmax, auto-fit ou auto-fill." },
        { name: "Layout responsivo", desc: "Aplicar estratégia mobile-first, unidades relativas e media queries." },
        { name: "Estados e microinterações", desc: "Adicionar hover, focus visível e transições sem prejudicar acessibilidade." },
        { name: "Revisão visual", desc: "Verificar o layout em larguras mobile, tablet e desktop." },
      ] },
      { title: "Semana 3 — JavaScript, DOM e lógica", objective: "Construir uma To-Do List interativa com estado e CRUD.", topics: [
        { name: "Fundamentos JavaScript", desc: "Praticar variáveis, tipos, condicionais, funções e arrays." },
        { name: "Eventos e DOM", desc: "Ler formulários, reagir a eventos e criar elementos sem recarregar a página." },
        { name: "Adicionar e validar tarefas", desc: "Bloquear tarefas vazias e fornecer feedback ao usuário." },
        { name: "Concluir e remover tarefas", desc: "Alterar o estado e remover itens usando event delegation quando apropriado." },
        { name: "Renderizar a partir do estado", desc: "Usar uma coleção como fonte de verdade e implementar filtros/contadores." },
      ] },
      { title: "Semana 4 — Git e consumo de APIs", objective: "Organizar o código e consumir uma API HTTP com estados de interface claros.", topics: [
        { name: "Git em equipe", desc: "Trabalhar com branches, commits pequenos, pull requests e revisão." },
        { name: "HTTP e JSON", desc: "Entender métodos, status HTTP, headers e payloads JSON." },
        { name: "Fetch e async/await", desc: "Consumir uma API e tratar respostas assíncronas." },
        { name: "Estados da interface", desc: "Exibir carregamento, lista vazia, sucesso e erro com opção de tentar novamente." },
        { name: "Validação da integração", desc: "Conferir URL, contrato dos dados e comportamento diante de erro do servidor." },
      ] },
      { title: "Semana 5 — React, TypeScript e Tailwind", objective: "Finalizar um aplicativo de tarefas componentizado e responsivo.", topics: [
        { name: "Setup React com Vite", desc: "Criar e executar uma aplicação React usando Vite." },
        { name: "Componentes e props", desc: "Separar formulário, lista, item e layout em componentes reutilizáveis." },
        { name: "Estado e CRUD", desc: "Implementar criação, edição, conclusão, remoção e filtros." },
        { name: "TypeScript", desc: "Definir tipos do domínio e tipar props, estado e handlers sem any desnecessário." },
        { name: "Tailwind e publicação", desc: "Aplicar estilos responsivos, revisar o build e documentar o deploy." },
      ] },
    ],
  },
  {
    area: "Back-end",
    project: "Criar uma API segura para o Hub Operacional: CRUD financeiro, JWT, banco relacional e dados para o dashboard.",
    stack: "Java 21, Spring Boot, Maven, Spring Web, Spring Data JPA, Spring Security, JWT, PostgreSQL, Flyway e JUnit",
    groups: [
      { title: "Semana 1 — Java, HTTP e Spring Boot", objective: "Preparar o ambiente e compreender a estrutura de uma API.", topics: [
        { name: "Fundamentos de Java", desc: "Praticar tipos, classes, interfaces, enums, exceções e coleções." },
        { name: "Maven e JDK", desc: "Configurar Java LTS, entender dependências e executar build e testes Maven." },
        { name: "HTTP e JSON", desc: "Reconhecer métodos HTTP, URLs, headers, payloads e códigos de resposta." },
        { name: "Primeira aplicação Spring", desc: "Criar o projeto no Spring Initializr e executar a aplicação." },
        { name: "Endpoint de saúde", desc: "Implementar e testar um endpoint simples como GET /api/health." },
        { name: "Organização e Git", desc: "Separar pacotes iniciais e registrar o projeto com commits claros." },
      ] },
      { title: "Semana 2 — API REST e CRUD financeiro", objective: "Implementar as operações de movimentação seguindo o contrato do front-end.", topics: [
        { name: "Modelo financeiro", desc: "Definir movimentação, tipo receita/despesa e status pago/pendente." },
        { name: "Camadas da aplicação", desc: "Separar Controller, Service, Repository, DTOs e domínio." },
        { name: "Registrar movimentação", desc: "Implementar POST /api/admin/registrar/movimentacao/financeira com JSON." },
        { name: "Listar e consultar", desc: "Criar endpoints de leitura e definir respostas consistentes." },
        { name: "Editar e excluir", desc: "Implementar atualização e exclusão com status HTTP apropriados." },
        { name: "Validação e erros", desc: "Rejeitar valor não positivo e campos obrigatórios inválidos; responder 400/404 corretamente." },
      ] },
      { title: "Semana 3 — PostgreSQL, JPA e migrações", objective: "Persistir movimentações de forma confiável no banco relacional.", topics: [
        { name: "Modelagem relacional", desc: "Criar tabelas, chaves e constraints para usuários e movimentações." },
        { name: "Spring Data JPA", desc: "Mapear entidades e persistir usando repositórios." },
        { name: "Precisão monetária", desc: "Usar BigDecimal e coluna decimal; não usar float/double para dinheiro." },
        { name: "Migrações Flyway", desc: "Versionar mudanças do schema e preparar o banco de forma reproduzível." },
        { name: "Configuração segura", desc: "Ler conexão e credenciais por variáveis de ambiente, sem incluí-las no Git." },
        { name: "Persistência", desc: "Verificar que os dados permanecem após reiniciar a aplicação." },
      ] },
      { title: "Semana 4 — Spring Security e JWT", objective: "Autenticar usuários e proteger as rotas conforme o cargo.", topics: [
        { name: "Configuração de segurança", desc: "Definir rotas públicas/protegidas e configurar SecurityFilterChain." },
        { name: "Hash de senhas", desc: "Armazenar senhas com BCrypt, nunca em texto puro." },
        { name: "Emissão de JWT", desc: "Emitir token assinado com expiração e claims necessárias." },
        { name: "Validação de JWT", desc: "Validar assinatura e expiração em cada chamada autenticada." },
        { name: "Autorização admin", desc: "Exigir SCOPE_admin nas rotas financeiras administrativas." },
        { name: "Testes de acesso", desc: "Distinguir 401 de 403 e testar token ausente, inválido e usuário sem permissão." },
        { name: "Segredos e CORS", desc: "Manter a chave JWT fora do código e liberar somente origens necessárias." },
      ] },
      { title: "Semana 5 — Métricas e integração com o dashboard", objective: "Servir totais coerentes para cartões e gráfico de receitas/despesas.", topics: [
        { name: "Regras de cálculo", desc: "Documentar quais movimentações entram em receitas, despesas, saldo e pendências." },
        { name: "Consultas agregadas", desc: "Calcular totais com consultas SQL/JPA e tratar resultados vazios." },
        { name: "Pagos versus pendentes", desc: "Não misturar pendências com os totais pagos exibidos no gráfico." },
        { name: "Compatibilidade de rotas", desc: "Conferir mappings e métodos HTTP usados pelo front-end." },
        { name: "Integração ponta a ponta", desc: "Registrar pelo front-end e confirmar persistência e atualização da lista." },
        { name: "Conferência do dashboard", desc: "Comparar respostas da API com valores conhecidos, incluindo lista vazia." },
      ] },
      { title: "Semana 6 — Testes, documentação e publicação", objective: "Entregar uma API verificável, documentada e segura para execução.", topics: [
        { name: "Testes unitários", desc: "Testar regras de negócio dos services com JUnit e Mockito." },
        { name: "Testes de integração", desc: "Testar controllers, validações e respostas HTTP com Spring Boot Test/MockMvc." },
        { name: "Tratamento de erros", desc: "Padronizar respostas de erro com ControllerAdvice sem ocultar falhas." },
        { name: "Documentação da API", desc: "Descrever endpoints, payloads, autenticação e erros com OpenAPI/Swagger." },
        { name: "Configuração de deploy", desc: "Separar perfis e configurar variáveis de ambiente sem publicar segredos." },
        { name: "Checklist de segurança", desc: "Verificar permissões, logs sem tokens/senhas e ausência de credenciais no repositório." },
        { name: "Demonstração final", desc: "Executar API e front-end integrados e apresentar o fluxo de cadastro ao dashboard." },
      ] },
    ],
  },
];
