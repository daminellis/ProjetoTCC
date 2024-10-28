import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { api } from '../api/api';
import { List, RadioButton } from 'react-native-paper';

const WarningScreen = () => {
  const { user } = useUser();
  const [warnings, setWarnings] = useState([]); 
  const [selectedWarning, setSelectedWarning] = useState(null); 
  const [idMaquina, setIdMaquina] = useState(null);
  const [gravidade, setGravidade] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false); 
  
  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        if (!user?.id_operador) {
          Alert.alert('Operador não autenticado', 'Por favor, faça login novamente.');
          return;
        }

        const response = await api.get(`/monitores/${user.id_operador}`);
        setIdMaquina(response.data.id_maquina);

        const warningsResponse = await api.get('/getwarning');
        if (warningsResponse.data.success) {
          console.log('Warnings recebidos:', warningsResponse.data.warnings); 
          setWarnings(warningsResponse.data.warnings);
        } else {
          Alert.alert('Erro', 'Nenhum aviso encontrado.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Erro ao buscar avisos.');
      }
    };

    fetchWarnings();
  }, [user?.id_operador]);

  useEffect(() => {
    console.log('Warnings atualizados:', warnings); 
  }, [warnings]);

  const handleSaveWarning = async () => {
    if (!selectedWarning) {
      Alert.alert('Erro', 'Por favor, selecione um aviso.');
      return;
    }

    try {
      if (!idMaquina) {
        Alert.alert('Erro', 'Máquina não encontrada.');
        return;
      }

      setLoading(true);
      await api.post(`/warning`, {
        id_operador: user.id_operador,
        id_maquina: idMaquina,
        descricao: selectedWarning.problema, 
        gravidade,
        criado_em: new Date().toISOString(),
      });

      Alert.alert('Sucesso', 'Aviso salvo com sucesso!');
      setSelectedWarning(null);
      setExpanded(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao salvar aviso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Registrar Aviso</Text>
      </View>
      <View style={styles.content}>
        <List.Accordion
          title={selectedWarning ? selectedWarning.problema : 'Selecione um aviso'} 
          expanded={expanded}
          onPress={() => setExpanded(!expanded)}
        >
          {warnings.length > 0 ? (
            warnings.map((warning) => (
              <List.Item
                key={warning.id_problema}
                title={warning.problema} 
                onPress={() => {
                  setSelectedWarning(warning);
                  setExpanded(false); 
                }}
              />
            ))
          ) : (
            <Text style={styles.noWarningsText}>Nenhum aviso encontrado.</Text>
          )}
        </List.Accordion>

        <Text style={styles.label}>Gravidade:</Text>
        <RadioButton.Group onValueChange={value => setGravidade(parseInt(value))} value={gravidade.toString()}>
          {[...Array(10).keys()].map(i => (
            <View key={i} style={styles.checkboxContainer}>
              <RadioButton value={(i + 1).toString()} />
              <Text>{i + 1}</Text>
            </View>
          ))}
        </RadioButton.Group>

        <TouchableOpacity style={styles.button} onPress={handleSaveWarning} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.buttonText}>Salvar Aviso</Text>
          )}
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
  label: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  noWarningsText: {
    padding: 10,
    textAlign: 'center',
    color: 'white',
  },
});

export default WarningScreen;
