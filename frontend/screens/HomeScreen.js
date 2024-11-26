import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native'; 
import { api } from '../api/api';

const HomeScreen = () => {
  const { user } = useUser();
  const [userName, setUserName] = useState('');
  const [machineName, setMachineName] = useState('...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState('...');
  const navigation = useNavigation(); 

  useEffect(() => {
    let intervalId;

    const fetchUserDetails = async () => {
      try {
        // Buscar o nome do usuário
        const userResponse = await api.get(`/users/${user.id_operador}`);
        if (userResponse.data.success) {
          setUserName(userResponse.data.user.nome);
        } else {
          throw new Error(userResponse.data.error || 'Erro ao buscar dados do usuário');
        }

        // Buscar a máquina associada ao operador
        // Verificar se monitorResponse tem o ID da máquina
        const monitorResponse = await api.get(`/monitores/${user.id_operador}`);
        const id_maquina = monitorResponse?.data?.id_maquina;

        if (id_maquina) {
          // Buscar o nome da máquina com id_maquina válido
          const machineResponse = await api.get(`/users/nome_maquina/${id_maquina}`);
          const nome_maquina = machineResponse?.data?.nome_maquina;

          if (nome_maquina) {
            setMachineName(nome_maquina);
          } else {
            throw new Error('Nome da máquina não encontrado');
          }
        } else {
          throw new Error('ID da máquina não encontrado');
        }
        // Atualizar o tempo restante
        const updateRemainingTime = () => {
          const workStartTime = moment(userResponse.data.user.horario_de_trabalho, 'HH:mm:ss');
          const currentTime = moment();
          const endWorkTime = workStartTime.clone().add(10, 'hours');

          if (currentTime.isBefore(workStartTime)) {
            setRemainingTime('Expediente ainda não começou');
            Alert.alert(
              "Expediente ainda não começou",
              "Por favor, aguarde o início do expediente",
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate('Login'),
                },
              ]
            );
            return;
          }

          const remaining = moment.duration(endWorkTime.diff(currentTime));

          if (remaining.asMinutes() > 0) {
            const hours = Math.floor(remaining.asHours());
            const minutes = Math.floor(remaining.minutes());
            setRemainingTime(`${hours} horas e ${minutes} minutos`);
          } else {
            setRemainingTime('Expediente encerrado');
            Alert.alert(
              "Seu expediente acabou",
              "Bom descanso e até amanhã!",
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate('Login'),
                },
              ]
            );
            return;
          }
        };

        // Atualizar tempo restante ao montar o componente
        updateRemainingTime();

        // Atualizar tempo restante a cada 1 minuto
        intervalId = setInterval(updateRemainingTime, 60000);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id_operador) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.welcomeText}>Bem vindo! {userName}</Text>
      </View>
      <View style={styles.content}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.monitoringText}>Ferramenta de monitoramento</Text>
        <Text style={styles.infoText}>Você irá trabalhar por mais: {remainingTime}</Text>
        <Text style={styles.infoText}>Máquina sendo monitorada: {machineName}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Avisos')}>
          <Text style={styles.buttonText}>Viu algo de errado? Clique aqui e avise</Text>
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
  },
  logo: {
    width: 762,
    height: 217,
    alignSelf: 'center',
    marginTop: 60
  },
  monitoringText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FEC601',
    paddingVertical: 30,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 32, 
    color: 'white',
    textAlign: 'center', 
    marginVertical: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FEC601',
    padding: 10,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  emergencyButton: {
    backgroundColor: '#FF0000',
    marginTop: 30,
    width: '40%',
    alignSelf: 'center',
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    color: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 24,
    color: 'red',
  },
});

export default HomeScreen;
