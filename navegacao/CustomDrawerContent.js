import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { signOut } from 'firebase/auth';
import { auth } from '../bancodedados/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente personalizado para o conteúdo do menu lateral (Drawer)
export default function CustomDrawerContent(props) {
  const navigation = useNavigation(); // Hook para navegação entre telas
  const user = auth.currentUser; // Obtém o usuário autenticado
  const [avatarUri, setAvatarUri] = useState(null); // Estado para armazenar o avatar do usuário

  // Carrega o avatar do AsyncStorage ao montar o componente
  useEffect(() => {
    carregarAvatar();
  }, []);

  // Função para carregar o avatar salvo no AsyncStorage
  const carregarAvatar = async () => {
    const uri = await AsyncStorage.getItem('avatarUri'); // Obtém o URI do avatar salvo
    if (uri) setAvatarUri(uri); // Atualiza o estado com o URI do avatar
  };

  // Função para escolher uma nova imagem de avatar
  const escolherImagem = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Permite apenas imagens
      allowsEditing: true, // Permite editar a imagem antes de selecionar
      aspect: [1, 1], // Define a proporção da imagem (quadrada)
      quality: 1, // Qualidade máxima da imagem
    });

    if (!resultado.canceled) {
      const uriSelecionado = resultado.assets[0].uri; // Obtém o URI da imagem selecionada
      setAvatarUri(uriSelecionado); // Atualiza o estado com o novo URI
      await AsyncStorage.setItem('avatarUri', uriSelecionado); // Salva o URI no AsyncStorage
    }
  };

  // Função para realizar o logout do usuário
  const handleLogout = async () => {
    await signOut(auth); // Desloga o usuário do Firebase
    navigation.replace('Login'); // Redireciona para a tela de login
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Seção de informações do usuário */}
      <TouchableOpacity style={styles.userInfo} onPress={escolherImagem}>
        <Image
          source={avatarUri ? { uri: avatarUri } : require('../assets/avatar.png')} // Mostra o avatar ou uma imagem padrão
          style={styles.avatar}
        />
        <Text style={styles.trocarImagem}>Trocar imagem</Text>
        <Text style={styles.userName}>{user?.email || 'Usuário'}</Text> {/* Mostra o e-mail do usuário ou "Usuário" */}
      </TouchableOpacity>

      {/* Lista de itens do menu lateral */}
      <DrawerItemList {...props} />

      {/* Botão de logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  userInfo: {
    alignItems: 'center', // Centraliza os itens horizontalmente
    paddingVertical: 20, // Espaçamento vertical
    borderBottomWidth: 1, // Linha inferior
    borderBottomColor: '#ccc', // Cor da linha inferior
    backgroundColor: '#f0f0f0', // Cor de fundo
  },
  avatar: {
    width: 90, // Largura do avatar
    height: 90, // Altura do avatar
    borderRadius: 45, // Torna o avatar circular
    borderWidth: 2, // Largura da borda
    borderColor: '#25D366', // Cor da borda
  },
  trocarImagem: {
    marginTop: 6, // Espaçamento superior
    color: '#007bff', // Cor do texto
    fontSize: 14, // Tamanho da fonte
  },
  userName: {
    marginTop: 8, // Espaçamento superior
    fontWeight: 'bold', // Texto em negrito
    fontSize: 16, // Tamanho da fonte
  },
  logoutButton: {
    marginTop: 20, // Espaçamento superior
    marginHorizontal: 16, // Espaçamento horizontal
    padding: 10, // Espaçamento interno
    backgroundColor: '#FF3B30', // Cor de fundo do botão
    borderRadius: 8, // Bordas arredondadas
    alignItems: 'center', // Centraliza o texto no botão
  },
  logoutText: {
    color: '#fff', // Cor do texto
    fontWeight: 'bold', // Texto em negrito
  },
});
