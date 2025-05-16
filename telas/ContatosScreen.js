import React from 'react';
import { Text, ScrollView, StyleSheet, TouchableOpacity, Linking, StatusBar } from 'react-native';

// Componente principal da tela de contato
export default function ContatoScreen() {
  // Função para enviar um e-mail ao suporte
  const sendEmail = () => {
    const email = 'kaykelucas47@gmail.com'; // Endereço de e-mail do suporte
    const subject = 'Suporte'; // Assunto do e-mail
    const body = 'Olá, estou precisando de ajuda com...'; // Corpo do e-mail

    // Monta a URL para abrir o cliente de e-mail
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(url).catch(err => console.error('Erro ao abrir o email:', err)); // Abre o cliente de e-mail ou exibe um erro
  };

  return (
    <ScrollView style={styles.container}>
      {/* Configura a barra de status */}
      <StatusBar barStyle="dark-content" />

      {/* Título da tela */}
      <Text style={styles.titulo}>Contato</Text>

      {/* Informações de contato */}
      <Text style={styles.texto}>
        Contato do Suporte{'\n'}+55 (XX) 00000-0000
      </Text>

      {/* Botão para enviar e-mail */}
      <TouchableOpacity style={styles.botao} onPress={sendEmail}>
        <Text style={styles.textoBotao}>Enviar E-mail para o Suporte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo o espaço disponível
    padding: 8, // Espaçamento interno
    backgroundColor: 'white', // Cor de fundo branca
  },
  titulo: {
    fontSize: 24, // Tamanho da fonte do título
    fontWeight: 'bold', // Texto em negrito
    textAlign: 'center', // Centraliza o texto
    marginTop: 40, // Espaçamento superior
    marginBottom: 20, // Espaçamento inferior
  },
  texto: {
    fontSize: 16, // Tamanho da fonte do texto
    textAlign: 'center', // Centraliza o texto
  },
  botao: {
    backgroundColor: '#007AFF', // Cor de fundo do botão
    borderRadius: 8, // Bordas arredondadas
    paddingVertical: 12, // Espaçamento vertical interno
    paddingHorizontal: 20, // Espaçamento horizontal interno
    marginTop: 40, // Espaçamento superior
    marginHorizontal: '10%', // Espaçamento horizontal
    alignItems: 'center', // Centraliza o texto no botão
  },
  textoBotao: {
    color: 'white', // Cor do texto do botão
    fontSize: 16, // Tamanho da fonte do texto do botão
    fontWeight: 'bold', // Texto em negrito
  },
});
