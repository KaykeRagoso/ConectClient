// Importa os mÃ³dulos necessÃ¡rios do Firebase
import { initializeApp } from "firebase/app"; // Inicializa o app Firebase
import { getFirestore } from "firebase/firestore"; // Configura o Firestore (banco de dados)
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  getReactNativePersistence,
} from "firebase/auth"; // Configura a autenticaÃ§Ã£o
import AsyncStorage from "@react-native-async-storage/async-storage"; // Armazenamento local para persistÃªncia no React Native
import { Platform } from "react-native"; // Detecta a plataforma (web ou mobile)

// ConfiguraÃ§Ã£o do Firebase (chaves e identificadores do projeto)
const firebaseConfig = {
  apiKey: "", // Chave da API
  authDomain: "", // DomÃ­nio de autenticaÃ§Ã£o
  projectId: "", // ID do projeto Firebase
  storageBucket: "", // Bucket de armazenamento
  messagingSenderId: "", // ID do remetente para mensagens
  appId: "", // ID do aplicativo
  measurementId: "", // ID de mediÃ§Ã£o (Analytics)
};

// Inicializa o app Firebase com a configuraÃ§Ã£o fornecida
const app = initializeApp(firebaseConfig);

// ConfiguraÃ§Ã£o da autenticaÃ§Ã£o com persistÃªncia condicional
let auth;

if (Platform.OS === "web") {
  // Para a plataforma web, usa persistÃªncia no navegador
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  // Para dispositivos mÃ³veis, usa persistÃªncia com AsyncStorage
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Inicializa o Firestore (banco de dados do Firebase)
const db = getFirestore(app);

// Exporta as instÃ¢ncias de autenticaÃ§Ã£o e banco de dados para uso em outras partes do app
export { auth, db };
