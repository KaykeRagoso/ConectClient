import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../bancodedados/firebaseConfig'; // Importa a configuração do Firebase
import { useNavigation } from '@react-navigation/native'; // Hook para navegação entre telas

// Componente principal da tela de login
export default function LoginScreen() {
  const [email, setEmail] = useState(''); // Estado para armazenar o e-mail do usuário
  const [password, setPassword] = useState(''); // Estado para armazenar a senha do usuário
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
  const navigation = useNavigation(); // Hook para navegação

  // Função para realizar o login do usuário
  const handleLogin = async () => {
    // Verifica se os campos de e-mail e senha estão preenchidos
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Erro', 'Preencha todos os campos.'); // Exibe um alerta se algum campo estiver vazio
      return;
    }

    try {
      // Tenta autenticar o usuário com o Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('MenuLateral'); // Redireciona para a tela principal após o login bem-sucedido
    } catch (error) {
      console.error('Erro ao fazer login:', error); // Loga o erro no console
      Alert.alert('Erro no login', 'E-mail ou senha incorretos.'); // Exibe um alerta em caso de erro
    }
  };

  // Função para navegar para a tela de cadastro
  const goToCadastro = () => {
    navigation.navigate('Cadastro'); // Redireciona para a tela de cadastro
  };

  return (
    <View style={styles.container}>
      {/* Título da tela */}
      <Text style={styles.title}>Bem-vindo ao ConectCliente!</Text>

      {/* Campo de entrada para o e-mail */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail} // Atualiza o estado com o texto digitado
        autoCapitalize="none" // Desativa a capitalização automática
        keyboardType="email-address" // Define o teclado como específico para e-mails
      />

      {/* Campo de entrada para a senha */}
      <View style={styles.inputSenhaContainer}>
        <TextInput
          style={styles.inputSenha}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword} // Atualiza o estado com o texto digitado
          secureTextEntry={!showPassword} // Oculta ou exibe a senha com base no estado
        />
        {/* Botão para alternar a visibilidade da senha */}
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.botaoOlho}>
          <Text style={styles.textoOlho}>
            {showPassword ? '🙈' : '👁️'} {/* Ícone para exibir ou ocultar a senha */}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão para realizar o login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Botão para navegar para a tela de cadastro */}
      <TouchableOpacity onPress={goToCadastro} style={styles.signupButton}>
        <Text style={styles.signupText}>Não Possui uma Conta? Criar uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo o espaço disponível
    justifyContent: 'center', // Centraliza os elementos verticalmente
    paddingHorizontal: 20, // Espaçamento horizontal interno
    backgroundColor: '#fff', // Cor de fundo branca
  },
  title: {
    fontSize: 24, // Tamanho da fonte do título
    fontWeight: 'bold', // Texto em negrito
    alignSelf: 'center', // Centraliza o texto horizontalmente
    marginBottom: 40, // Espaçamento inferior
  },
  input: {
    height: 50, // Altura do campo de entrada
    borderColor: '#ccc', // Cor da borda
    borderWidth: 1, // Largura da borda
    paddingHorizontal: 10, // Espaçamento interno horizontal
    borderRadius: 10, // Bordas arredondadas
    marginBottom: 16, // Espaçamento inferior
  },
  inputSenhaContainer: {
    flexDirection: 'row', // Organiza os elementos em linha
    alignItems: 'center', // Alinha os elementos verticalmente
    borderColor: '#ccc', // Cor da borda
    borderWidth: 1, // Largura da borda
    borderRadius: 10, // Bordas arredondadas
    marginBottom: 16, // Espaçamento inferior
    paddingHorizontal: 10, // Espaçamento interno horizontal
    backgroundColor: '#fff', // Cor de fundo branca
  },
  inputSenha: {
    flex: 1, // Ocupa o espaço restante na linha
    height: 50, // Altura do campo de entrada
    fontSize: 16, // Tamanho da fonte
  },
  botaoOlho: {
    paddingHorizontal: 8, // Espaçamento interno horizontal
    paddingVertical: 10, // Espaçamento interno vertical
  },
  textoOlho: {
    fontSize: 18, // Tamanho da fonte do ícone
  },
  button: {
    backgroundColor: '#007AFF', // Cor de fundo do botão
    padding: 12, // Espaçamento interno
    marginHorizontal: 20, // Espaçamento horizontal externo
    borderRadius: 10, // Bordas arredondadas
    alignItems: 'center', // Centraliza o texto no botão
    alignSelf: 'center', // Centraliza o botão horizontalmente
    width: '50%', // Largura do botão
  },
  buttonText: {
    color: '#fff', // Cor do texto do botão
    fontWeight: 'bold', // Texto em negrito
  },
  signupButton: {
    marginTop: 20, // Espaçamento superior
    alignItems: 'center', // Centraliza o texto
  },
  signupText: {
    color: '#007AFF', // Cor do texto
    fontSize: 16, // Tamanho da fonte
    fontWeight: 'bold', // Texto em negrito
  },
});
