# ConectClient

ConectClient é um aplicativo desenvolvido em React Native que utiliza Firebase para autenticação, banco de dados e armazenamento. Ele oferece funcionalidades como agendamento de serviços, atendimento interativo, cadastro de usuários, feedback e muito mais.

## 📋 Funcionalidades

- **Login e Cadastro**: Autenticação de usuários com Firebase Authentication.
- **Menu Lateral Personalizado**: Navegação intuitiva com um menu lateral customizado.
- **Agendamento de Serviços**: Visualização e seleção de datas para agendamento de serviços.
- **Atendimento Interativo**: Chat interativo para coletar informações do cliente e salvar pedidos no Firebase.
- **Lista de Serviços**: Exibição de serviços disponíveis com descrições detalhadas.
- **Feedback**: Envio de avaliações e comentários sobre os serviços.
- **Contato**: Informações de suporte e envio de e-mails diretamente pelo aplicativo.

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile.
- **Firebase**:
  - Authentication: Gerenciamento de login e cadastro.
  - Firestore: Banco de dados para armazenar informações de usuários, pedidos e feedbacks.
- **React Navigation**: Navegação entre telas.
- **Expo**: Ferramenta para desenvolvimento e execução do aplicativo.
- **AsyncStorage**: Armazenamento local para persistência de dados no dispositivo.

## 📂 Estrutura do Projeto
ConectClient/
├── App.js                          # Componente principal do app (entry point)
├── .gitignore                     # Ignora arquivos sensíveis e desnecessários
├── .env                           # Variáveis de ambiente (não subir)
├── package.json                   # Dependências e scripts do projeto

├── src/                           # Código-fonte organizado
│   ├── config/
│   │   └── firebaseConfig.js      # Configuração do Firebase

│   ├── components/
│   │   └── CustomDrawerContent.js # Menu lateral personalizado

│   ├── navigation/
│   │   └── MenuLateral.js         # Configuração do menu e navegação

│   ├── screens/
│   │   ├── AuthLoading.js         # Tela de carregamento/autenticação
│   │   ├── LoginScreen.js         # Tela de login
│   │   ├── CadastroScreen.js      # Tela de cadastro
│   │   ├── AgendamentoScreen.js   # Tela de agendamento
│   │   ├── AtendimentoScreen.js   # Tela de atendimento interativo
│   │   ├── ListaServicoScreen.js  # Tela de lista de serviços
│   │   ├── ContatosScreen.js      # Tela de contato
│   │   └── FeedbackScreen.js      # Tela de feedback

│   └── services/                  # Lógica de conexão com o banco ou APIs (separável)
│       └── authService.js         # (exemplo) lógica de login/cadastro

## 🚀 Como Executar o Projeto

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/ConectClient.git
   cd ConectClient
2. **Instale as dependências:**

3. **Configure o Firebase:**

Substitua as credenciais no arquivo firebaseConfig.js com as informações do seu projeto Firebase.
4. **Execute o aplicativo:**

5. **Teste no emulador ou dispositivo físico:**

Use o aplicativo Expo Go para testar no dispositivo físico.
Ou execute no emulador Android/iOS.

## 📱 Telas do Aplicativo
Login: Tela inicial para autenticação.
Cadastro: Tela para criar uma nova conta.
Menu Lateral: Navegação entre as funcionalidades do aplicativo.
Agendamento: Seleção de datas para serviços.
Atendimento: Chat interativo para coleta de informações.
Lista de Serviços: Exibição de serviços disponíveis.
Feedback: Envio de avaliações e comentários.
Contato: Informações de suporte e envio de e-mails.
🧑‍💻 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

📄 Licença
Este projeto está sob a licença MIT. Consulte o arquivo LICENSE para mais informações.

Desenvolvido com ❤️ por Kayke Ragoso.
