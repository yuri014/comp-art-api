# Estrutura

## Pastas

**Src:**

- emails: Aqui é onde fica os HTMLs dos emails.
- entities: Aqui é onde as entidades do banco são definidas.
- graphql:
  - **definitions**: Aqui é onde os _schemas_ são definidos.
  - **resolvers:** Aqui é o lugar onde os dados serão manipulados.
    - _index.ts:_ Aqui ficará apenas as chamadas das funções que fazem as regras de query e mutation.
    - _/services:_ Aqui ficarão as regras de query e mutation.
      - _find:_ Lugar das regras de buscas.
      - _update:_ Lugar das regras de atualização de dados.
      - _create:_ Lugar das regras de criação de dados.
      - _delete:_ Lugar das regras de remoção de dados.
- middlewares: Aqui ficam todas as regras que **precisam** ser feitas antes de manipular algum dado.
- utils: Aqui ficam todas as regras que vão ser utilizadas por múltiplos _resolvers_.
- validators: Aqui ficam os _schemas_ de validação do **Joi**.
