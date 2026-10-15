# Treinamento de Back-end — Java e Spring

**Projeto final:** API segura para o Hub Operacional Atlas T.E.C., integrada ao front-end existente, com autenticação JWT, cadastro financeiro e dados para o painel administrativo.

## Objetivo geral

Aprender a construir e manter uma API REST com Java e Spring Boot, persistir dados relacionais, validar entradas, proteger rotas por perfil, testar o comportamento e integrar o back-end a uma aplicação React.

## Stack sugerida

- Java 21 LTS
- Spring Boot 3
- Maven
- Spring Web
- Spring Data JPA
- Bean Validation
- Spring Security e JWT
- PostgreSQL
- Flyway para versionamento do schema
- JUnit 5, Mockito e Spring Boot Test
- Git e GitHub
- Postman ou Insomnia para testar a API

> Use versões compatíveis geradas pelo Spring Initializr. Não armazene senhas, chaves JWT ou credenciais do banco no repositório.

## Projeto e regras de negócio

A API atende ao Hub Operacional e ao front-end existente. O domínio financeiro representa uma movimentação com:

- `id`
- `tipo`: `receita` ou `despesas`
- `valor`: número positivo
- `descricao`
- `categoria`
- `status`: `pago` ou `pendente`

Regras iniciais:

- Apenas usuários administradores podem criar, editar, excluir e consultar dados financeiros administrativos.
- O valor deve ser maior que zero; tipo, status, descrição e categoria são obrigatórios.
- O painel diferencia receitas e despesas pagas. Pendências não entram nos totais pagos nem no gráfico de pizza.
- O servidor é a autoridade para autenticação e autorização; esconder botões no front-end não protege os dados.

## Definition of Done

- [ ] API inicia localmente com configuração documentada.
- [ ] Banco e schema podem ser preparados de forma reproduzível.
- [ ] CRUD financeiro funciona com validação e persistência.
- [ ] Endpoints administrativos exigem JWT válido e autoridade `SCOPE_admin`.
- [ ] Senhas são armazenadas com hash seguro, nunca em texto puro.
- [ ] O front-end consegue autenticar e registrar uma movimentação.
- [ ] Indicadores financeiros têm regras de cálculo documentadas e testadas.
- [ ] Testes cobrem regras, permissões e respostas HTTP importantes.
- [ ] README explica configuração, execução e testes sem publicar segredos.

## Roteiro de 6 semanas

### Semana 1 — Java, HTTP e estrutura do projeto

**Objetivo:** preparar o ambiente e compreender a aplicação que será construída.

**Conteúdos**

- Java: tipos, classes, interfaces, enums, exceções e coleções.
- Maven: dependências, ciclo de build e execução de testes.
- HTTP: métodos, URLs, headers, JSON e códigos de resposta.
- Spring Boot: starters, injeção de dependência e configuração por ambiente.
- Git: commits pequenos e mensagens descritivas.

**Cronograma**

- **Dia 1:** instalar JDK e IDE; criar o projeto pelo Spring Initializr.
- **Dia 2:** criar aplicação e primeiro endpoint de saúde, por exemplo `GET /api/health`.
- **Dia 3:** revisar métodos HTTP e testar respostas com Postman/Insomnia.
- **Dia 4:** separar pacotes iniciais (`controller`, `service`, `repository`, `domain`).
- **Dia 5:** documentar como iniciar a aplicação e versionar o projeto.

**Entrega:** aplicação Spring Boot inicia e responde ao endpoint de saúde.

### Semana 2 — API REST e CRUD financeiro

**Objetivo:** implementar o fluxo de movimentações de ponta a ponta.

**Conteúdos**

- `@RestController`, mappings e serialização JSON.
- DTOs de entrada e saída; não expor entidades JPA diretamente.
- Camadas Controller → Service → Repository.
- Códigos HTTP: `200`, `201`, `204`, `400` e `404`.
- Validação com `@Valid`, `@NotBlank`, `@Positive` e enums.

**Cronograma**

