import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, FlatList } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useUser } from '../contexts/UserContext'; 
import { api } from '../api/api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native'; 

const TechnicianTasksScreen = () => {
  const { user } = useUser(); 
  const [loading, setLoading] = useState(false);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchServiceOrders = async () => {
        if (!user?.id_tecnico) {
          Alert.alert('Erro', 'Técnico não autenticado. Por favor, faça login novamente.');
          return;
        }

        try {
          setLoading(true);
          const response = await api.get(`/jobsbyid/${user.id_tecnico}`); 
          setServiceOrders(response.data.service_order); 
        } catch (error) {
          console.error(error);
          Alert.alert('Erro', 'Erro ao buscar as ordens de serviço.');
        } finally {
          setLoading(false);
        }
      };

      fetchServiceOrders();
    }, [user?.id_tecnico]) //verificacao do id do técnico 
  );

  //verificação de cards, abrir um de cada vez
  const toggleCard = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const renderServiceOrder = ({ item }) => {
    const isExpanded = expandedOrderId === item.id_manutencao; 

    return (
      <Card style={styles.card}>
        <TouchableOpacity onPress={() => toggleCard(item.id_manutencao)}>
          <Card.Content>
            <Text style={styles.cardActionText}>
              <Text style={styles.label}>Data:</Text> {new Date(item.inicio_da_manutencao).toLocaleDateString('pt-BR')} {/* Formatação dd/mm/yyyy */}
            </Text>
            <Text style={styles.cardActionText}>
              <Text style={styles.label}>ID Máquina:</Text> {item.id_maquina}
            </Text>
          </Card.Content>
        </TouchableOpacity>

        {isExpanded && (
          <Card.Content style={styles.detailsContainer}>
            <Title style={styles.details}>Detalhes da Ordem:</Title>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>Descrição:</Text> {item.descricao}
            </Paragraph>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>Custo de Peça:</Text> {item.custo_de_peca}
            </Paragraph>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>Status:</Text> {item.status}
            </Paragraph>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>Início:</Text> {new Date(item.inicio_da_manutencao).toLocaleString('pt-BR')} {/* Formatação dd/mm/yyyy HH:mm:ss */}
            </Paragraph>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>Término:</Text> {new Date(item.termino_da_manutencao).toLocaleString('pt-BR')} {/* Formatação dd/mm/yyyy HH:mm:ss */}
            </Paragraph>
          </Card.Content>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Ordens de Serviço</Text>
      </View>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <FlatList
            data={serviceOrders}
            keyExtractor={(item) => item.id_manutencao.toString()}
            renderItem={renderServiceOrder}
            ListEmptyComponent={<Text style={styles.noDataText}>Nenhuma ordem de serviço encontrada.</Text>}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEC601',
  },
  topBar: {
    backgroundColor: 'transparent',
    paddingVertical: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'gray',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  details: {
    fontSize: 25,
    color: '#333',
    marginBottom: 10,
  },
  card: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 3, 
  },
  cardActionText: {
    fontSize: 30,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#FEC601', 
  },
  detailsContainer: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  detailText: {
    paddingVertical: 10, 
    fontSize: 25,
    color: '#333',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'white',
    fontSize: 30,
  },
});

export default TechnicianTasksScreen;
