import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, FlatList } from 'react-native';
import { Card, Title, Paragraph, IconButton, Modal, TextInput, Button, Portal, Searchbar } from 'react-native-paper';
import { api } from '../api/api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const ManageTechsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [expandedTecnicoId, setExpandedTecnicoId] = useState(null);
  const [editingTechnician, setEditingTechnician] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [formData, setFormData] = useState({ nome: '', area_de_manutencao: '', senha: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Refatorando a função de busca para gerar uma funcao reutilizavel de refresh
  const fetchTechnicians = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/gettecnicos`);

      if (response.data.tecnicos.length === 0) {
        Alert.alert('Aviso', 'Nenhum técnico foi encontrado.');
      }

      setTechnicians(response.data.tecnicos);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao buscar os técnicos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTechnicians();
    }, [fetchTechnicians])
  );

  const toggleCard = (id) => {
    setExpandedTecnicoId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (technician) => {
    setEditingTechnician(technician);
    setFormData({
      nome: technician.nome,
      area_de_manutencao: technician.area_de_manutencao,
      senha: technician.senha,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      await api.put(`/updatetecnico`, {
        id_tecnico: editingTechnician.id_tecnico,
        nome: formData.nome,
        area_de_manutencao: formData.area_de_manutencao,
        senha: formData.senha,
      });

      fetchTechnicians();      
      setModalVisible(false);
      Alert.alert('Sucesso', 'Dados do técnico atualizados com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atualizar o técnico.');
    }
  };

  const handleAddTechnician = async () => {
    try {
      await api.post(`/createtecnico`, formData);

      setFormData({ nome: '', area_de_manutencao: '', senha: '' });
      setAddModalVisible(false);

      // Reutilizando a função de busca para atualizar a lista
      fetchTechnicians();

      Alert.alert('Sucesso', 'Técnico adicionado com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao adicionar técnico.');
    }
  };

  const handleDeleteTechnician = async (id_tecnico) => {
    Alert.alert('Confirmação', 'Tem certeza que deseja excluir este técnico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/deletetecnico`, { data: { id_tecnico } });

            //const updatedTechnicians = technicians.filter((t) => t.id_tecnico !== id_tecnico);
            //setTechnicians(updatedTechnicians);
            fetchTechnicians();
            Alert.alert('Sucesso', 'Técnico excluído com sucesso!');
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Erro ao excluir o técnico.');
          }
        },
      },
    ]);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchTechnicians(); 
    } else {
      const filtered = technicians.filter((technician) =>
        technician.nome.toLowerCase().includes(query.toLowerCase())
      );
      setTechnicians(filtered);
    }
  };

  const renderTechnician = ({ item }) => {
    const isExpanded = expandedTecnicoId === item.id_tecnico;
    
    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={() => toggleCard(item.id_tecnico)} style={{ flex: 1 }}>
            <Card.Content>
              <Text style={styles.cardActionText}>
                <Text style={styles.label}>ID Técnico:</Text> {item.id_tecnico}
              </Text>
              <Text style={styles.cardActionText}>
                <Text style={styles.label}>Nome:</Text> {item.nome}
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
          onPress={() => handleDeleteTechnician(item.id_tecnico)} 
          />
        </View>

        {isExpanded && (
          <Card.Content style={styles.detailsContainer}>
            <Title style={styles.details}>Detalhes do Técnico:</Title>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>Área de manutenção:</Text> {item.area_de_manutencao}
            </Paragraph>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>Senha:</Text> {item.senha}
            </Paragraph>
          </Card.Content>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Técnicos</Text>
      </View>
      <Searchbar
        placeholder="Pesquisar por nome"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchbar}
      />
      <View style={styles.content}>
        <Button
          mode="contained"
          onPress={() => {
            setFormData({ nome: '', area_de_manutencao: '', senha: '' });
            setAddModalVisible(true);
          }}
          style={styles.addButton}
        >
        <Text style={styles.addText}> Adicionar Técnico </Text>
        </Button>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <FlatList
            data={technicians}
            keyExtractor={(item) => item.id_tecnico.toString()}
            renderItem={renderTechnician}
            ListEmptyComponent={<Text style={styles.noDataText}>Nenhum técnico encontrado.</Text>}
          />
        )}
      </View>

      {/* Modal de Edição */}
      <Portal>
        <Modal visible={modalVisible} 
               onDismiss={() => setModalVisible(false)}
               contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Editar Técnico</Title>
          <TextInput
            label="Nome"
            value={formData.nome}
            onChangeText={(text) => setFormData({ ...formData, nome: text })}
            style={styles.input}
          />
          <TextInput
            label="Área de Manutenção"
            value={formData.area_de_manutencao}
            onChangeText={(text) => setFormData({ ...formData, area_de_manutencao: text })}
            style={styles.input}
          />
          <TextInput
            label="Senha"
            value={formData.senha}
            onChangeText={(text) => setFormData({ ...formData, senha: text })}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
              Salvar
            </Button>
            <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              Cancelar
            </Button>
          </View>
        </Modal>

        {/* Modal de Adição */}
        <Modal visible={addModalVisible} 
               onDismiss={() => setAddModalVisible(false)} 
               contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Adicionar Técnico</Title>
          <TextInput
            label="Nome"
            value={formData.nome}
            onChangeText={(text) => setFormData({ ...formData, nome: text })}
            style={styles.input}
          />
          <TextInput
            label="Área de Manutenção"
            value={formData.area_de_manutencao}
            onChangeText={(text) => setFormData({ ...formData, area_de_manutencao: text })}
            style={styles.input}
          />
          <TextInput
            label="Senha"
            value={formData.senha}
            onChangeText={(text) => setFormData({ ...formData, senha: text })}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleAddTechnician} style={styles.saveButton}>
              Adicionar
            </Button>
            <Button mode="contained" onPress={() => setAddModalVisible(false)} style={styles.cancelButton}>
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

export default ManageTechsScreen;
