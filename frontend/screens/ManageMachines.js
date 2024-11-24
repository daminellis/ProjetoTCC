import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, FlatList } from 'react-native';
import { Card, Title, Paragraph, IconButton, Modal, TextInput, Button, Portal, Searchbar } from 'react-native-paper';
import { api } from '../api/api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const ManageMachinesScreen = () => {
const [machines, setMachines] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [expandedMachineId, setExpandedMachineId] = useState(null);
const [editingMachine, setEditingMachine] = useState(null);
const [modalVisible, setModalVisible] = useState(false);
const [addModalVisible, setAddModalVisible] = useState(false);
const [formData, setFormData] = useState({ nome_maquina: '', local: '' });
const [loading, setLoading] = useState(false);

const fetchMachines = useCallback(async () => {
    try {
        setLoading(true);
        const response = await api.get('/getallmaquinas');

        if (response.data.maquinas.length === 0) {
            Alert.alert('Aviso', 'Nenhuma máquina encontrada.');
        }

        setMachines(response.data.maquinas);
    } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Erro ao buscar as máquinas.');
    } finally {
        setLoading(false);
    }
}, []);

useFocusEffect(
    useCallback(() => {
        fetchMachines();
    }, [fetchMachines])
);

const toggleCard = (id) => {
    setExpandedMachineId((prev) => (prev === id ? null : id));
};

const handleEdit = (machine) => {
    setEditingMachine(machine);
    setFormData({
        nome_maquina: machine.nome_maquina,
        local: machine.local,
    });
    setModalVisible(true);
};

const handleSave = async () => {
    try {
        await api.put(`/updatemaquinas`, {
            id_maquina: editingMachine.id_maquina,
            nome_maquina: formData.nome_maquina,
            local: formData.local,
        });

        fetchMachines();
        setModalVisible(false);
        Alert.alert('Sucesso', 'Máquina atualizada com sucesso!');
    } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Erro ao atualizar a máquina.');
    }
};

const handleAddMachine = async () => {
    try {
        await api.post('/createmaquinas', formData);

        setFormData({ nome_maquina: '', local: '' });
        setAddModalVisible(false);

        fetchMachines();

        Alert.alert('Sucesso', 'Máquina adicionada com sucesso!');
    } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Erro ao adicionar a máquina.');
    }
};

const handleDeleteMachine = async (id_maquina) => {
    Alert.alert('Confirmação', 'Tem certeza que deseja excluir esta máquina?', [
        { text: 'Cancelar', style: 'cancel' },
        {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
                try {
                    await api.delete('/deletemaquinas', { data: { id_maquina } });
                    fetchMachines();
                    Alert.alert('Sucesso', 'Máquina excluída com sucesso!');
                } catch (error) {
                    console.error(error);
                    Alert.alert('Erro', 'Erro ao excluir a máquina.');
                }
            },
        },
    ]);
};

const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
        fetchMachines();
    } else {
        const filtered = machines.filter((machine) =>
            machine.nome_maquina.toLowerCase().includes(query.toLowerCase())
        );
        setMachines(filtered);
    }
};

const renderMachine = ({ item }) => {
    const isExpanded = expandedMachineId === item.id_maquina;
    return (
        <Card style={styles.card}>
            <View style={styles.cardHeader}>
                <TouchableOpacity onPress={() => toggleCard(item.id_maquina)} style={{ flex: 1 }}>
                    <Card.Content>
                        <Text style={styles.cardActionText}>
                            <Text style={styles.label}>ID Máquina:</Text> {item.id_maquina}
                        </Text>
                        <Text style={styles.cardActionText}>
                            <Text style={styles.label}>Nome:</Text> {item.nome_maquina}
                        </Text>
                    </Card.Content>
                </TouchableOpacity>
                <IconButton
                    icon="pencil"
                    size={50}
                    onPress={() => handleEdit(item)}
                />
                <IconButton
                    icon="delete"
                    size={50}
                    onPress={() => handleDeleteMachine(item.id_maquina)}
                />
            </View>
            {isExpanded && (
                <Card.Content style={styles.detailsContainer}>
                    <Title style={styles.details}>Detalhes da Máquina:</Title>
                    <Paragraph style={styles.detailText}>
                        <Text style={styles.label}>Local:</Text> {item.local}
                    </Paragraph>
                </Card.Content>
            )}
        </Card>
      );
    };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
          <Text style={styles.title}>Gerenciar Máquinas</Text>
      </View>
        <Searchbar
          placeholder="Pesquisar por nome"
          style={styles.searchbar}
          onChangeText={handleSearch}
          value={searchQuery}
        />
        <View style={styles.content}>
          <Button
            mode='contained'
            onPress={() => {
              setFormData({ nome_maquina: '', local: '' });
              setAddModalVisible(true);
            }}
            style={styles.addButton}
          >
          <Text style={styles.addText}>Adicionar Máquina</Text>
          </Button>
          {loading ? (
            <ActivityIndicator size='large' color='white' />
          ) : machines.length === 0 ? (
            <Text style={styles.noDataText}>Nenhuma máquina encontrada.</Text>
          ) : (
            <FlatList
              data={machines}
              keyExtractor={(item) => item.id_maquina.toString()}
              renderItem={renderMachine}
            />
          )}
        </View>

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Title style={styles.modalTitle}>Editar Maquinas</Title>
            <TextInput
              label='Nome da Máquina'
              value={formData.nome_maquina}
              onChangeText={(text) => setFormData({ ...formData, nome_maquina: text })}
              style={styles.input}
            />
            <TextInput
              label='Local'
              value={formData.local}
              onChangeText={(text) => setFormData({ ...formData, local: text })}
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button
                mode='contained'
                onPress={handleSave}
                style={styles.saveButton}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </Button>
              <Button
                mode='contained'
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Button>
            </View>
          </Modal>

          <Modal
            visible={addModalVisible}
            onDismiss={() => setAddModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Title style={styles.modalTitle}>Adicionar Máquina</Title>
            <TextInput
              label='Nome da Máquina'
              value={formData.nome_maquina}
              onChangeText={(text) => setFormData({ ...formData, nome_maquina: text })}
              style={styles.input}
            />
            <TextInput
              label='Local'
              value={formData.local}
              onChangeText={(text) => setFormData({ ...formData, local: text })}
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button
                mode='contained'
                onPress={handleAddMachine}
                style={styles.saveButton}
              >
                <Text style={styles.buttonText}>Adicionar</Text>
              </Button>
              <Button
                mode='contained'
                onPress={() => setAddModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
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
  addButton: {
    alignSelf: 'center', 
    marginBottom: 20,    
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center', 
    paddingHorizontal: 15,    
    paddingVertical: 10,      
    display: 'flex',
  },
  addText: {
    fontSize: 25,
    color: '#FEC601',
    textAlign: 'center',      
    lineHeight: 30,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FEC601',
    borderRadius: 5,
    fontSize: 20,
    padding: 10,
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
  buttonText: {
    fontSize: 20,
  },
});

export default ManageMachinesScreen;
