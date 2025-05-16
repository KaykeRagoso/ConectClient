import { Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { Rating } from 'react-native-ratings';
import { db } from '../bancodedados/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Componente principal da tela de feedback
export default function FeedbackScreen() {
  const [text, onChangeText] = React.useState(''); // Estado para armazenar o texto do feedback
  const [rating, setRating] = React.useState(3); // Estado para armazenar a nota de avaliação (padrão: 3)
  const auth = getAuth(); // Obtém a instância de autenticação do Firebase

  // Função para salvar a avaliação no Firestore
  const salvarAvaliacao = async () => {
    // Verifica se o campo de texto está vazio
    if (text.trim() === '') {
      Alert.alert('Erro', 'Digite um comentário antes de salvar a avaliação.');
      return;
    }

    const usuario = auth.currentUser; // Obtém o usuário autenticado

    // Verifica se o usuário está autenticado
    if (!usuario) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    try {
      // Salva a avaliação no Firestore na coleção "feedback"
      await addDoc(collection(db, 'feedback'), {
        texto: text, // Texto do feedback
        rating: rating, // Nota de avaliação
        email: usuario.email || 'Email não disponível', // E-mail do usuário
        data: new Date(), // Data e hora do feedback
      });

      Alert.alert('Feedback Concluído'); // Exibe mensagem de sucesso
      onChangeText(''); // Limpa o campo de texto
      setRating(3); // Reseta a nota de avaliação para o padrão
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error); // Loga o erro no console
      Alert.alert('Erro', 'Ocorreu um erro ao salvar sua avaliação.'); // Exibe mensagem de erro
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Título da tela */}
      <Text style={styles.texto}>Avalie sua Experiência</Text>

      {/* Componente de avaliação por estrelas */}
      <Rating
        showRating // Exibe a descrição da nota selecionada
        onFinishRating={setRating} // Atualiza o estado com a nota selecionada
        style={styles.rating}
        ratingCount={5} // Número máximo de estrelas
        startingValue={rating} // Valor inicial da avaliação
      />

      {/* Campo de texto para o feedback */}
      <TextInput
        style={styles.entrarTexto}
        onChangeText={onChangeText} // Atualiza o estado com o texto digitado
        value={text} // Valor atual do campo de texto
        placeholder="Faça a sua avaliação" // Texto de placeholder
        multiline // Permite múltiplas linhas
      />

      {/* Botão para salvar a avaliação */}
      <TouchableOpacity style={styles.salvar} onPress={salvarAvaliacao}>
        <Text style={styles.text_botao}>Salvar Avaliação</Text>
      </TouchableOpacity>

      {/* Texto de rodapé */}
      <Text style={styles.footerTexto}>Como foi sua Experiência?</Text>
    </ScrollView>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo o espaço disponível
    paddingTop: '20%', // Espaçamento superior
    backgroundColor: 'white', // Cor de fundo branca
  },
  texto: {
    fontSize: 20, // Tamanho da fonte do título
    fontWeight: 'bold', // Texto em negrito
    textAlign: 'center', // Centraliza o texto
  },
  footerTexto: {
    fontSize: 16, // Tamanho da fonte do texto do rodapé
    fontWeight: 'bold', // Texto em negrito
    textAlign: 'center', // Centraliza o texto
    marginTop: '40%', // Espaçamento superior
  },
  entrarTexto: {
    marginTop: '10%', // Espaçamento superior
    height: 80, // Altura do campo de texto
    margin: 12, // Espaçamento externo
    borderWidth: 1, // Largura da borda
    padding: 10, // Espaçamento interno
    marginHorizontal: 20, // Espaçamento horizontal
    borderRadius: 10, // Bordas arredondadas
    textAlignVertical: 'top', // Alinha o texto ao topo
  },
  rating: {
    paddingVertical: '10%', // Espaçamento vertical
  },
  salvar: {
    backgroundColor: '#007AFF', // Cor de fundo do botão
    padding: 12, // Espaçamento interno
    marginHorizontal: 20, // Espaçamento horizontal
    borderRadius: 10, // Bordas arredondadas
    alignItems: 'center', // Centraliza o texto no botão
    alignSelf: 'center', // Centraliza o botão
    width: '50%', // Largura do botão
  },
  text_botao: {
    color: 'white', // Cor do texto do botão
    fontSize: 16, // Tamanho da fonte do texto do botão
    fontWeight: 'bold', // Texto em negrito
  },
});
