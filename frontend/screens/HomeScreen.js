import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

const HomeScreen = () => {
  const { user } = useUser();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState('...');  // Simulando o tempo restante
  const [machineName, setMachineName] = useState('máquina');  // Simulando o nome da máquina

  useEffect(() => {
    if (user?.id_operador) {
      const fetchUserName = async () => {
        try {
          const response = await axios.get(`http://10.32.8.240:5000/users/${user.id_operador}`);
          if (response.data.success) {
            setUserName(response.data.user.nome);
            // Simular outras informações
            setRemainingTime('120');  // Supondo 120 minutos restantes
          } else {
            setError(response.data.error);
          }
        } catch (error) {
          setError('Erro na requisição');
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserName();
    } else {
      setLoading(false);
    }
  }, [user]);

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
        <Text style={styles.infoText}>Você irá trabalhar por mais: {remainingTime} minutos</Text>
        <Text style={styles.infoText}>Máquina sendo monitorada: {machineName}</Text>
        <TouchableOpacity style={styles.button} onPress={() => alert("Problema reportado")}>
          <Text style={styles.buttonText}>Viu algo de errado? Clique aqui e avise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.emergencyButton]} onPress={() => alert("Emergência!")}>
          <Text style={styles.buttonText}>Emergência!</Text>
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
    fontSize: 32, // tamanho similar ao "loginButtonText"
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