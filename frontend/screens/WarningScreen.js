import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { api } from '../api/api';

const WarningScreen = () => {
  const { user } = useUser();
  const [descricao, setDescricao] = useState('');

  const handleSaveWarning = async () => {
    try {
      if (!user?.id_operador) {
        Alert.alert('Operador não autenticado', 'Por favor, faça login novamente.');
        return;
      }

      const response = await api.get(`/monitores/${user.id_operador}`);
      const id_maquina = response.data.id_maquina;

      await api.post(`/warning`, {
        id_operador: user.id_operador,
        id_maquina,
        descricao,
        criado_em: new Date().toISOString(),
      });

      Alert.alert('Sucesso', 'Aviso salvo com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao salvar aviso.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Registrar Aviso</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Descrição do aviso"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveWarning}>
          <Text style={styles.buttonText}>Salvar Aviso</Text>
        </TouchableOpacity>
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
  input: {
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 18,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FEC601',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default WarningScreen;
