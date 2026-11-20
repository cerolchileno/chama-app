# CHAMA — Precisa de um serviço? CHAMA.

Aplicativo de conexão entre **clientes** e **prestadores de serviços**, desenvolvido como MVP acadêmico da P2 e base para evolução posterior no Trabalho de Conclusão de Curso (TCC) de Engenharia de Software.

## Visão geral

O CHAMA permite ao cliente explorar categorias e profissionais, cadastrar endereços, solicitar serviços, acompanhar pedidos e avaliar atendimentos concluídos. O prestador pode gerenciar serviços oferecidos, consultar solicitações vinculadas ao seu perfil e atualizar o andamento dos atendimentos.

> **Estado do projeto:** MVP demonstrativo. Os fluxos usam dados locais e persistência no dispositivo; não há autenticação real, banco de dados remoto ou backend de produção. Não é um serviço comercial em operação.

## Tecnologias

- React Native, React e TypeScript
- Expo SDK 57 e Expo Router (navegação)
- StyleSheet e Flexbox (interface)
- AsyncStorage (persistência local)
- ViaCEP (consulta pública de CEP)
- Vitest (testes de regras de negócio)

## Funcionalidades do MVP

**Cliente**
- Telas de entrada, cadastro demonstrativo e navegação
- Exploração de categorias, profissionais e serviços
- Solicitação de serviços e escolha de endereço salvo
- Acompanhamento de solicitações, histórico e avaliações
- Perfil, dados pessoais e gerenciamento de endereços
- Busca de CEP com preenchimento de rua, bairro, cidade e UF; número e complemento permanecem manuais

**Prestador**
- Área e perfil do prestador
- Cadastro e gerenciamento local de serviços oferecidos
- Visualização de solicitações vinculadas ao prestador
- Atualização de status conforme regras de transição
- Histórico e indicadores de atendimentos do próprio prestador

## Requisitos para executar

- Node.js e npm instalados
- Navegador atualizado para testar no Expo Web; para celular, ambiente Expo compatível

```bash
git clone https://github.com/cerolchileno/chama-app.git
cd chama-app
npm install
npx expo start --web -c
```

Para iniciar o Expo com opções de dispositivo:

```bash
npx expo start -c
```

> O endereço local e a porta são mostrados no terminal. Recursos específicos de Android/iOS devem ser validados também em dispositivo ou emulador.

## Testes e verificações

Verificação de tipos:

```bash
npx tsc --noEmit
```

Testes automatizados existentes, quando encontrados pelo Vitest:

```bash
npx vitest run
```

Fluxos manuais recomendados:
1. Entrar no acesso demonstrativo e navegar como cliente.
2. Criar endereço; consultar o CEP `01001000`; conferir preenchimento e salvar.
3. Fechar e reabrir o aplicativo; confirmar que o endereço persiste.
4. Solicitar um serviço, selecionar endereço salvo e conferir o histórico.
5. Acessar o perfil de prestador, gerenciar serviços e acompanhar pedidos correspondentes.
6. Atualizar status de uma solicitação e verificar a mudança no histórico.
7. Avaliar somente um serviço concluído e confirmar a avaliação salva.
8. Verificar mensagens para CEP inválido, CEP inexistente e falha de rede.

**Atenção:** os comandos acima são instruções de execução; a presença deles não significa que todos os testes já foram executados com sucesso.

## Estrutura principal

- `src/app/` — telas e rotas do Expo Router
- `src/constants/` — modelos, regras e armazenamento local
- `assets/` — recursos visuais do aplicativo

## Limitações e próximos passos

O MVP não substitui autenticação real, controle de acesso em servidor, integração de pagamentos, notificações ou sincronização entre dispositivos. Esses itens, juntamente com backend, banco de dados, testes de integração e refinamento de identidade visual, pertencem à evolução do TCC.

## Equipe

- Victor Hugo
- Kaua Mendes

**Projeto acadêmico — Engenharia de Software, Universidade de Vassouras (Maricá).**

## Repositório

https://github.com/cerolchileno/chama-app
