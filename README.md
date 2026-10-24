# Portfólio do Junior

Portfólio estático feito com React, JavaScript e Vite. O conteúdo pessoal fica concentrado em `src/data/portfolio.js`; não há backend nem formulário que finja enviar mensagens.

## Rodar no computador

É necessário ter Node.js 22.12 ou mais recente e npm.

```bash
npm ci
npm run dev
```

O Vite mostra no terminal o endereço local para abrir no navegador. Para gerar e conferir a versão de produção:

```bash
npm run build
npm run preview
```

Os arquivos prontos para hospedagem são gerados na pasta `dist/`.

## Personalizar

Abra `src/data/portfolio.js` para editar:

- **Nome:** campo `name`.
- **Usuário ou perfil do GitHub:** campo `githubUrl`, com o endereço completo do perfil.
- **E-mail:** campo `email`, sem o prefixo `mailto:`.
- **LinkedIn:** campo `linkedinUrl`, com o endereço completo do perfil.
- **Apresentação e trajetória:** campos `introduction` e `about`.
- **Tecnologias:** grupos e itens em `skillGroups`.
- **Projetos:** itens na lista `projects`.

Cada projeto aceita `title`, `description`, `technologies`, `image`, `imageAlt`, `githubUrl`, `demoUrl` e `status`. Os campos de imagem e links são opcionais. Para uma imagem local, salve o arquivo em `public/images/` e use um caminho como `images/meu-projeto.png`. Deixe `projects` vazio enquanto não houver projetos com informações reais; a página mostrará uma mensagem discreta no lugar da lista.

Os links pessoais sem valor não aparecem como links na navegação e na seção de contato. Configure apenas perfis e endereços reais.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie os arquivos deste projeto para a branch `main` ou `master`.
2. No repositório, abra **Settings → Pages** e escolha **GitHub Actions** como fonte de publicação.
3. A cada envio para `main` ou `master`, o workflow `.github/workflows/deploy.yml` instala as dependências, gera `dist/` e publica o site.

O caminho base é definido no passo de build do workflow: repositórios de projeto recebem automaticamente `/<nome-do-repositorio>/`; um repositório pessoal chamado `<usuario>.github.io` recebe `/`. Para uma compilação local com um caminho específico, defina `VITE_BASE_PATH` antes de executar `npm run build`; sem essa variável, o caminho padrão é `/`.

Não é preciso manter um servidor Node.js no ar. O Node.js é usado durante a instalação e a compilação; o GitHub Pages serve os arquivos estáticos.
