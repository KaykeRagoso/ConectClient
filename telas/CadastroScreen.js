import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../bancodedados/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

// Componente principal da tela de cadastro
export default function CadastroScreen() {
  // Estados para armazenar os valores dos campos de entrada
  const [name, setName] = React.useState(""); // Nome do usuário
  const [email, setEmail] = React.useState(""); // E-mail do usuário
  const [telefone, setTelefone] = React.useState(""); // Telefone do usuário
  const [password, setPassword] = React.useState(""); // Senha do usuário
  const [showPassword, setShowPassword] = React.useState(false); // Controle para exibir ou ocultar a senha

  const navigation = useNavigation(); // Hook para navegação entre telas

  // Função para validar o formato do e-mail
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Função para formatar o número de telefone
  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (numeros.length <= 10) {
      // Formata para números com até 10 dígitos
      return numeros.replace(/(\d{2})(\d{0,4})(\d{0,4})/, function (_, ddd, parte1, parte2) {
        let telefoneFormatado = "";
        if (ddd) telefoneFormatado += `(${ddd}`;
        if (parte1) telefoneFormatado += `) ${parte1}`;
        if (parte2) telefoneFormatado += `-${parte2}`;
        return telefoneFormatado;
      });
    } else {
      // Formata para números com 11 dígitos (DDD + 9 + número)
      return numeros.replace(/(\d{2})(\d{0,5})(\d{0,4})/, function (_, ddd, parte1, parte2) {
        let telefoneFormatado = "";
        if (ddd) telefoneFormatado += `(${ddd}`;
        if (parte1) telefoneFormatado += `) ${parte1}`;
        if (parte2) telefoneFormatado += `-${parte2}`;
        return telefoneFormatado;
      });
    }
  };

  // Função para atualizar o estado do telefone com o valor formatado
  const handleTelefoneChange = (valor) => {
    const somenteNumeros = valor.replace(/\D/g, ""); // Remove caracteres não numéricos
    setTelefone(formatarTelefone(somenteNumeros)); // Atualiza o estado com o telefone formatado
  };

  // Função para salvar o cadastro do usuário
  const salvarCadastro = async () => {
    // Verifica se todos os campos estão preenchidos
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      telefone.trim() === "" ||
      password.trim() === ""
    ) {
      Alert.alert("Erro", "Preencha todos os campos antes de cadastrar.");
      return;
    }

    // Valida o formato do e-mail
    if (!isValidEmail(email.trim())) {
      Alert.alert("Erro", "E-mail inválido. Verifique o endereço digitado.");
      return;
    }

    // Valida o número de telefone (deve conter 11 dígitos)
    const telefoneLimpo = telefone.replace(/\D/g, "");
    if (telefoneLimpo.length !== 11) {
      Alert.alert(
        "Erro",
        "O número de telefone deve conter 11 dígitos (ex: DDD + 9 + número)."
      );
      return;
    }

    try {
      // Verifica se o e-mail já está cadastrado
      const methods = await fetchSignInMethodsForEmail(auth, email.trim());
      if (methods.length > 0) {
        Alert.alert(
          "E-mail já cadastrado",
          "Esse e-mail já está em uso. Tente fazer login ou usar outro endereço.",
          [
            { text: "Ir para Login", onPress: () => goToLogin() },
            { text: "OK" },
          ]
        );
        return;
      }

      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      // Salva os dados do usuário no Firestore
      await addDoc(collection(db, "usuarios"), {
        uid: user.uid,
        nomeUsuario: name.trim(),
        emailUsuario: email.trim(),
        telefoneUsuario: telefone.trim(),
      });

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");

      // Limpa os campos após o cadastro
      setName("");
      setEmail("");
      setTelefone("");
      setPassword("");

      // Navega para a tela de login após o cadastro bem-sucedido
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      Alert.alert("Erro ao cadastrar", error.message);
    }
  };

  // Função para navegar para a tela de login
  const goToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cadastre-se</Text>

      {/* Campo de entrada para o nome */}
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Digite seu Nome Completo"
      />

      {/* Campo de entrada para o e-mail */}
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Digite seu E-Mail"
        keyboardType="email-address"
      />

      {/* Campo de entrada para o telefone */}
      <TextInput
        style={styles.input}
        onChangeText={(valor) => setTelefone(formatarTelefone(valor))}
        value={telefone}
        keyboardType="numeric"
        placeholder="Digite seu Telefone (ex: (21) 98765-4321)"
        maxLength={15}
      />

      {/* Campo de entrada para a senha */}
      <View style={styles.inputSenhaContainer}>
        <TextInput
          style={styles.inputSenha}
          onChangeText={setPassword}
          value={password}
          placeholder="Digite sua Senha"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.botaoOlho}
        >
          <Text style={styles.textoOlho}>{showPassword ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>

      {/* Botão para salvar o cadastro */}
      <TouchableOpacity style={styles.button} onPress={salvarCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      {/* Botão para navegar para a tela de login */}
      <TouchableOpacity onPress={goToLogin} style={styles.signinButton}>
        <Text style={styles.signupText}>Entrar com uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 40,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "#ccc",
  },
  inputSenhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  inputSenha: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  botaoOlho: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  textoOlho: {
    fontSize: 18,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "50%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  signinButton: {
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
