import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../bancodedados/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

// Configuração do calendário em português
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

export default function AgendamentoScreen() {
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [voos, setVoos] = useState({});
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function carregarVoos() {
        setLoading(true);
        try {
          const querySnapshot = await getDocs(collection(db, 'pedidos'));
          const dados = {};

          querySnapshot.forEach((doc) => {
            const item = doc.data();
            const data = item.respostas?.[2];

            if (!data) return;

            if (!dados[data]) dados[data] = [];

            dados[data].push({
              servico: item.respostas?.[0] || 'Serviço',
              local: item.respostas?.[1] || 'Local não informado',
              hora: item.respostas?.[3] || 'Horário não informado',
              telefone: item.telefone || 'Número não informado',
              video: item.video || '', // Link do vídeo
            });
          });

          setVoos(dados);
        } catch (error) {
          console.error('Erro ao carregar voos:', error);
        } finally {
          setLoading(false);
        }
      }

      carregarVoos();
    }, [])
  );

  const abrirVideo = (url) => {
    if (url && url.startsWith('http')) {
      Linking.openURL(url).catch(err =>
        console.error('Erro ao abrir o link:', err)
      );
    } else {
      alert('Link de vídeo inválido.');
    }
  };

  const datasMarcadas = {};
  Object.keys(voos).forEach((data) => {
    datasMarcadas[data] = {
      marked: true,
      dotColor: '#1E90FF',
    };
  });

  return (
    <ScrollView style={styles.container}>
      <Calendar
        onDayPress={(day) => setDataSelecionada(day.dateString)}
        markedDates={{
          ...datasMarcadas,
          [dataSelecionada]: {
            selected: true,
            selectedColor: '#4682B4',
            marked: voos[dataSelecionada] !== undefined,
            dotColor: '#fff',
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#4682B4',
          todayTextColor: '#4682B4',
          arrowColor: '#4682B4',
          monthTextColor: '#333',
          textMonthFontWeight: 'bold',
          textDayFontWeight: '500',
        }}
      />

      <View style={styles.resultado}>
        {loading ? (
          <ActivityIndicator size="large" color="#4682B4" />
        ) : dataSelecionada ? (
          voos[dataSelecionada] ? (
            voos[dataSelecionada]
              .sort((a, b) => a.hora.localeCompare(b.hora))
              .map((voo, index) => (
                <View key={index} style={styles.vooCard}>
                  <Text style={styles.servico}>{voo.servico}</Text>
                  <Text style={styles.detalhe}>🕒 {voo.hora}</Text>
                  <Text style={styles.detalhe}>📍 {voo.local}</Text>
                  <Text style={styles.detalhe}>📞 {voo.telefone}</Text>
                  {voo.video ? (
                    <Text
                      style={[styles.detalhe, styles.link]}
                      onPress={() => abrirVideo(voo.video)}
                    >
                      ▶️ Ver vídeo Completo do Voo
                    </Text>
                  ) : (
                    <Text style={styles.detalhe}>▶️ Vídeo não encontrado</Text>
                  )}
                </View>
              ))
          ) : (
            <Text style={styles.nenhum}>Nenhum voo agendado nessa data.</Text>
          )
        ) : (
          <Text style={styles.nenhum}>Selecione uma data para ver os voos.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
  link: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
  nenhum: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
