# TypeScript

## Interfaces

Escreva seus arquivos de interface que serão exportadas sempre com o I na frente, exemplo: `ISomeInterface`.
Para interfaces locais da pasta **interfaces**, nomeie sem o "I".

**Reutilize Interfaces:**

_Não Faça:_

```typescript
export interface IUser extends Document {
  _doc: IUser;
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
  isArtist: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterFields {
  username: string;
  email: string;
  password: string;
  isArtist: boolean;
  confirmPassword: string;
}
```

_Faça:_

```typescript
interface User {
  username: string;
  email: string;
  password: string;
  isArtist: boolean;
}

export interface IUser extends Document, User {
  _doc: IUser;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterFields extends User {
  confirmPassword: string;
}
```

> **Tente evitar ao máximo o uso de `any`, use o unknow ao invés disso.**.

[Voltar ao índice](../README.md)
