import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, FlatList } from 'react-native';
import { Card, Title, Paragraph, IconButton, Modal, TextInput, Button, Portal, Searchbar } from 'react-native-paper';
import { api } from '../api/api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const MenageUsersScreen = () => {
  const [loading, setLoading] = useState(false);
  const [operators, setOperators] = useState([]);
  const [filteredOperators, setFilteredOperators] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOperatorId, setExpandedOperatorId] = useState(null);
  const [editingOperator, setEditingOperator] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [formData, setFormData] = useState({ nome: '', horario_de_trabalho: '', id_maquina: '' });

  useFocusEffect(
    React.useCallback(() => {
      const fetchOperators = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/getoperadores`);

          if (response.data.operadores.length === 0) {
            Alert.alert('Aviso', 'Nenhum operador foi encontrado.');
          }

          setOperators(response.data.operadores);
          setFilteredOperators(response.data.operadores);
        } catch (error) {
          console.error(error);
          Alert.alert('Erro', 'Erro ao buscar os operadores.');
        } finally {
          setLoading(false);
        }
      };

      fetchOperators();
    }, [])
  );

  const toggleCard = (id) => {
    setExpandedOperatorId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (operator) => {
    setEditingOperator(operator);
    setFormData({
      nome: operator.nome,
      horario_de_trabalho: operator.horario_de_trabalho,
      id_maquina: operator.id_maquina,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/updateoperador`, {
        id_operador: editingOperator.id_operador,
        nome: formData.nome,
        horario_de_trabalho: formData.horario_de_trabalho,
        id_maquina: formData.id_maquina,
      });

      const updatedOperators = operators.map((operator) =>
        operator.id_operador === editingOperator.id_operador
          ? { ...operator, ...formData }
          : operator
      );

      setOperators(updatedOperators);
      setFilteredOperators(updatedOperators);
      setModalVisible(false);
      Alert.alert('Sucesso', 'Dados do operador atualizados com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atualizar o operador.');
    }
  };

  const handleAddOperator = async () => {
    try {
      const response = await api.post(`/createoperador`, {
        nome: formData.nome,
        horario_de_trabalho: formData.horario_de_trabalho,
        id_maquina: formData.id_maquina,
      });

      const newOperator = response.data.operador;
      setOperators([...operators, newOperator]);
      setFilteredOperators([...operators, newOperator]);
      setAddModalVisible(false);
      Alert.alert('Sucesso', 'Operador adicionado com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao adicionar operador.');
    }
  };

  const handleDeleteOperator = async (id_operador) => {
    Alert.alert('Confirmação', 'Tem certeza que deseja excluir este operador?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/deleteoperador`, { data: { id_operador } });

            const updatedOperators = operators.filter((op) => op.id_operador !== id_operador);
            setOperators(updatedOperators);
            setFilteredOperators(updatedOperators);
            Alert.alert('Sucesso', 'Operador excluído com sucesso!');
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Erro ao excluir o operador.');
          }
        },
      },
    ]);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredOperators(operators);
    } else {
      const filtered = operators.filter((operator) =>
        operator.nome.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOperators(filtered);
    }
  };

  const renderOperator = ({ item }) => {
    const isExpanded = expandedOperatorId === item.id_operador;

    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={() => toggleCard(item.id_operador)} style={{ flex: 1 }}>
            <Card.Content>
              <Text style={styles.cardActionText}>
                <Text style={styles.label}>ID Operador:</Text> {item.id_operador}
              </Text>
              <Text style={styles.cardActionText}>
                <Text style={styles.label}>Nome:</Text> {item.nome}
              </Text>
            </Card.Content>
          </TouchableOpacity>
          <IconButton icon="pencil" size={50}  onPress={() => handleEdit(item)} />
          <IconButton icon="delete" size={50}  onPress={() => handleDeleteOperator(item.id_operador)} />
        </View>

        {isExpanded && (
          <Card.Content style={styles.detailsContainer}>
            <Title style={styles.details}>Detalhes do Operador:</Title>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>Horário de Trabalho:</Text> {item.horario_de_trabalho}
            </Paragraph>
            <Paragraph style={styles.detailText}>
              <Text style={styles.label}>ID Máquina:</Text> {item.id_maquina}
            </Paragraph>
          </Card.Content>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Operadores</Text>
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
            setFormData({ nome: '', horario_de_trabalho: '', id_maquina: '' });
            setAddModalVisible(true);
          }}
          style={styles.addButton}
        >
        <Text style={styles.addText}>  Adicionar Operador </Text>
        </Button>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <FlatList
            data={filteredOperators}
            keyExtractor={(item) => item.id_operador.toString()}
            renderItem={renderOperator}
            ListEmptyComponent={<Text style={styles.noDataText}>Nenhum operador encontrado.</Text>}
          />
        )}
      </View>

      {/* Modal de Edição */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Title style={styles.modalTitle}>Editar Operador</Title>
          <TextInput
            label="Nome"
            value={formData.nome}
            onChangeText={(text) => setFormData({ ...formData, nome: text })}
            style={styles.input}
          />
          <TextInput
            label="Horário de Trabalho"
            value={formData.horario_de_trabalho}
            onChangeText={(text) => setFormData({ ...formData, horario_de_trabalho: text })}
            style={styles.input}
          />
          <TextInput
            label="ID Máquina"
            value={String(formData.id_maquina)}
            onChangeText={(text) => setFormData({ ...formData, id_maquina: text })}
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
        <Modal visible={addModalVisible} onDismiss={() => setAddModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Title style={styles.modalTitle}>Adicionar Operador</Title>
          <TextInput
            label="Nome"
            value={formData.nome}
            onChangeText={(text) => setFormData({ ...formData, nome: text })}
            style={styles.input}
          />
          <TextInput
            label="Horário de Trabalho"
            value={formData.horario_de_trabalho}
            onChangeText={(text) => setFormData({ ...formData, horario_de_trabalho: text })}
            style={styles.input}
          />
          <TextInput
            label="ID Máquina"
            value={String(formData.id_maquina)}
            onChangeText={(text) => setFormData({ ...formData, id_maquina: text })}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleAddOperator} style={styles.saveButton}>
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

export default MenageUsersScreen;
