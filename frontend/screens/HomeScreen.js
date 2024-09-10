import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const HomeScreen = ({ route }) => {
  const { id_operador } = route.params || {}; // Obtém o id_operador passado pela navegação
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (id_operador) {
      const fetchUserName = async () => {
        try {
          const response = await axios.get(`http://10.32.18.16:5000/users/${id_operador}`);
          if (response.data.success) {
            setUserName(response.data.user.name); // Ajuste conforme a resposta da sua API
          } else {
            console.error('Erro ao buscar nome do usuário');
          }
        } catch (error) {
          console.error('Erro na requisição', error);
        }
      };

      fetchUserName();
    }
  }, [id_operador]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Bem-Vindo, {userName}!</Text>
    </View>
  );
};

export default HomeScreen;
