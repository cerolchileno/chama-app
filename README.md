# CHAMA — Marketplace de serviços

O **CHAMA** é um aplicativo em desenvolvimento para conectar clientes a profissionais prestadores de serviços. Este repositório reúne a implementação do projeto acadêmico, utilizado também como MVP da atividade P2 e planejado para evolução no TCC.

> **Estado atual:** protótipo funcional com persistência local. Ainda não é uma plataforma de produção: não possui autenticação real, backend compartilhado nem sincronização entre dispositivos.

## Tecnologias

- **React Native** com **Expo SDK 57** e **Expo Router**;
- **TypeScript**;
- **AsyncStorage** para persistência local;
- **Vitest** para testes automatizados;
- **Git e GitHub** para versionamento e revisão de alterações.

## Funcionalidades implementadas no MVP

### Cliente
- Navegação pelo catálogo de serviços e profissionais demonstrativos.
- Visualização de profissionais e seus serviços.
- Criação de solicitações de atendimento, com dados do serviço, descrição e endereço.
- Acompanhamento de solicitações ativas e histórico de atendimentos encerrados.
- Avaliação de serviços concluídos.

### Prestador
- Gerenciamento de serviços anunciados, com persistência local.
- Recebimento de solicitações vinculadas ao prestador demonstrativo.
- Atualização do status das solicitações conforme as transições permitidas.
- Histórico de atendimentos próprios e visualização de avaliações recebidas.
- Indicadores de solicitações e avaliações limitados ao prestador demonstrativo.

### Qualidade e regras
- Validação de dados e transições de status.
- Proteção contra alteração de solicitações de outros prestadores no fluxo demonstrativo.
- Testes automatizados de regras, persistência, serviços e filtragem.
- Histórico de desenvolvimento organizado por branches, commits e pull requests.

## Como executar

### Pré-requisitos

- Node.js e npm instalados;
- Ambiente compatível com o Expo para testar no celular, emulador ou navegador.

No terminal, a partir da raiz do repositório:

```bash
npm install
npx expo start -c
```

Siga as opções exibidas pelo Expo para abrir o aplicativo no ambiente de testes disponível.

### Verificações

```bash
npx tsc --noEmit
npx vitest run
```

O primeiro comando verifica os tipos TypeScript. O segundo executa os testes automatizados.

## Fluxo sugerido de demonstração da P2

1. Apresentar o objetivo do CHAMA e a navegação inicial.
2. Entrar no fluxo do prestador demonstrativo e apresentar seus serviços.
3. No fluxo do cliente, escolher um serviço e criar uma solicitação para esse prestador.
4. Retornar à área do prestador, localizar o pedido e alterar seu status.
5. Mostrar a atualização do pedido na área do cliente.
6. Concluir o atendimento, abrir o histórico e demonstrar a avaliação.
7. Exibir os indicadores do prestador e comentar os testes automatizados.

**Importante:** os dados são armazenados no próprio dispositivo. Para demonstrar o fluxo completo, utilize a mesma instalação do aplicativo.

## Limitações atuais

- **Login e cadastro:** fluxos demonstrativos, sem autenticação ou contas reais.
- **Persistência:** dados locais via AsyncStorage, sem compartilhamento entre dispositivos.
- **Identidade do usuário:** ainda não existe sessão autenticada para isolar os dados de múltiplos clientes reais.
- **Integração de CEP:** em desenvolvimento pela equipe; verificar a disponibilidade antes de demonstrar.
- **Serviços e profissionais:** parte dos dados é demonstrativa.
- **Pagamentos, notificações e infraestrutura de produção:** não implementados neste MVP.

## Próximas etapas do TCC

- Implementar backend e banco de dados com persistência centralizada.
- Adicionar autenticação e autorização reais para clientes e prestadores.
- Vincular solicitações ao cliente autenticado e ao prestador correspondente.
- Integrar e validar serviços externos, incluindo consulta de CEP.
- Evoluir segurança, testes, experiência do usuário e identidade visual da marca.
- Preparar implantação, documentação técnica e avaliação do sistema.

## Organização do trabalho

As alterações são desenvolvidas em branches específicas, revisadas por pull requests e integradas à `main` após validação. A documentação distingue as funcionalidades existentes das previstas para evitar apresentar recursos futuros como já implementados.

---

**CHAMA — conectando pessoas a serviços.**
