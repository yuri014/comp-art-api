# SISTEMA DE LEVEL PARA PERFIL

## XP

A fórmula para calcular level é bem simples. O xp irá zerar (ou ficará com o resto do xp que sobrar) a cada level up. A fórmula então será:

```javascript
const targetXp = 1000 * currentLevel;
if (Profile.xp >= targetXp) {
  levelUp(Profile.owner);
  Profile.updateOne({ xp: Profile.xp - targetXp });
}
```

LEVEL | 1 | 2 | 3 | 4 | 5
--- | --- | --- | --- |--- |--- |--- |--- |--- |--- |--- |---
XP | 1000 | 2000 | 3000 | 4000 | 5000

## Ações

Missões que darão xp bônus.

AÇÃO | Curtir | Postar | Compartilhar | Comentar
--- | --- | --- | --- |--- |--- |--- |--- |--- |--- |--- |---
XP | 75 | 250 | 200 | 125
