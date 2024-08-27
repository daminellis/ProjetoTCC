import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Faça a chamada à API do Flask
    axios.get('http://10.32.17.60:5000/hello')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error("Erro ao fazer a chamada para a API", error);
      });
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>{message}</Text>
    </View>
  );
}

export default App;
