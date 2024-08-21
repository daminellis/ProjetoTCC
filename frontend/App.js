import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
   teste();
  }, []);

  async function teste() {
    try {

      
      const api = axios.create({
        baseURL: 'http://192.168.0.100:5000'
      });
      
      console.log("data:");
      const {data} = await api.get('/data');
      console.log("data:", data);
      setData(data);
    } catch(e) {
      console.log(e)
    }
      
    }
    
    return (
      <View>
      <Text>{data ? data.message : 'Loadi...'}</Text>
    </View>
  );
};

export default App;
