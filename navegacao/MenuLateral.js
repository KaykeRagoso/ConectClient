import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { signOut } from 'firebase/auth';
import { auth, db } from '../bancodedados/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importação das telas que serão exibidas no menu lateral
import Agendamento from '../telas/AgendamentoScreen';
import Atendimento from '../telas/AtendimentoScreen';
import ContatoScreen from '../telas/ContatosScreen';
import Feedback from '../telas/FeedbackScreen';
import ListaServico from '../telas/ListaServicoScreen';

// Criação do componente Drawer Navigator
const Drawer = createDrawerNavigator();

// Componente personalizado para o conteúdo do menu lateral
function CustomDrawerContent(props) {
  const [avatar, setAvatar] = useState(null); // Estado para armazenar o avatar do usuário
  const [nome, setNome] = useState(''); // Estado para armazenar o nome do usuário
  const user = auth.currentUser; // Obtém o usuário autenticado do Firebase

  // Executa ao montar o componente
  useEffect(() => {
    carregarAvatar(); // Carrega o avatar salvo no AsyncStorage
    buscarNomeUsuario(); // Busca o nome do usuário no Firestore
  }, []);

  // Função para carregar o avatar do AsyncStorage
  const carregarAvatar = async () => {
    const uri = await AsyncStorage.getItem('avatarUri'); // Obtém o URI do avatar salvo
    if (uri) setAvatar(uri); // Atualiza o estado com o URI do avatar
  };

  // Função para buscar o nome do usuário no Firestore
  const buscarNomeUsuario = async () => {
    if (!user) return; // Retorna se não houver usuário autenticado

    try {
      const docRef = doc(db, 'usuarios', user.uid); // Referência ao documento do usuário no Firestore
      const docSnap = await getDoc(docRef); // Obtém os dados do documento

      if (docSnap.exists()) {
        const dados = docSnap.data(); // Dados do documento
        setNome(dados.nomeUsuario || ''); // Atualiza o estado com o nome do usuário
      } else {
        console.log('Documento do usuário não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar nome do usuário:', error);
    }
  };

  // Função para permitir que o usuário escolha uma nova imagem de avatar
  const escolherImagem = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Permite apenas imagens
      allowsEditing: true, // Permite editar a imagem antes de selecionar
      aspect: [1, 1], // Define a proporção da imagem (quadrada)
      quality: 1, // Qualidade máxima da imagem
    });

    if (!resultado.canceled) {
      const uriSelecionado = resultado.assets[0].uri; // Obtém o URI da imagem selecionada
      setAvatar(uriSelecionado); // Atualiza o estado com o novo URI
      await AsyncStorage.setItem('avatarUri', uriSelecionado); // Salva o URI no AsyncStorage
    }
  };

  // Função para realizar o logout do usuário
  const handleLogout = async () => {
    await signOut(auth); // Desloga o usuário do Firebase
    props.navigation.replace('Login'); // Redireciona para a tela de login
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Seção de informações do usuário */}
      <TouchableOpacity style={styles.avatarContainer} onPress={escolherImagem}>
        <Image
          source={avatar ? { uri: avatar } : require('../assets/avatar.png')} // Mostra o avatar ou uma imagem padrão
          style={styles.avatar}
        />
        <Text style={styles.trocarTexto}>Trocar imagem</Text>
        <Text style={styles.name}>Olá, {nome || user?.email}!</Text> {/* Mostra o nome ou o e-mail do usuário */}
      </TouchableOpacity>

      {/* Lista de itens do menu lateral */}
      <DrawerItemList {...props} />

      {/* Botão de logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      {/* Rodapé com informações */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 ConectClient. Todos os direitos reservados.</Text>
      </View>
    </DrawerContentScrollView>
  );
}

// Componente principal do menu lateral
export default function MenuLateral() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name='Agendamento' component={Agendamento} />
      <Drawer.Screen name='Atendimento' component={Atendimento} />
      <Drawer.Screen name='Lista de Serviço' component={ListaServico} />
      <Drawer.Screen name='Feedback' component={Feedback} />
      <Drawer.Screen name='Contato' component={ContatoScreen} />
    </Drawer.Navigator>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center', // Centraliza os itens horizontalmente
    paddingVertical: 20, // Espaçamento vertical
    borderBottomWidth: 1, // Linha inferior
    borderColor: '#ccc', // Cor da linha inferior
  },
  avatar: {
    width: 100, // Largura do avatar
    height: 100, // Altura do avatar
    borderRadius: 50, // Torna o avatar circular
    borderWidth: 2, // Largura da borda
    borderColor: '#25D366', // Cor da borda
  },
  trocarTexto: {
    marginTop: 6, // Espaçamento superior
    fontSize: 14, // Tamanho da fonte
    color: '#1E90FF', // Cor do texto
  },
  name: {
    marginTop: 10, // Espaçamento superior
    fontWeight: 'bold', // Texto em negrito
    fontSize: 16, // Tamanho da fonte
  },
  logoutButton: {
    marginTop: 20, // Espaçamento superior
    marginHorizontal: 20, // Espaçamento horizontal
    paddingVertical: 10, // Espaçamento interno
    alignItems: 'center', // Centraliza o texto no botão
    borderTopWidth: 1, // Linha superior
    borderColor: '#ccc', // Cor da linha superior
  },
  logoutText: {
    color: 'red', // Cor do texto
    fontWeight: 'bold', // Texto em negrito
  },
  footer: {
    marginTop: 'auto', // Posiciona o rodapé no final
    alignItems: 'center', // Centraliza o texto
    paddingVertical: 10, // Espaçamento vertical
    borderTopWidth: 1, // Linha superior
    borderColor: '#ccc', // Cor da linha superior
  },
  footerText: {
    fontSize: 12, // Tamanho da fonte
    color: '#888', // Cor do texto
  },
});
