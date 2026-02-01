# ConectClient

ConectClient é uma aplicação **mobile** desenvolvida em **React Native**, focada na **gestão e agendamento de serviços**, com autenticação de usuários, atendimento interativo e integração completa com o **Firebase**.

O projeto foi criado com foco em **resolver problemas reais de pequenos negócios**, oferecendo uma experiência simples, intuitiva e organizada para clientes e prestadores de serviço.

---

## 🎯 Objetivo do Projeto

Criar uma aplicação mobile capaz de:

* Centralizar o agendamento de serviços
* Facilitar a comunicação entre cliente e empresa
* Armazenar dados de forma segura em nuvem
* Oferecer uma experiência de uso clara e fluida

Este projeto simula um cenário real de produção, aplicando boas práticas de organização de código, navegação e integração com backend em nuvem.

---

## ✨ Funcionalidades Principais

* **Autenticação de Usuários**

  * Login e cadastro com Firebase Authentication

* **Menu Lateral Personalizado**

  * Navegação intuitiva entre as funcionalidades do app

* **Agendamento de Serviços**

  * Seleção e visualização de datas para agendamento

* **Atendimento Interativo**

  * Chat para coleta de informações do cliente
  * Persistência dos dados no Firestore

* **Lista de Serviços**

  * Exibição de serviços disponíveis com descrições detalhadas

* **Feedback de Usuários**

  * Envio de avaliações e comentários

* **Contato e Suporte**

  * Informações de contato e envio de e-mails diretamente pelo app

---

## 🛠️ Tecnologias Utilizadas

* **React Native** – Desenvolvimento mobile multiplataforma
* **Expo** – Ambiente de desenvolvimento e execução
* **Firebase**

  * Authentication – Login e cadastro de usuários
  * Firestore – Banco de dados em nuvem
* **React Navigation** – Gerenciamento de navegação entre telas
* **AsyncStorage** – Persistência local de dados

---

## 🗂️ Estrutura do Projeto

```
ConectClient/
├── App.js                 # Entry point da aplicação
├── package.json           # Dependências e scripts
├── .env                   # Variáveis de ambiente (não versionado)
├── src/
│   ├── config/
│   │   └── firebaseConfig.js   # Configuração do Firebase
│   ├── components/
│   │   └── CustomDrawerContent.js
│   ├── navigation/
│   │   └── MenuLateral.js
│   ├── screens/
│   │   ├── AuthLoading.js
│   │   ├── LoginScreen.js
│   │   ├── CadastroScreen.js
│   │   ├── AgendamentoScreen.js
│   │   ├── AtendimentoScreen.js
│   │   ├── ListaServicoScreen.js
│   │   ├── ContatosScreen.js
│   │   └── FeedbackScreen.js
│   └── services/
│       └── authService.js
```

---

## 🚀 Como Executar o Projeto

1. Clone o repositório:

```bash
git clone https://github.com/KaykeRagoso/ConectClient.git
cd ConectClient
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o Firebase:

* Crie um projeto no Firebase
* Substitua as credenciais no arquivo `firebaseConfig.js`

4. Execute o aplicativo:

```bash
npx expo start
```

* Utilize o **Expo Go** para testar no dispositivo físico
* Ou execute em um emulador Android/iOS

---

## 📱 Telas da Aplicação

* Login e Cadastro
* Menu Lateral de Navegação
* Agendamento de Serviços
* Atendimento Interativo
* Lista de Serviços
* Feedback de Usuários
* Contato e Suporte

---

## 📌 Próximas Melhorias (Roadmap)

* Notificações push para lembretes de agendamento
* Painel administrativo para prestadores de serviço
* Validações avançadas de formulários
* Melhorias de UI/UX

---

## 🤝 Contribuição

Contribuições são bem-vindas!
Sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

---

## 📄 Licença

Este projeto está sob a licença **MIT**.

---

Desenvolvido por **Kayke Ragoso** 🚀

> Projeto criado com foco em aprendizado prático, boas práticas e simulação de ambiente real de desenvolvimento.
