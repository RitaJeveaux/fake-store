# Fakely - Sua Loja Online Fictícia

Fakely é uma loja online totalmente funcional, desenvolvida como parte de um projeto de estudo. A aplicação consome a [FakeStoreAPI](https://fakestoreapi.com/) para exibir e gerenciar produtos, implementando um sistema CRUD completo.

O projeto conta com uma vitrine de produtos, uma área administrativa protegida para gerenciamento e um sistema de login para controle de acesso.

**[Acesse a demonstração ao vivo aqui!](https://ritajeveaux.github.io/fake-store/index.html)**

## ✨ Funcionalidades

*   **Vitrine de Produtos (`index.html`):** Página principal que exibe todos os produtos disponíveis, com um design limpo e moderno criado com CSS3 puro.
*   **Sistema de Login (`login.html`):** Autenticação de usuários para acesso a áreas restritas.
*   **Painel Administrativo (`admin.html`):** Uma área exclusiva para administradores, onde é possível:
    *   **C**riar (Create) novos produtos.
    *   **L**er (Read) os detalhes dos produtos existentes.
    *   **A**tualizar (Update) informações dos produtos.
    *   **E**xcluir (Delete) produtos do catálogo.

## 🔑 Acesso e Login

A aplicação utiliza os dados de login fornecidos pela FakeStoreAPI. Para testar as funcionalidades, você pode usar as seguintes credenciais:

### Acesso de Administrador

Apenas o usuário `johnd` possui permissões para acessar o painel administrativo e gerenciar os produtos.

*   **Usuário:** `johnd`
*   **Senha:** `m38rmF$`

### Acesso de Usuário Comum

Qualquer outro usuário da API pode fazer login, mas não terá acesso à página de administração. Exemplo:

*   **Usuário:** `mor_2314`
*   **Senha:** `83r5^_`

## 🛠️ Tecnologias Utilizadas

*   **HTML5**
*   **CSS3:** Utilizado para a estilização completa da página principal (`index.html`).
*   **Bootstrap:** Framework utilizado para agilizar o design da página de administração (`admin.html`).
*   **JavaScript:** Responsável por toda a lógica da aplicação, manipulação do DOM e comunicação com a API.
*   **FakeStoreAPI:** API REST utilizada como backend para fornecer os dados dos produtos e usuários.

---

*A identidade visual, o nome "Fakely", a paleta de cores e o logo foram criados em colaboração com o ChatGPT (OpenAI), explorando a criatividade e a inteligência artificial no processo de design.*