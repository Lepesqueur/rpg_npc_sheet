# Guia de Deployment (PWA)

Este guia explica como colocar sua ficha de RPG online gratuitamente usando o **GitHub Pages**.

## 1. Preparação (Automática)

Eu já configurei o projeto para você.
- **Configuração PWA**: O arquivo `vite.config.js` já está pronto para instalar o app.
- **Automação**: Criei um arquivo em `.github/workflows/deploy.yml` que fará o deploy automático toda vez que você enviar código (push) para o GitHub.

## 2. Como Fazer o Deploy

### Passo 1: Enviar para o GitHub
Se você ainda não enviou seu código para o GitHub, faça isso agora:

```bash
git add .
git commit -m "Configura deploy PWA"
git push origin main
```

*(Se for o primeiro push, certifique-se de ter criado o repositório no GitHub e adicionado o remote).*

### Passo 2: Configurar o GitHub Pages
1. Vá até a página do seu repositório no GitHub.
2. Clique em **Settings** (Configurações).
3. Na barra lateral esquerda, clique em **Pages**.
4. Em **Build and deployment** > **Source**, mantenha "Deploy from a branch".
5. Em **Branch**, mude de `main` (ou none) para `gh-pages`.
   - *Nota: O branch `gh-pages` será criado automaticamente pela minha automação após o primeiro push. Se ele não aparecer, espere alguns minutos após o push e recarregue a página.*
6. Clique em **Save**.

### Passo 3: Acessar o App
Após salvar, o GitHub vai te dar o link do seu site (algo como `https://seu-usuario.github.io/rpg-sheet/`).
Acesse esse link no seu celular.

## 3. Instalar como App (PWA)

1. **Android (Chrome)**: Toque nos três pontinhos > "Instalar aplicativo" ou "Adicionar à tela inicial".
2. **iOS (Safari)**: Toque no botão de Compartilhar > "Adicionar à Tela de Início".
3. **Desktop (Chrome/Edge)**: Um ícone de instalação aparecerá na barra de endereço.

## Resolução de Problemas

- **Tela Branca?**
  Se o site abrir em branco, verifique se o repositório no GitHub se chama exatamente `rpg_pc_sheet`. Se tiver outro nome, altere a propriedade `base` no arquivo `vite.config.js` para `/nome-do-seu-repo/`.

- **Ícones não aparecem?**
  Verifique se os arquivos `pwa-192x192.png` e `pwa-512x512.png` estão na pasta `public`.
