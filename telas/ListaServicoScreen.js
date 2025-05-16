import { Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

// Componente principal da tela de lista de serviços
export default function ListaServicoScreen() {
  // Lista de serviços disponíveis
  const itens = [
    {
      id: 1,
      titulo: 'Fotos Aéreas',
      descricao: 'Captura de imagens aéreas em alta resolução, ideais para imóveis, paisagens, construções e muito mais, com ângulos privilegiados e perspectiva única.',
    },
    {
      id: 2,
      titulo: 'Filmagens Aéreas',
      descricao: 'Gravações aéreas com drones de última geração, perfeitas para eventos, publicidade, vídeos institucionais ou documentais.',
    },
    {
      id: 3,
      titulo: 'Mapeamento e Topografia',
      descricao: 'Coleta de dados geográficos e geração de mapas com precisão, aplicados em obras, agricultura, urbanismo e estudos ambientais.',
    },
    {
      id: 4,
      titulo: 'Monitoramento Ambiental',
      descricao: 'Uso de drones para acompanhar alterações em áreas naturais, reflorestamentos, bacias hidrográficas ou regiões de risco ambiental.',
    },
    {
      id: 5,
      titulo: 'Cobertura de Eventos',
      descricao: 'Registros aéreos de casamentos, festivais, inaugurações e outros eventos, oferecendo ângulos dinâmicos e impactantes para recordações ou divulgação.',
    },
    {
      id: 6,
      titulo: 'Produção de Vídeos Publicitários',
      descricao: 'Criação de vídeos promocionais com imagens aéreas envolventes, aumentando o impacto visual de campanhas comerciais ou institucionais.',
    },
    {
      id: 7,
      titulo: 'Inspeções de Estruturas',
      descricao: 'Avaliação aérea de pontes, torres, telhados e outras estruturas com segurança e eficiência, reduzindo riscos e custos operacionais.',
    },
  ];

  // Estado para controlar quais descrições estão visíveis
  const [descricaoVisivel, setDescricaoVisivel] = useState({});

  // Função para alternar a visibilidade da descrição de um item
  const toggleDescricao = (id) => {
    setDescricaoVisivel((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Alterna entre mostrar ou ocultar a descrição
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Mapeia os itens da lista e renderiza cada um */}
      {itens.map((item) => (
        <React.Fragment key={item.id}>
          {/* Botão para exibir ou ocultar a descrição do serviço */}
          <TouchableOpacity style={styles.item} onPress={() => toggleDescricao(item.id)}>
            <Text style={styles.itemTitulo}>{item.titulo}</Text>
          </TouchableOpacity>
          {/* Exibe a descrição do serviço se estiver visível */}
          {descricaoVisivel[item.id] && (
            <Text style={styles.descricao}>{item.descricao}</Text>
          )}
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo o espaço disponível
    paddingTop: 8, // Espaçamento superior
    backgroundColor: 'white', // Cor de fundo branca
  },
  item: {
    backgroundColor: '#007AFF', // Cor de fundo do item
    padding: 15, // Espaçamento interno
    borderRadius: 10, // Bordas arredondadas
    marginHorizontal: 16, // Espaçamento horizontal
    marginTop: 10, // Espaçamento superior
  },
  itemTitulo: {
    fontSize: 18, // Tamanho da fonte do título
    color: 'white', // Cor do texto
    fontWeight: 'bold', // Texto em negrito
  },
  descricao: {
    marginTop: 10, // Espaçamento superior
    marginHorizontal: 16, // Espaçamento horizontal
    fontSize: 14, // Tamanho da fonte da descrição
    color: '#333', // Cor do texto
    fontWeight: 'bold', // Texto em negrito
  },
});
