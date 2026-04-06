

# Corrigir fundo plano → gradiente

## Alterações

### 1. `src/index.css` — linha 10
```
--background: 210 63% 13%;  →  --background: 209 64% 15%;
```

### 2. `src/pages/Auth.tsx` — linha 111
```
bg-[#0a2540]  →  gradient-page
```

### 3. `src/pages/Onboarding.tsx` — linha 982
```
bg-[#0a2540]  →  gradient-page
```

### 4. `src/pages/Plans.tsx` — linha 24
```
bg-background  →  gradient-page
```

### 5. `src/pages/Diagnosis.tsx` — linha 83
```
bg-background  →  gradient-page
```

Nenhuma lógica alterada — apenas classes CSS.