- **Dia 1:** modelar `Movimentacao`, `TipoMovimentacao` e `StatusMovimentacao`.
- **Dia 2:** criar DTOs e endpoint para registrar uma movimentação.
- **Dia 3:** listar movimentações e consultar uma por identificador.
- **Dia 4:** editar e excluir; tratar identificador inexistente com `404`.
- **Dia 5:** validar o CRUD manualmente e alinhar o JSON com o front-end.

**Contrato financeiro usado pelo front-end**

```http
POST /atlashub/api/admin/registrar/movimentacao/financeira
Content-Type: application/json
Authorization: Bearer <token>
```

```json
{
  "tipo": "receita",
  "valor": 150.00,
  "descricao": "Pagamento de projeto",
  "categoria": "Projeto",
  "status": "pago"
}
```

O prefixo `/atlashub` é o contexto já esperado pelo front-end. Confirme como ele está configurado no servidor e não o duplique nos mappings. Em Spring, mappings sem espaços acidentais são essenciais: por exemplo, `@PostMapping("/registrar/movimentacao/financeira")`.

**Entrega:** CRUD financeiro funcional, inicialmente com dados em memória.

### Semana 3 — Banco de dados e persistência

**Objetivo:** manter os dados depois que a aplicação reiniciar.

**Conteúdos**

- PostgreSQL, tabelas, chaves primárias e relacionamentos.
- JPA/Hibernate: `@Entity`, `@Id`, `@GeneratedValue`, `@Enumerated` e `JpaRepository`.
- Precisão monetária com `BigDecimal` e coluna decimal; evitar `float`/`double` para dinheiro.
- Configuração via variáveis de ambiente.
- Migrações versionadas com Flyway.

**Cronograma**

- **Dia 1:** preparar banco local e configurar conexão sem incluir senha no Git.
- **Dia 2:** criar migração inicial para movimentações e usuários.
- **Dia 3:** persistir e listar movimentações usando Spring Data JPA.
- **Dia 4:** revisar precisão monetária, constraints e comportamento transacional.
- **Dia 5:** testar persistência após reiniciar o servidor.

**Entrega:** CRUD conectado ao banco, com schema criado por migração.

### Semana 4 — Autenticação JWT e autorização

**Objetivo:** proteger a API e respeitar os perfis de acesso.

**Conteúdos**

- Spring Security: `SecurityFilterChain`, filtros e `PasswordEncoder`.
- Autenticação stateless e tokens JWT assinados.
- Emissão, validação, expiração e leitura de claims do token.
- Authorities/roles e regra `SCOPE_admin`.
- `401 Unauthorized` versus `403 Forbidden`.
- CORS somente para origens necessárias durante desenvolvimento.

**Cronograma**

- **Dia 1:** configurar Spring Security e definir rotas públicas e protegidas.
- **Dia 2:** armazenar senhas com BCrypt e implementar autenticação.
- **Dia 3:** emitir JWT assinado e validar o token em chamadas autenticadas.
- **Dia 4:** restringir operações financeiras administrativas a `SCOPE_admin`.
- **Dia 5:** testar sem token, com token inválido e com usuário sem permissão.

**Entrega:** chamadas autenticadas pelo front-end e rotas administrativas negadas corretamente sem permissão.

**Cuidados**

- Não aceitar um cargo enviado livremente pelo cliente para conceder permissões.
- Manter a chave JWT fora do código e usar segredo forte em cada ambiente.
- Nunca registrar tokens ou senhas nos logs.
- Definir expiração e rejeitar tokens expirados ou com assinatura inválida.

### Semana 5 — Resumo financeiro para painel e integração

**Objetivo:** produzir dados corretos para os cartões e o gráfico de pizza.

**Conteúdos**

- Consultas agregadas e filtros por tipo/status/período.
- Diferença entre valores pagos e pendentes.
- `SUM`, agrupamento e tratamento de resultados vazios.
- Formato de resposta estável para consumo pelo front-end.
- Integração local, proxy e CORS.

**Cronograma**

