// Importa os módulos necessários do Firebase
import { initializeApp } from "firebase/app"; // Inicializa o app Firebase
import { getFirestore } from "firebase/firestore"; // Configura o Firestore (banco de dados)
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  getReactNativePersistence,
} from "firebase/auth"; // Configura a autenticação
import AsyncStorage from "@react-native-async-storage/async-storage"; // Armazenamento local para persistência no React Native
import { Platform } from "react-native"; // Detecta a plataforma (web ou mobile)

// Configuração do Firebase (chaves e identificadores do projeto)
const firebaseConfig = {
  apiKey: "", // Chave da API
  authDomain: "", // Domínio de autenticação
  projectId: "", // ID do projeto Firebase
  storageBucket: "", // Bucket de armazenamento
  messagingSenderId: "", // ID do remetente para mensagens
  appId: "", // ID do aplicativo
  measurementId: "", // ID de medição (Analytics)
};

// Inicializa o app Firebase com a configuração fornecida
const app = initializeApp(firebaseConfig);

// Configuração da autenticação com persistência condicional
let auth;

if (Platform.OS === "web") {
  // Para a plataforma web, usa persistência no navegador
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  // Para dispositivos móveis, usa persistência com AsyncStorage
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Inicializa o Firestore (banco de dados do Firebase)
const db = getFirestore(app);

// Exporta as instâncias de autenticação e banco de dados para uso em outras partes do app
export { auth, db };
