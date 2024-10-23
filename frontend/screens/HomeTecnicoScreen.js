import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { api } from '../api/api';
import { Card } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const HomeTecnicoScreen = () => {
  const { user } = useUser();
  const [userName, setUserName] = useState('');
  const [serviceOrders, setServiceOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efeito para buscar o nome do usuário
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserName = async () => {
        if (user?.id_tecnico) {
          try {
            const response = await api.get(`/users/tecnicos/${user.id_tecnico}`);
            if (response.data.success) {
              setUserName(response.data.user.nome);
            } else {
              console.error(response.data.error);
            }
          } catch (error) {
            console.error("Error fetching user data", error);
            Alert.alert("Erro", "Erro ao buscar dados do usuário.");
          }
        }
      };
      fetchUserName();
    }, [user]) // Dependência para atualizar quando o usuário muda
  );

  // Efeito para buscar ordens de serviço
  useFocusEffect(
    React.useCallback(() => {
      const fetchServiceOrders = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/allserviceorders`);
          if (response.data && response.data.service_orders) {
            if (Array.isArray(response.data.service_orders)) {
              setServiceOrders(response.data.service_orders);
            } else {
              console.error("service_orders não é um array:", response.data.service_orders);
              Alert.alert("Erro", "Dados inesperados recebidos da API.");
            }
          } else {
            console.error("Resposta inesperada da API:", response.data);
            Alert.alert("Erro", "Resposta inesperada da API.");
          }
        } catch (error) {
          console.error("Error fetching service orders", error);
          Alert.alert("Erro", "Erro ao buscar ordens de serviço.");
        } finally {
          setLoading(false);
        }
      };
      fetchServiceOrders();
    }, []) //sem dependências para buscar sempre que abrir a tela
  );

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleCardContent = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const renderServiceOrder = ({ item }) => {
    const isExpanded = expandedOrderId === item.id_log;

    return (
      <Card style={styles.card}>
        <TouchableOpacity onPress={() => toggleCardContent(item.id_log)}>
          <Card.Content>
            <Text style={styles.orderText}>
              <Text style={styles.label}>Máquina ID:</Text> {item.id_maquina}
            </Text>
            <Text style={styles.orderText}>
              <Text style={styles.label}>Criado Em:</Text> {new Date(item.criado_em).toLocaleString('pt-BR')} {/* Formatação dd/mm/yyyy HH:mm:ss */}
            </Text>

            {isExpanded && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>
                  <Text style={styles.label}>ID do Log:</Text> {item.id_log}</Text>
                <Text style={styles.detailText}>
                  <Text style={styles.label}>Descrição:</Text> {item.descricao}</Text>
                <Text style={styles.detailText}
                ><Text style={styles.label}>Operador ID:</Text> {item.id_operador}</Text>
                <Text style={styles.detailText}>
                  <Text style={styles.label}>Criado Em:</Text> {new Date(item.criado_em).toLocaleString('pt-BR')} {/* Formatação dd/mm/yyyy HH:mm:ss */}
                </Text>
              </View>
            )}
          </Card.Content>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.welcomeText}>Bem vindo! {userName}</Text>
      </View>
      <View style={styles.content}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.monitoringText}>Ferramenta de monitoramento técnico</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : serviceOrders.length === 0 ? (
          <Text style={styles.noDataText}>Nenhum pedido de serviço disponível.</Text>
        ) : (
          <FlatList
            data={serviceOrders}
            renderItem={renderServiceOrder}
            keyExtractor={item => item.id_log.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
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
  welcomeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    backgroundColor: 'gray',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: 'center',
  },
  logo: { 
    width: 762,
    height: 217,
    marginTop: 60,
  },
  monitoringText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FEC601',
    paddingVertical: 30,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    elevation: 3,
    paddingHorizontal: 100,
    paddingVertical: 10,
  },
  orderText: {
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
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  detailText: {
    fontSize: 25,
    color: '#333',
  },
  noDataText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeTecnicoScreen;