- **Dia 1:** revisar as regras de cálculo dos indicadores financeiros.
- **Dia 2:** implementar consultas de entradas e saídas pagas.
- **Dia 3:** implementar saldo e total pendente conforme a regra de negócio definida.
- **Dia 4:** comparar respostas da API com registros conhecidos e conectar ao painel.
- **Dia 5:** validar o gráfico com receitas, despesas, pendências e lista vazia.

**Rotas já esperadas pelo front-end**

- `GET /api/admin/listar/movimentacao/financeira`
- `POST /api/admin/registrar/movimentacao/financeira`
- `POST /api/admin/{id}/atualizar/movimentacao/financeira`
- `POST /api/admin/{id}/excluir/movimentacao/financeira`
- Métricas existentes no front-end: `/api/admin/soma/entradas/financeiras`, `/api/admin/soma/saidas/financeiras`, `/api/admin/saldo/periodo` e `/api/admin/soma/saldo/pendente`.

Confirme o mapping e o método HTTP de cada operação no controller real. A configuração de segurança (`requestMatchers`) só autoriza caminhos; ela não cria endpoints. Os endpoints de métricas precisam adotar a mesma regra de valores pagos/pendentes usada pelo painel.

**Entrega:** dashboard apresenta dados da API e os cálculos são consistentes com a lista.

### Semana 6 — Testes, documentação e publicação

**Objetivo:** fechar o projeto com comportamento verificável e configuração segura.

**Conteúdos**

- Testes unitários de services e testes de integração de controllers.
- MockMvc, cenários positivos e negativos.
- Tratamento centralizado de erros com `@ControllerAdvice`.
- OpenAPI/Swagger para documentar endpoints.
- Perfis de configuração, variáveis de ambiente e deploy.
- Logs úteis sem dados sensíveis.

**Cronograma**

- **Dia 1:** testar validação do cadastro e regras de negócio.
- **Dia 2:** testar permissões, token ausente/expirado e acesso por perfil.
- **Dia 3:** testar CRUD e agregações com banco de teste.
- **Dia 4:** documentar endpoints, payloads, erros e configuração local.
- **Dia 5:** preparar deploy, revisar segredos e fazer uma demonstração integrada.

**Entrega:** API documentada, testada e integrada ao front-end.

## Estrutura sugerida

```text
src/main/java/.../
├─ config/          # Security, CORS e configuração
├─ auth/            # Login, JWT e usuários
├─ financeiro/
│  ├─ controller/
│  ├─ dto/
│  ├─ entity/
│  ├─ repository/
│  └─ service/
└─ common/          # Tratamento de erros e componentes compartilhados
src/main/resources/
└─ db/migration/    # Migrações Flyway
src/test/java/.../  # Testes unitários e de integração
```

Organize por funcionalidade à medida que o projeto crescer. Evite colocar regra de negócio no controller ou misturar autenticação e movimentações na mesma classe.

## Checklist de entrega do projeto

- [ ] Criar, listar, editar e excluir movimentações via API.
- [ ] Recusar valores zero/negativos e campos obrigatórios inválidos.
- [ ] Exigir admin nas rotas financeiras.
- [ ] Persistir os dados no banco.
- [ ] Calcular receitas/despesas pagas sem misturar pendências.
- [ ] Conectar o fluxo de cadastro do front-end à API.
- [ ] Testar `201`, `400`, `401`, `403` e `404` nos cenários aplicáveis.
- [ ] Documentar como configurar banco e segredo JWT localmente.
- [ ] Garantir que `.env`, senhas, tokens e chaves não sejam enviados ao GitHub.

## Links para estudo

- [Java — documentação oficial](https://docs.oracle.com/en/java/)
- [Spring Boot — documentação](https://docs.spring.io/spring-boot/index.html)
- [Spring Security — documentação](https://docs.spring.io/spring-security/reference/)
- [Spring Data JPA — documentação](https://docs.spring.io/spring-data/jpa/reference/)
- [PostgreSQL — documentação](https://www.postgresql.org/docs/)
- [Flyway — documentação](https://documentation.red-gate.com/flyway)
- [JUnit 5 — documentação](https://junit.org/junit5/docs/current/user-guide/)
