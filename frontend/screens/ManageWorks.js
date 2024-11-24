import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, FlatList } from 'react-native';
import { Card, Title, Paragraph, IconButton, Modal, TextInput, Button, Portal, Searchbar } from 'react-native-paper';
import { api } from '../api/api';
import { useFocusEffect } from '@react-navigation/native';

const ManageLogsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/getalllogs');

      if (response.data.logs.length === 0) {
        Alert.alert('Aviso', 'Nenhum log encontrado.');
      }

      setLogs(response.data.logs);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao buscar os logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch technicians
  const fetchTechnicians = useCallback(async () => {
    try {
      const response = await api.get('/gettecnicos');
      setTechnicians(response.data.tecnicos || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao buscar os técnicos.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
      fetchTechnicians();
    }, [fetchLogs, fetchTechnicians])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchLogs();
    } else {
      const filtered = logs.filter((log) =>
        log.status.toLowerCase().includes(query.toLowerCase())
      );
      setLogs(filtered);
    }
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setSelectedTechnicianId(null); // Reset selected technician
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!selectedTechnicianId) {
      Alert.alert('Erro', 'Por favor, selecione um técnico.');
      return;
    }
  
    const formatDateTime = (date) => {
      const pad = (n) => (n < 10 ? '0' + n : n);
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };
    
    const dataCriacao = formatDateTime(new Date());
    
    const { id_log, id_operador, id_maquina, descricao } = editingLog;
  
    try {
      // Enviamos os dados no formato que o backend espera
      const response = await api.post('/definelogs', {
        id_operador,          // ID do operador
        id_tecnico: selectedTechnicianId,  // ID do técnico selecionado
        id_maquina,           // ID da máquina
        descricao,            // Descrição do log
        id_log,               // ID do log
        data_criacao: dataCriacao, // Data de criação gerada no momento da atribuição
      });
  
      if (response.data.success) {
        fetchLogs();
        setModalVisible(false);
        Alert.alert('Sucesso', 'Log atualizado e atribuído com sucesso!');
      } else {
        Alert.alert('Erro', 'Falha ao atualizar o log.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atribuir o log.');
    }
  };
  
  
  const renderLog = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.cardActionText}>
          <Text style={styles.label}>ID Log:</Text> {item.id_log}
        </Text>
        <Text style={styles.cardActionText}>
          <Text style={styles.label}>Descrição:</Text> {item.descricao}
        </Text>
        <Text style={styles.cardActionText}>
          <Text style={styles.label}>Status:</Text> {item.status}
        </Text>
        <Text style={styles.cardActionText}>
          <Text style={styles.label}>ID Técnico:</Text> {item.id_tecnico || 'Não atribuído'}
        </Text>
      </Card.Content>
      <IconButton
        icon="pencil"
        size={50}
        onPress={() => handleEdit(item)}
      />
    </Card>
  );

  const renderTechnicianOption = (technician) => (
    <Card
      style={[
        styles.technicianOption,
        selectedTechnicianId === technician.id_tecnico && styles.selectedTechnician,
      ]}
      onPress={() => setSelectedTechnicianId(technician.id_tecnico)}
    >
      <Card.Content>
        <Text style={styles.technicianText}>
          <Text style={styles.label}>Nome:</Text> {technician.nome}
        </Text>
        <Text style={styles.technicianText}>
          <Text style={styles.label}>Área de Trabalho:</Text> {technician.area_de_manutencao}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Logs</Text>
      </View>
      <Searchbar
        placeholder="Pesquisar por status"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchbar}
      />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <FlatList
            data={logs}
            keyExtractor={(item) => item.id_log.toString()}
            renderItem={renderLog}
            ListEmptyComponent={<Text style={styles.noDataText}>Nenhum log encontrado.</Text>}
          />
        )}
      </View>

      {/* Modal de Edição */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Atribuir Técnico</Title>
          <FlatList
            data={technicians}
            keyExtractor={(item) => item.id_tecnico.toString()}
            renderItem={({ item }) => renderTechnicianOption(item)}
            ListEmptyComponent={<Text style={styles.noDataText}>Nenhum técnico disponível.</Text>}
          />
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
              Atribuir
            </Button>
            <Button
              mode="contained"
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
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
  searchbar: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    backgroundColor: 'gray',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
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
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  technicianOption: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  selectedTechnician: {
    borderColor: '#FEC601',
    borderWidth: 2,
  },
  technicianText: {
    fontSize: 20,
    color: '#333',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveButton: {
    width: '80%',
    backgroundColor: '#FEC601',
    marginBottom: 10,
  },
  cancelButton: {
    width: '80%',
    backgroundColor: 'gray',
  },
});

export default ManageLogsScreen;