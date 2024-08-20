import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const App = () => {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    axios.get('https://projeto-tcc-six.vercel.app/dados')
      .then(response => {
        setDados(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <View>
      {dados.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </View>
  );
};

export default App;
