import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { api } from '../api/api';

const HomeTecnicoScreen = () => {
  const { user } = useUser();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user?.id_tecnico) {
      const fetchUserName = async () => {
        try {
          const response = await api.get(`/users/tecnicos/${user.id_tecnico}`);
          if (response.data.success) {
            setUserName(response.data.user.nome);
          } else {
            console.error(response.data.error);
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      };
      fetchUserName();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.welcomeText}>Bem vindo! {userName}</Text>
      </View>
      <View style={styles.content}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.monitoringText}>Ferramenta de monitoramento técnico</Text>
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
    alignItems: 'center',
  },
  logo: {
    width: 762,
    height: 217,
    marginTop: 60,
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
  },
});

export default HomeTecnicoScreen;
