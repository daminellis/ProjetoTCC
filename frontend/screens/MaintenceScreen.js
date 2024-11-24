import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, FlatList, TextInput } from 'react-native';
import { Card, Title, Paragraph, IconButton, Modal, Portal, Button } from 'react-native-paper';
import { useUser } from '../contexts/UserContext'; 
import { api } from '../api/api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native'; 

const TechnicianTasksScreen = () => {  
  const { user } = useUser(); 
  const [loading, setLoading] = useState(false);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCost, setEditedCost] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [editedStartDate, setEditedStartDate] = useState('');
  const [editedEndDate, setEditedEndDate] = useState('');

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
          
          if (response.data.service_order.length === 0){
            Alert.alert('Aviso','Nenhuma ordem de serviço foi encontrada para este técnico');
          }

          setServiceOrders(response.data.service_order); 
        } catch (error) {
          console.error(error);
          Alert.alert('Erro', 'Erro ao buscar as ordens de serviço.');
        } finally {
          setLoading(false);
        }
      };

      fetchServiceOrders();
    }, [user?.id_tecnico])
  );

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditedDescription(order.descricao);
    setEditedCost(order.custo_de_peca != null ? order.custo_de_peca.toString() : 'Sem preço indicado'); 
    setEditedStatus(order.status);
    setEditedStartDate(order.inicio_da_manutencao ? new Date(order.inicio_da_manutencao).toISOString().slice(0, 16) : ''); 
    setEditedEndDate(order.termino_da_manutencao ? new Date(order.termino_da_manutencao).toISOString().slice(0, 16) : ''); 
    setVisible(true);
  };
  
  const hideModal = () => {
    setVisible(false);
    setSelectedOrder(null);
  };

  const handleSave = async () => {
    if (!selectedOrder) return;

    try {
      const updatedOrder = {
        descricao: editedDescription,
        custo_de_peca: parseFloat(editedCost),
        status: editedStatus,
        inicio_da_manutencao: editedStartDate,
        termino_da_manutencao: editedEndDate,
      };

      const response = await api.put(`/editjobs/${selectedOrder.id_manutencao}`, updatedOrder);

      if (response.status === 200) {
        setServiceOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id_manutencao === selectedOrder.id_manutencao
              ? { ...order, ...updatedOrder }
              : order
          )
        );

        Alert.alert('Sucesso', 'Ordem de serviço atualizada!');
        hideModal();
      } else {
        Alert.alert('Erro', 'Erro ao atualizar a ordem de serviço.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao salvar as alterações.');
    }
  };

  const startService = async () => {
    if (!selectedOrder) return;
  
    const updatedOrder = {
      ...selectedOrder,
      status: 'Em andamento',  // Atualiza o status para "Em andamento"
      inicio_da_manutencao: new Date().toISOString().slice(0, 19).replace('T', ' '), // Formato: YYYY-MM-DD HH:MM:SS
    };
  
    try {
      const response = await api.put(`/editjobs/${selectedOrder.id_manutencao}`, updatedOrder);
      if (response.status === 200) {
        setServiceOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id_manutencao === selectedOrder.id_manutencao
              ? { ...order, ...updatedOrder }
              : order
          )
        );
        Alert.alert('Sucesso', 'Serviço iniciado!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao iniciar o serviço.');
    }
  };

    
  const finishService = async () => {
    if (!selectedOrder) return;

    const updatedOrder = {
      ...selectedOrder,
      status: 'Finalizado',  // Atualiza o status para "Finalizado"
      termino_da_manutencao: new Date().toISOString().slice(0, 19).replace('T', ' '), // Formato: YYYY-MM-DD HH:MM:SS
    };

    try {
      const response = await api.put(`/editjobs/${selectedOrder.id_manutencao}`, updatedOrder);
      if (response.status === 200) {
        setServiceOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id_manutencao === selectedOrder.id_manutencao
              ? { ...order, ...updatedOrder }
              : order
          )
        );
        Alert.alert('Sucesso', 'Serviço finalizado!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao finalizar o serviço.');
    }
  };

  const toggleCard = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const renderServiceOrder = ({ item }) => {
    const isExpanded = expandedOrderId === item.id_manutencao; 

    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={() => toggleCard(item.id_manutencao)} style={{ flex: 1 }}>
            <Card.Content>
              <Text style={styles.cardActionText}>
                <Text style={styles.label}>Data de criação:</Text> {new Date(item.data_criacao).toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.cardActionText}>
                <Text style={styles.label}>ID Máquina:</Text> {item.id_maquina}
              </Text>
            </Card.Content>
          </TouchableOpacity>
          <IconButton
            icon="pencil"
            size={50}
            color="#FEC601"
            onPress={() => handleEditOrder(item)}
          />
        </View>

        {isExpanded && (
          <Card.Content style={styles.detailsContainer}>
            <Title style={styles.details}>Detalhes da Ordem:</Title>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>Descrição:</Text> {item.descricao}
            </Paragraph>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>Custo de Peça:</Text> {item.custo_de_peca !== null ? item.custo_de_peca : 'Não indicado'}            
            </Paragraph>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>Status:</Text> {item.status}
            </Paragraph>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>Início:</Text> {item.inicio_da_manutencao ? new Date(item.inicio_da_manutencao).toLocaleString('pt-BR') : 'Não Iniciado'}
            </Paragraph>
            <Paragraph style={styles.detailText}>
            <Text style={styles.label}>Término:</Text> {item.termino_da_manutencao ? new Date(item.termino_da_manutencao).toLocaleString('pt-BR') : 'Não Finalizado'}
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

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          <Title style={styles.modalTitle}>Editar Ordem de Serviço</Title>
          <TextInput
            label="Descrição"
            value={editedDescription}
            onChangeText={setEditedDescription}
            style={styles.input}
          />
          <TextInput
            label="Custo de Peça"
            value={editedCost}
            onChangeText={setEditedCost}
            style={styles.input}
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSave} style={styles.saveButton} labelStyle={styles.buttonText}>
              Salvar
            </Button>
            <Button mode="contained" onPress={startService} style={styles.startButton} labelStyle={styles.buttonText}>
              Iniciar Serviço
            </Button>
            <Button mode="contained" onPress={finishService} style={styles.finishButton} labelStyle={styles.buttonText}>
              Finalizar Serviço
            </Button>
            <Button onPress={hideModal} style={styles.cancelButton} labelStyle={styles.buttonText}>
              Cancelar
            </Button>
          </View>
        </Modal>
      </Portal>
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    width: '80%',
    height: 'auto',
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FEC601',
    borderRadius: 5,
    fontSize: 25,
    padding: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 25,
    color: 'white',
    paddingVertical: 5,
  },
  saveButton: {
    marginBottom: 10,
    height: 50,
    width: 280,
    justifyContent: 'center',
    backgroundColor: '#FEC601',
  },
  startButton: {
    backgroundColor: '#4CAF50', 
    marginBottom: 10,
    height: 50,
    width: 280,
    justifyContent: 'center',
  },
  finishButton: {
    backgroundColor: '#FF5722', 
    marginBottom: 10,
    height: 50,
    width: 280,
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray',
    height: 50,
    width: 280,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TechnicianTasksScreen;
