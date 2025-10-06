## Spotify

## ❯ Descrição do Projeto

Este é um projeto feito, para conseguir pesquisar, os seus artistas preferidos, seus albuns e suas musicas, utilizando a API do spotify.



##  Tecnologias Utilizadas

* **Framework:** Angular v18+ 
* **Arquitetura:** Standalone Components 
* **Gerenciamento de Estado:** Angular Signals 
* **Estilização:** SCSS 
* **Roteamento:** Angular Router 
* **API:** Spotify Public API 
* **Deploy:** Vercel 

---

## Como Rodar o Projeto Localmente

Siga os passos abaixo para executar o projeto em sua máquina.

**Pré-requisitos:**
* Node.js (versão 18 ou superior)
* Angular CLI (versão 18 ou superior)

**1. Clone o repositório:**
```bash
git clone https://github.com/luizgustavo06/teste-spotify.git
```



**2. Instale as dependências:**
```bash
npm install
```

**3. Configure as variáveis de ambiente:**
Conforme solicitado, as credenciais da API do Spotify devem ser gerenciadas por meio de variáveis de ambiente.

Crie o arquivo `src/environments/environment.ts` e adicione seu `Client ID` e `Client Secret`:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  spotify: {
    // Exemplo usando as suas credenciais salvas:
    clientId: 'bba88f1de4b24af2b545ad9db44860b4',
    clientSecret: '617eac89cf0f48a3b0167a1ff3e1d8f3'
  }
};
```

**4. Execute a aplicação:**
```bash
ng serve -o
```

A aplicação será iniciada e estará acessível em `http://localhost:4200/`.