import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, FlatList } from 'react-native';
import { Card, Title, Paragraph, IconButton, Modal, TextInput, Button, Portal } from 'react-native-paper';
import { api } from '../api/api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native'; 

const MenageTechsScreen = () => {  
  const [loading, setLoading] = useState(false);
  const [operators, setOperators] = useState([]);
  const [expandedTecnicoId, setExpandedTecnicoId] = useState(null);
  const [editingOperator, setEditingOperator] = useState(null); // Armazena operador em edição
  const [modalVisible, setModalVisible] = useState(false); // Controla a visibilidade do modal
  const [formData, setFormData] = useState({ nome: '', area_de_manutencao: '', senha: '' });

  useFocusEffect(
    React.useCallback(() => {
      const fetchOperators = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/gettecnicos`);
          
          if (response.data.tecnicos.length === 0){
            Alert.alert('Aviso','Nenhum técnico foi encontrado.');
          }

          setOperators(response.data.tecnicos); 
        } catch (error) {
          console.error(error);
          Alert.alert('Erro', 'Erro ao buscar os técnicos.');
        } finally {
          setLoading(false);
        }
      };

      fetchOperators();
    }, [])
  );

  const toggleCard = (id) => {
    setExpandedTecnicoId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (tecnico) => {
    setEditingOperator(tecnico); // Define o operador atual para edição
    setFormData({
      nome: tecnico.nome,
      area_de_manutencao: tecnico.area_de_manutencao,
      senha: tecnico.senha,
    });
    setModalVisible(true); // Abre o modal de edição
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/updatetecnico`, {
        id_tecnico: editingOperator.id_tecnico,
        nome: formData.nome,
        area_de_manutencao: formData.area_de_manutencao,
        senha: formData.senha,
      });

      // Atualizar a lista de tecnicos após salvar
      const updatedOperators = operators.map((tecnico) =>
        tecnico.id_tecnico === editingOperator.id_tecnico
          ? { ...tecnico, ...formData }
          : tecnico
      );

      setOperators(updatedOperators);
      setModalVisible(false); // Fecha o modal após salvar
      Alert.alert('Sucesso', 'Dados do tecnico atualizados com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atualizar o tecnico.');
    }
  };

  const renderOperator = ({ item }) => {
    const isExpanded = expandedTecnicoId === item.id_tecnico; 

    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={() => toggleCard(item.id_tecnico)} style={{ flex: 1 }}>
            <Card.Content>
              <Text style={styles.cardActionText}>
                <Text style={styles.label}>ID Tecnico:</Text> {item.id_tecnico}
              </Text>
              <Text style={styles.cardActionText}>
                <Text style={styles.label}>Nome:</Text> {item.nome}
              </Text>
            </Card.Content>
          </TouchableOpacity>
          <IconButton
            icon="pencil"
            size={50}
            color="#FEC601"
            onPress={() => handleEdit(item)} // Chama o modal de edição
          />
        </View>

        {isExpanded && (
          <Card.Content style={styles.detailsContainer}>
            <Title style={styles.details}>Detalhes do Tecnico:</Title>
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
        <Text style={styles.title}>Tecnicos</Text>
      </View>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <FlatList
            data={operators}
            keyExtractor={(item) => item.id_tecnico.toString()}
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
            label="Area de Manutenção"
            value={formData.area_de_manutencao}
            onChangeText={(text) => setFormData({ ...formData, area_de_manutencao: text })}
            style={styles.input}
          />
          <TextInput
            label="Senha"
            value={String(formData.senha )}
            onChangeText={(text) => setFormData({ ...formData, senha: text })}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSave} style={styles.saveButton} labelStyle={styles.buttonText}>
              Salvar
            </Button>
            <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.cancelButton} labelStyle={styles.buttonText}>
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

export default MenageTechsScreen;
