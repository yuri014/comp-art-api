# GraphQL

O projeto usa [Apollo Server Express](https://www.apollographql.com/docs/apollo-server/) e [graphql-upload](https://github.com/jaydenseric/graphql-upload) para fazer uploads.
O Apollo Server e o graphql-upload são iniciados no arquivo `src/server.ts`.

## Definitions

Toda vez que criar um novo arquivo de uma `definition`, vá até o arquivo `src/graphql/definitions/index.ts` e importe a nova definition no array.
