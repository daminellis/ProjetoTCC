import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import { useUser } from '../contexts/UserContext'; 
import { api } from '../api/api';

const TechnicianTasksScreen = () => {
  const { user } = useUser(); 
  const [loading, setLoading] = useState(false);
  const [serviceOrders, setServiceOrders] = useState([]);

  useEffect(() => {
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
  }, [user?.id_tecnico]);

  const renderServiceOrder = ({ item }) => (
    <View style={styles.serviceOrderItem}>
      <Text style={styles.serviceOrderText}>Descrição: {item.descricao}</Text>
      <Text style={styles.serviceOrderText}>Custo de Peça: {item.custo_de_peca}</Text>
      <Text style={styles.serviceOrderText}>Status: {item.status}</Text>
      <Text style={styles.serviceOrderText}>
        Início: {new Date(item.inicio_da_manutencao).toLocaleString()}
      </Text>
      <Text style={styles.serviceOrderText}>
        Término: {new Date(item.termino_da_manutencao).toLocaleString()}
      </Text>
    </View>
  );

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
  serviceOrderItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  serviceOrderText: {
    fontSize: 25,
    marginBottom: 5,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'white',
  },
});

export default TechnicianTasksScreen;
