# SISTEMA DE LEVEL PARA PERFIL

## XP

A fórmula para calcular level é bem simples. O xp irá zerar (ou ficará com o resto do xp que sobrar) a cada level up. A fórmula então será:

```javascript
const targetXp = 1000 * currentLevel * 1.25;
if (Profile.xp >= targetXp) {
  levelUp(Profile.owner);
  Profile.updateOne({ xp: Profile.xp - targetXp });
}
```

|Level|XP  |
|-    |----|
|1    |1250|
|2    |2500|
|3    |3750|
|4    |5000|
|5    |6250|

## Ações

Missões que darão xp bônus.

|AÇÃO        |XP |
|------------|---|
|Curtir      |75 |
|Comentar    |150|
|Compartilhar|250|
|Postar      |400|

### Tabela de permissões por nível de usuário

Por post:

|Level|Comentários|Compartilhar|
|-----|-----------|------------|
|<= 10|1          |1           |
|> 10 |2          |2           |
|> 20 |3          |3           |

Por dia

|Level|Likes|Comentários|Compartilhar|
|-----|-----|-----------|------------|
|<= 10|100  |10         |10          |
|> 10 |200  |20         |20          |
|> 20 |300  |30         |30          |

[Voltar ao índice](../README.md)
