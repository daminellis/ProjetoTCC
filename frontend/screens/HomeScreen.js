// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import { useUser } from '../contexts/UserContext'; // Importar o contexto

const HomeScreen = () => {
  const { user } = useUser(); // Usar o contexto
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id_operador) {
      const fetchUserName = async () => {
        try {
          const response = await axios.get(`http://192.168.68.65:5000/users/${user.id_operador}`);
          if (response.data.success) {
            setUserName(response.data.user.nome);
          } else {
            setError(response.data.error);
          }
        } catch (error) {
          setError('Erro na requisição');
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24 }}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24 }}>Erro: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Bem-Vindo, {userName}!</Text>
    </View>
  );
};

export default HomeScreen;
