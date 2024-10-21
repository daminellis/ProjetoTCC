import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { api } from '../api/api';

const HomeTecnicoScreen = () => {
  const { user } = useUser();
  const [userName, setUserName] = useState('');
  const [serviceOrders, setServiceOrders] = useState([]); // Inicialização como um array vazio

  useEffect(() => {
    if (user?.id_tecnico) {
      const fetchUserName = async () => {
        try {
          const response = await api.get(`/users/tecnicos/${user.id_tecnico}`);
          if (response.data.success) {
            setUserName(response.data.user.nome);
          } else {
            console.error(response.data.error);
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      };
      fetchUserName();
    }
  }, [user]);

  useEffect(() => {
    const fetchServiceOrders = async () => {
      try {
        const response = await api.get(`/allserviceorders`);
        //console.log("Resposta completa da API:", response.data); // Log da resposta completa
        if (response.data && response.data.service_orders) { 
          // Verificar se a propriedade service_orders está presente e é um array
          if (Array.isArray(response.data.service_orders)) {
            setServiceOrders(response.data.service_orders);
            //console.log("Service Orders:", response.data.service_orders); // Log para verificar os dados
          } else {
            console.error("service_orders não é um array:", response.data.service_orders);
          }
        } else {
          console.error("Resposta inesperada da API:", response.data);
        }
      } catch (error) {
        console.error("Error fetching service orders", error);
      }
    };
    fetchServiceOrders();
  }, []);

  const renderServiceOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderText}><Text style={styles.label}>ID do Log:</Text> {item.id_log}</Text>
      <Text style={styles.orderText}><Text style={styles.label}>Descrição:</Text> {item.descricao}</Text>
      <Text style={styles.orderText}><Text style={styles.label}>Máquina ID:</Text> {item.id_maquina}</Text>
      <Text style={styles.orderText}><Text style={styles.label}>Operador ID:</Text> {item.id_operador}</Text>
      <Text style={styles.orderText}><Text style={styles.label}>Criado Em:</Text> {new Date(item.criado_em).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.welcomeText}>Bem vindo! {userName}</Text>
      </View>
      <View style={styles.content}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.monitoringText}>Ferramenta de monitoramento técnico</Text>
        
        {/* Placeholder para dados vazios */}
        {serviceOrders.length === 0 ? (
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
  orderContainer: {
    backgroundColor: '#fff',
    borderRadius: 8, 
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',

    width: 450,
  },
  orderText: {
    fontSize: 25,
    color: '#333',
    marginLeft: 10,
    marginRight: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeTecnicoScreen;
