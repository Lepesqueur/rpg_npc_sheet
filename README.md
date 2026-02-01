# Ficha de RPG - NPC (PWA)

Bem-vindo à **Ficha de NPC (Non-Player Character)** para RPG. Esta é uma versão simplificada e otimizada para o Mestre de Jogo (GM), permitindo o gerenciamento rápido de múltiplos personagens em uma única interface. 

> [!NOTE]
> Se você procura a **Ficha de Personagem (PC)** completa e detalhada para jogadores, confira o [outro projeto aqui](https://github.com/lepesqueur/rpg_npc_sheet/).

Trata-se de uma PWA (Progressive Web App) criada para gerenciar fichas de NPC com estilo, agilidade e automação. O sistema de regras é *homebrew*, idealizado por **Arthur Lobato**.

## 👥 Biblioteca de NPCs (GM Tool)

A principal diferença desta versão é a **Biblioteca de Personagens**. Diferente da ficha de jogador única, aqui o mestre pode:
*   **Criar múltiplos NPCs** rapidamente durante a sessão.
*   **Duplicar fichas** para criar variações de inimigos (ex: Guardas, Bandidos).
*   **Alternar instantaneamente** entre diferentes fichas sem recarregar a página.
*   **Gerenciar encontros** de forma muito mais fluida com todos os stats essenciais em uma visão consolidada.

## 🤖 Humans + AI (O tal do Tech Showcase)

Basicamente, este repositório é a prova de que humanos e inteligências artificiais podem trabalhar juntos sem que a Skynet tome conta de tudo (por enquanto).

*   **A Cara (UI/UX)**: Cozinhada no **Google Stitch**. Eu pedi "algo moderno", ele entregou Glassmorphism, temas Cyberpunk e transições suaves. Não reclamei.
*   **O Cérebro (Code)**: A arquitetura e o código pesado foram feitos em *pair programming* com o **Google Antigravity**. Eu arquitetava e validava, ele codava e sugeria as melhores práticas. Uma dupla dinâmica.

## 🎲 O Sistema (Genialidade na Simplicidade)

O sistema de regras, criado pelo **Arthur Lobato**, é aquele tipo de *homebrew* que parece simples à primeira vista, mas esconde uma profundidade mecânica brilhante.

A parte mais legal? **Fazer este app foi a minha maneira de aprender as regras.**

Ao transformar as mecânicas de jogo em lógica de código (`if`, `else`, `state`), fui obrigado a entender cada minúcia do sistema. Se o código funciona, é porque eu entendi a regra. É a engenharia reversa do RPG: aprender jogando... linhas de código.

## ✨ Principais Funcionalidades

*   **Biblioteca de Personagens**: Crie, clone, mude e apague NPCs dinamicamente.
*   **Visão Simplificada**: Interface limpa focada nos stats que o mestre precisa ver rápido (Atributos, Percepção, Velocidade, Combate).
*   **Temas Visuais**: Suporte a múltiplos temas (Atualmente **Cyberpunk** e **Medieval/Pergaminho**).
*   **Automação de Regras**: Cálculos automáticos de bônus, custos de habilidades e rolagens de dados.
*   **Gestão de Recursos**: Controle fácil de **Vitalidade**, **Focus** e **Vontade**.
*   **Sistema de Combate**: Área dedicada para Defesa, Resistências e Condições Ativas.
*   **Persistência Local**: Toda a sua biblioteca de NPCs é salva automaticamente no navegador (LocalStorage).

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
