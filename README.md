# Ficha de RPG - PC (PWA)

Bem-vindo à **Ficha de Personagem de RPG** do futuro (ou quase isso). Trata-se de uma PWA (Progressive Web App) — ou seja, um site que finge muito bem ser um aplicativo nativo — criada para gerenciar fichas de RPG com estilo, automação e zero papelada. O sistema de regras é *homebrew*, idealizado pelo meu amigo **Arthur Lobato**.

> **⚠️ SPOILER / DISCLAIMER**: Sim, este projeto serve como portfólio, mas também foi uma ótima desculpa para eu brincar com as novas IAs do Google e ver se elas aguentam o tranco no "mundo real".

## 🤖 Humans + AI (O tal do Tech Showcase)

Basicamente, este repositório é a prova de que humanos e inteligências artificiais podem trabalhar juntos sem que a Skynet tome conta de tudo (por enquanto).

*   **A Cara (UI/UX)**: Cozinhada no **Google Stitch**. Eu pedi "algo moderno", ele entregou Glassmorphism, temas Cyberpunk e transições suaves. Não reclamei.
*   **O Cérebro (Code)**: A arquitetura e o código pesado foram feitos em *pair programming* com o **Google Antigravity**. Eu arquitetava e validava, ele codava e sugeria as melhores práticas. Uma dupla dinâmica.

## 🎲 O Sistema (Genialidade na Simplicidade)

O sistema de regras, criado pelo **Arthur Lobato**, é aquele tipo de *homebrew* que parece simples à primeira vista, mas esconde uma profundidade mecânica brilhante.

A parte mais legal? **Fazer este app foi a minha maneira de aprender as regras.**

Ao transformar as mecânicas de jogo em lógica de código (`if`, `else`, `state`), fui obrigado a entender cada minúcia do sistema. Se o código funciona, é porque eu entendi a regra. É a engenharia reversa do RPG: aprender jogando... linhas de código.

Tudo no sistema gira em torno da **centralidade da gestão de recursos**. Aqui a "economia" é baseada em três pilares: **Vitalidade, Vontade e Foco**. Cada ação consome algo, e gerenciar essa escassez é o que separa os heróis dos cadáveres. 

📚 **Em Breve no Mundo Real**: O sistema é tão bom que vai transcender o digital. Um **Livro Físico** está sendo preparado para espalhar a palavra pelo mundo. Fiquem ligados.

## � Status: Obras & Updates (Acalmem os ânimos)

O app está funcional, mas não está finalizado. Por quê? Porque o sistema do RPG ainda está em fase de "Beta Test Raiz".

Estamos esperando as regras se estabilizarem nas mesas de jogo antes de implementar novas funcionalidades. Afinal, ninguém quer codar um sistema complexo hoje para ter que refazer tudo amanhã.

## �📋 Natureza e Propósito

A ideia é simples: substituir aquela ficha de papel amassada e cheia de marcas de borracha por algo digital que roda no seu celular ou PC. Além de salvar árvores, serve como meu atestado de que sei fazer **PWAs** bonitas e funcionais.

O objetivo principal é agilizar a matemática e a gestão de recursos do jogo, permitindo que o jogador foque na narrativa e na interpretação.

## ✨ Principais Funcionalidades

*   **Temas Visuais**: Suporte a múltiplos temas (Atualmente **Cyberpunk** e **Medieval/Pergaminho**), adaptando-se à ambientação da sua campanha.
*   **Automação de Regras**: Cálculos automáticos de bônus, custos de habilidades e rolagens de dados.
*   **Gestão de Recursos**: Controle fácil de **Vitalidade**, **Focus** e **Vontade**, com validação de custos para ações.
*   **Sistema de Combate**: Área dedicada para Defesa, Resistências e Condições Ativas.
*   **Inventário e Notas**: Gerenciamento de itens, biografia e anotações gerais.
*   **Persistência Local**: Todos os dados são salvos automaticamente no navegador do usuário (LocalStorage), garantindo que nada seja perdido ao fechar a aba.

## 🛠️ Tecnologias

O projeto é construído com tecnologias web modernas visando performance e facilidade de manutenção:

*   **[React](https://react.dev/)**: Biblioteca principal para construção da interface.
*   **[Vite](https://vitejs.dev/)**: Build tool rápida e leve.
*   **[Tailwind CSS](https://tailwindcss.com/)**: Framework de estilização para um design responsivo e customizável.
*   **Context API**: Para gerenciamento global do estado do personagem.
*   **Vite PWA Plugin**: Para capacidades de instalação e cache offline.

## 🚀 Como Executar Localmente

Para rodar o projeto em sua máquina para desenvolvimento ou testes:

1.  **Pré-requisitos**: Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2.  **Instalação**:
    Na pasta raiz do projeto, execute:
    ```bash
    npm install
    ```
3.  **Execução**:
    Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    Acesse a URL indicada no terminal (geralmente `http://localhost:5173`).

## 📦 Build e Deploy

Para gerar a versão de produção (otimizada):

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist/`.

## ℹ️ Informações Importantes

*   **Edição**: A ficha possui um "Modo de Edição" (ícone de lápis) que deve ser ativado para modificar atributos base e informações estruturais do personagem. Durante o jogo, o modo de edição geralmente fica desligado para evitar alterações acidentais.
*   **Dados**: Como os dados (não dos D20) ficam no LocalStorage, limpar o cache do navegador pode apagar sua ficha. Exporte seus dados ou evite limpar dados de site para este domínio.
