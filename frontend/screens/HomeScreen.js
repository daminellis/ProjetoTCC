import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ route }) => {
  const { id_operador } = route.params || {}; // Obtém o id_operador passado pela navegação
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true); // Adicione um estado para controlar o carregamento
  const [error, setError] = useState(null); // Adicione um estado para erros

  useEffect(() => {
    if (id_operador) {
      const fetchUserName = async () => {
        try {
          console.log(`Fetching user with ID: ${id_operador}`); // Log para verificar o ID do operador
          const response = await axios.get(`http://192.168.68.65:5000/users/${id_operador}`);
          console.log('API Response:', response.data); // Adicione este log para depuração
          if (response.data.success) {
            setUserName(response.data.user.nome); // Atualize o estado com o nome do usuário
            setLoading(false); // Defina o carregamento como falso após a resposta
          } else {
            setError(response.data.error);
            setLoading(false); // Defina o carregamento como falso após a resposta
          }
        } catch (error) {
          console.error('Erro na requisição', error);
          setError('Erro na requisição');
          setLoading(false); // Defina o carregamento como falso após o erro
        }
      };      

      fetchUserName();
    } else {
      setLoading(false); // Defina o carregamento como falso se não houver id_operador
    }
  }, [id_operador]);

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
