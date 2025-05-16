import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // Container para gerenciar a navegação
import { createStackNavigator } from '@react-navigation/stack'; // Criação de navegação em pilha
import LoginScreen from './telas/LoginScreen'; // Tela de login
import CadastroScreen from './telas/CadastroScreen'; // Tela de cadastro
import MenuLateralScreen from './navegacao/MenuLateral'; // Tela principal com menu lateral
import AuthLoading from './bancodedados/AuthLoading'; // Tela de carregamento para autenticação

// Criação do Stack Navigator
const Stack = createStackNavigator();

// Componente principal do aplicativo
export default function App() {
  return (
    // Container que gerencia a navegação do aplicativo
    <NavigationContainer>
      {/* Configuração do Stack Navigator */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tela de login */}
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Tela principal com menu lateral */}
        <Stack.Screen name="MenuLateral" component={MenuLateralScreen} />
        {/* Tela de carregamento para verificar autenticação */}
        <Stack.Screen name="AuthLoading" component={AuthLoading} />
        {/* Tela de cadastro */}
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
