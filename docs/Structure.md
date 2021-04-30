# Estrutura

## Pastas

**Src:**

- auth: Onde ficam os métodos que lidam com a autenticação do usuário.
- emails: Onde fican os HTMLs dos emails.
- entities: Onde as entidades do banco são definidas.
- functions: Onde ficam as funções reutilizáveis que manipulam dados no DB.
- generators: Onde são gerados tokens e afins.
- graphql:
  - **definitions**: Onde os _schemas_ são definidos.
  - **resolvers:** Onde os dados serão manipulados.
    - _index.ts:_ Onde ficará apenas as chamadas das funções que fazem as regras de query e mutation.
    - _/services:_ Onde ficarão as regras de query e mutation.
      - _find:_ Lugar das regras de buscas.
      - _update:_ Lugar das regras de atualização de dados.
      - _create:_ Lugar das regras de criação de dados.
      - _delete:_ Lugar das regras de remoção de dados.
- middlewares: Onde ficam todas as regras que **precisam** ser feitas antes de manipular algum dado.
- utils: Onde ficam todas as regras que vão ser utilizadas por múltiplos _resolvers_.
- validators: Onde ficam os _schemas_ de validação do **Joi**.

### Arquivos

Nomeie os arquivos com o seguinte padrão:

- **Entidades:** PascalCase.
- **Interfaces:** PascalCase.
- **Emails:** camelCase.
- **Definitions:** camelCase.
- **Resolvers:** camelCase.
- **Middlewares:** camelCase.
- **Utils:**  camelCase.
- **Validators:** camelCase.

[Voltar ao índice](../README.md)
