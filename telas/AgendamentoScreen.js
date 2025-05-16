import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../bancodedados/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

// Configurando o calendário para exibir os textos em português
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira',
    'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br'; // Define o idioma padrão como português

// Componente principal da tela de agendamentos
export default function AgendamentoScreen() {
  const [dataSelecionada, setDataSelecionada] = useState(''); // Estado para armazenar a data selecionada no calendário
  const [voos, setVoos] = useState({}); // Estado para armazenar os voos agendados
  const [loading, setLoading] = useState(true); // Estado para controlar o indicador de carregamento

  // Hook para carregar os voos sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      async function carregarVoos() {
        setLoading(true); // Ativa o indicador de carregamento
        try {
          const querySnapshot = await getDocs(collection(db, 'pedidos')); // Busca os documentos da coleção "pedidos" no Firestore
          const dados = {};

          querySnapshot.forEach((doc) => {
            const item = doc.data();
            const data = item.respostas?.[2]; // Obtém a data do agendamento (respostas[2])

            if (!data) return; // Ignora se a data não estiver presente

            if (!dados[data]) dados[data] = []; // Inicializa a lista de voos para a data, se necessário

            // Adiciona os detalhes do voo à data correspondente
            dados[data].push({
              servico: item.respostas?.[0] || 'Serviço', // Nome do serviço
              local: item.respostas?.[1] || 'Local não informado', // Local do serviço
              hora: item.respostas?.[3] || 'Horário não informado', // Horário do serviço
              telefone: item.telefone || 'Número não informado', // Telefone do cliente
            });
          });

          setVoos(dados); // Atualiza o estado com os voos carregados
        } catch (error) {
          console.error('Erro ao carregar voos:', error); // Loga o erro no console
        } finally {
          setLoading(false); // Desativa o indicador de carregamento
        }
      }

      carregarVoos(); // Chama a função para carregar os voos
    }, [])
  );

  // Configura as datas marcadas no calendário
  const datasMarcadas = {};
  Object.keys(voos).forEach((data) => {
    datasMarcadas[data] = {
      marked: true, // Marca a data no calendário
      dotColor: '#1E90FF', // Cor do ponto na data
    };
  });

  return (
    <ScrollView style={styles.container}>
      {/* Componente do calendário */}
      <Calendar
        onDayPress={(day) => setDataSelecionada(day.dateString)} // Atualiza a data selecionada ao pressionar um dia
        markedDates={{
          ...datasMarcadas, // Adiciona as datas marcadas
          [dataSelecionada]: {
            selected: true, // Marca a data selecionada
            selectedColor: '#4682B4', // Cor de fundo da data selecionada
            marked: voos[dataSelecionada] !== undefined, // Marca se há voos na data
            dotColor: '#fff', // Cor do ponto na data selecionada
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#4682B4', // Cor de fundo do dia selecionado
          todayTextColor: '#4682B4', // Cor do texto do dia atual
          arrowColor: '#4682B4', // Cor das setas de navegação
          monthTextColor: '#333', // Cor do texto do mês
          textMonthFontWeight: 'bold', // Peso da fonte do texto do mês
          textDayFontWeight: '500', // Peso da fonte do texto dos dias
        }}
      />

      {/* Exibição dos resultados */}
      <View style={styles.resultado}>
        {loading ? (
          <ActivityIndicator size="large" color="#4682B4" /> // Indicador de carregamento
        ) : dataSelecionada ? (
          voos[dataSelecionada] ? (
            voos[dataSelecionada]
              .sort((a, b) => a.hora.localeCompare(b.hora)) // Ordena os voos por horário
              .map((voo, index) => (
                <View key={index} style={styles.vooCard}>
                  <Text style={styles.servico}>{voo.servico}</Text>
                  <Text style={styles.detalhe}>🕒 {voo.hora}</Text>
                  <Text style={styles.detalhe}>📍 {voo.local}</Text>
                  <Text style={styles.detalhe}>📞 {voo.telefone}</Text>
                </View>
              ))
          ) : (
            <Text style={styles.nenhum}>Nenhum voo agendado nessa data.</Text> // Mensagem caso não haja voos
          )
        ) : (
          <Text style={styles.nenhum}>Selecione uma data para ver os voos.</Text> // Mensagem caso nenhuma data esteja selecionada
        )}
      </View>
    </ScrollView>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  resultado: {
    marginTop: 20,
  },
  vooCard: {
    backgroundColor: '#E6F0FA',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  servico: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  detalhe: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  nenhum: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
