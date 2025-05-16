import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../bancodedados/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

// Componente responsável por verificar o estado de autenticação do usuário
export default function AuthLoading() {
  const navigation = useNavigation(); // Hook para navegação entre telas

  useEffect(() => {
    // Listener para monitorar mudanças no estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Usuário detectado no AuthLoading:', user); // DEBUG: Loga o usuário autenticado ou null

      if (user) {
        // Se o usuário estiver autenticado, redireciona para o menu principal
        navigation.replace('MenuLateral');
      } else {
        // Se não houver usuário autenticado, redireciona para a tela de login
        navigation.replace('Login');
      }
    });

    // Retorna a função de limpeza para remover o listener ao desmontar o componente
    return unsubscribe;
  }, []);

  // Exibe um indicador de carregamento enquanto verifica o estado de autenticação
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
