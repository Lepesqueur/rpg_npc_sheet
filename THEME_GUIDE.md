# Guia do Sistema de Temas (Dark-Medieval)

Este documento detalha o funcionamento do sistema de temas, permitindo a transição entre o visual Cyberpunk (padrão) e o novo visual **Dark-Medieval**.

## Como Funciona

O sistema utiliza **Variáveis CSS** (Custom Properties) definidas no `index.css` e mapeadas no `tailwind.config.js`. A troca de tema é feita injetando a classe `.theme-medieval` no elemento `body`.

### Variáveis Principais (Dark Fantasy)

| Variável | Cyberpunk (Default) | Dark-Medieval (`.theme-medieval`) |
| :--- | :--- | :--- |
| `--bg-color` | `#050505` | `#0a0a0c` (Pedra Escura) |
| `--text-main` | `#ffffff` (Branco) | `#e2d9c2` (Pergaminho Envelhecido) |
| `--card-bg` | `rgba(19,19,31,0.7)` | `rgba(26,26,28,0.8)` (Ardósia) |
| `--accent-pink`| `#ff0099` (Pink) | `#990000` (Carmesim / Sangue) |
| `--accent-yellow`| `#ffd700` (Amarelo) | `#cd7f32` (Bronze) |
| `--accent-purple`| `#bd00ff` (Roxo) | `#4b0082` (Indigo Imperial) |

## Orientações para Desenvolvimento

Ao criar novos componentes ou modificar existentes, siga estas diretrizes para manter a compatibilidade com os temas:

### 1. Cores e Ações
Sempre utilize as classes de cores do Tailwind prefixadas com `cyber-` ou `accent-`. Elas estão mapeadas para as variáveis dinâmicas.

### 2. Opacidade e Variáveis CSS (Importante)
Devido a limitações do PostCSS, **não use o modificador de opacidade do Tailwind (ex: `/60`) em classes baseadas em variáveis CSS dentro do `index.css` ou `@apply`**.

- **Errado**: `@apply bg-cyber-purple/60;` (Falha no build)
- **Correto (Standard CSS)**: `background-color: color-mix(in srgb, var(--accent-purple), transparent 40%);`

### 3. Cartões e Fundos
Utilize a classe utilitária `.glass-card` sempre que precisar de um painel. No tema medieval, ela ganha tonalidades mais escuras e bordas que remetem a bronze/metal.

## Como Alternar o Tema Programaticamente

Utilize o hook `useCharacter` para acessar o estado e a função de toggle:

```javascript
const { theme, toggleTheme } = useCharacter();

// theme: 'cyberpunk' | 'medieval'
// toggleTheme(): alterna entre os temas
```
