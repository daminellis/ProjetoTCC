import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { api } from '../api/api';

const UserVerificationScreen = () => {
  const { user } = useUser();
//PRECISO FAZER O IDOPERADOR RETORNAR OS DADOS DO TECNICO EM ESPECIFICO
  useEffect(() => {
    const fetchMaquina = async () => {
      try {
        if (!user?.id_operador) {
          Alert.alert('Operador não autenticado', 'Por favor, faça login novamente.');
          return;
        }

        const response = await api.get(`/tecnicos/${user.id_operador}`);
        // Aqui você pode fazer algo com a máquina retornada, se necessário
        console.log('Máquina associada:', response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Erro ao buscar máquina associada.');
      }
    };

    fetchMaquina();
  }, [user?.id_operador]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificação de Usuário</Text>
      {/* Aqui você pode adicionar outros elementos, se necessário */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEC601',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default UserVerificationScreen;
