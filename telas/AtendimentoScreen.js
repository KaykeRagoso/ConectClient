import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getAuth } from 'firebase/auth';
import { getFirestore, addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { app } from '../bancodedados/firebaseConfig';

// Inicializa o Firebase Auth e Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

// Habilita animações no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Componente principal da tela de atendimento
export default function AtendimentoScreen() {
  // Estados para gerenciar mensagens, etapas, respostas e outros
  const [mensagens, setMensagens] = useState([]);
  const [etapa, setEtapa] = useState(0);
  const [mostrarInput, setMostrarInput] = useState(false);
  const [inputTexto, setInputTexto] = useState('');
  const [finalizado, setFinalizado] = useState(false);
  const [respostasSelecionadas, setRespostasSelecionadas] = useState([]);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const scrollViewRef = useRef();

  // Opções de perguntas e respostas para cada etapa
  const opcoes = {
    0: {
      pergunta: 'Olá! Bem-vindo à ConectCliente. 🚁\nO que você deseja?',
      respostas: [
        'Fotos Aéreas',
        'Filmagens Aéreas',
        'Mapeamento e Topografia',
        'Monitoramento Ambiental',
        'Cobertura de Eventos',
        'Produção de Vídeos Publicitários',
        'Inspeções de Estruturas',
      ],
    },
    1: {
      pergunta: 'Legal! Em qual local do RJ deseja realizar o serviço?',
      respostas: [],
    },
    2: {
      pergunta: 'Ótimo! Quando você gostaria de agendar?',
      respostas: [],
    },
    3: {
      pergunta: 'Maravilha! Qual seria o horário ideal?',
      respostas: [],
    },
    4: {
      pergunta: 'Perfeito! Entraremos em contato para finalizar o agendamento. ✅',
      respostas: [],
    },
  };

  // Inicia a conversa ao montar o componente
  useEffect(() => {
    iniciarConversa();
  }, []);

  // Rola automaticamente para o final do chat ao adicionar mensagens
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [mensagens]);

  // Função para iniciar a conversa
  const iniciarConversa = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMensagens([]);
    setEtapa(0);
    setFinalizado(false);
    setRespostasSelecionadas([]);
    enviarBot(opcoes[0].pergunta);
  };

  // Adiciona uma mensagem do bot ao chat
  const enviarBot = (texto) => {
    const msg = { id: Date.now().toString(), tipo: 'bot', texto };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMensagens((prev) => [...prev, msg]);
  };

  // Adiciona uma mensagem do usuário ao chat
  const enviarUsuario = (texto) => {
    const msg = { id: (Date.now() + Math.random()).toString(), tipo: 'usuario', texto };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMensagens((prev) => [...prev, msg]);
  };

  // Lida com a resposta do usuário e avança para a próxima etapa
  const handleResposta = (resposta) => {
    enviarUsuario(resposta);
    setRespostasSelecionadas((prev) => [...prev, resposta]);
    avancarEtapa(etapa + 1);
  };

  // Envia um local personalizado digitado pelo usuário
  const enviarLocalPersonalizado = () => {
    if (inputTexto.trim() === '') return;
    enviarUsuario(inputTexto);
    setRespostasSelecionadas((prev) => [...prev, inputTexto]);
    setMostrarInput(false);
    setInputTexto('');
    avancarEtapa(etapa + 1);
  };

  // Gera horários disponíveis para seleção
  const horariosDisponiveis = Array.from({ length: 14 }, (_, i) => {
    const hora = 8 + i;
    return `${hora.toString().padStart(2, '0')}:00`;
  });

  // Avança para a próxima etapa da conversa
  const avancarEtapa = (proximaEtapa) => {
    if (opcoes[proximaEtapa]) {
      enviarBot(opcoes[proximaEtapa].pergunta);
      setEtapa(proximaEtapa);
      if (proximaEtapa === 2) {
        setMostrarCalendario(true);
      } else {
        setMostrarCalendario(false);
      }
    }
  };

  // Salva o pedido no Firestore
  const salvarPedido = async () => {
    const usuario = auth.currentUser;
    if (!usuario) return;

    try {
      const usuariosRef = collection(firestore, 'usuarios');
      const q = query(usuariosRef, where('uid', '==', usuario.uid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error('Usuário não encontrado no banco de dados.');
      }

      const dadosUsuario = snapshot.docs[0].data();

      await addDoc(collection(firestore, 'pedidos'), {
        uid: usuario.uid,
        email: dadosUsuario.emailUsuario || 'Email não disponível',
        telefone: dadosUsuario.telefoneUsuario || 'Telefone não disponível',
        respostas: respostasSelecionadas,
        data: new Date().toISOString(),
      });

      console.log('Pedido salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
    }
  };

  // Salva o pedido automaticamente ao finalizar a última etapa
  useEffect(() => {
    if (etapa === 4 && !finalizado) {
      setFinalizado(true);
      salvarPedido();
    }
  }, [etapa]);

  // Configura o intervalo de datas no calendário
  let limitarMes = 2;
  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = (() => {
    const date = new Date();
    date.setMonth(date.getMonth() + limitarMes);
    return date.toISOString().split('T')[0];
  })();

  // Lida com a seleção de um dia no calendário
  const handleDiaSelecionado = (day) => {
    enviarUsuario(`Data escolhida: ${day.dateString}`);
    setRespostasSelecionadas((prev) => [...prev, day.dateString]);
    setMostrarCalendario(false);
    avancarEtapa(etapa + 1);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        ref={scrollViewRef}
      >
        {/* Renderiza as mensagens do chat */}
        {mensagens.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.mensagem,
              msg.tipo === 'usuario' ? styles.msgUsuario : styles.msgBot,
            ]}
          >
            <Text style={styles.textoMensagem}>{msg.texto}</Text>
          </View>
        ))}

        {/* Renderiza as opções da etapa 0 */}
        {etapa === 0 && (
          <View style={styles.opcoesArea}>
            {opcoes[0].respostas.map((resposta, index) => (
              <TouchableOpacity
                key={index}
                style={styles.botaoOpcao}
                onPress={() => handleResposta(resposta)}
              >
                <Text style={styles.botaoTexto}>{resposta}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Renderiza o input para local personalizado na etapa 1 */}
        {etapa === 1 && (
          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Digite o local desejado..."
              value={inputTexto}
              onChangeText={setInputTexto}
            />
            <TouchableOpacity style={styles.botaoEnviar} onPress={enviarLocalPersonalizado}>
              <Text style={styles.enviarTexto}>Enviar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Renderiza os horários disponíveis na etapa 3 */}
        {etapa === 3 && (
          <View style={styles.horariosContainer}>
            {horariosDisponiveis.map((hora, index) => (
              <TouchableOpacity
                key={index}
                style={styles.botaoHorario}
                onPress={() => handleResposta(hora)}
              >
                <Text style={styles.textoHorario}>{hora}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Renderiza o calendário na etapa 2 */}
        {mostrarCalendario && (
          <Calendar
            minDate={minDate}
            maxDate={maxDate}
            onDayPress={handleDiaSelecionado}
            theme={{
              selectedDayBackgroundColor: '#25D366',
              todayTextColor: '#25D366',
            }}
          />
        )}

        {/* Botão para reiniciar a conversa após finalizar */}
        {finalizado && (
          <View style={styles.reiniciarArea}>
            <TouchableOpacity style={styles.botaoReiniciar} onPress={iniciarConversa}>
              <Text style={styles.reiniciarTexto}>🔁 Começar Outra Conversa</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ECE5DD' },
  chatArea: { flex: 1, paddingHorizontal: 10 },
  chatContent: { paddingVertical: 10 },
  mensagem: {
    padding: 10,
    marginVertical: 4,
    maxWidth: '75%',
    borderRadius: 20,
  },
  msgUsuario: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  msgBot: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  textoMensagem: { fontSize: 16 },
  opcoesArea: {
    marginVertical: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    gap: 6,
  },
  botaoOpcao: {
    backgroundColor: '#25D366',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 4,
  },
  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  botaoEnviar: {
    marginLeft: 10,
    backgroundColor: '#25D366',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  enviarTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  reiniciarArea: {
    marginTop: 20,
    alignItems: 'center',
  },
  botaoReiniciar: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  reiniciarTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  horariosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    gap: 8,
  },
  botaoHorario: {
    backgroundColor: '#25D366',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  textoHorario: {
    color: 'white',
    fontWeight: 'bold',
  },
});
