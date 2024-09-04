import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation, setUserToken }) => {
  const [id_maquina, setId_maquina] = useState('');
  const [id_operador, setId_operador] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    axios.post('http://10.32.4.175:5000/login', { id_maquina, id_operador })
      .then(response => {
        setIsLoading(false);
        if (response.data.success) {
          // Supondo que o servidor retorne um token ou ID do operador em caso de sucesso
          const token = response.data.token || response.data.user.id_operador;
          setUserToken(token); // Definir o token ou ID do operador
          Alert.alert('Login Successful', `Welcome, ${response.data.user.id_operador}!`);
        } else {
          Alert.alert('Login Failed', response.data.error);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error("Error during login", error);
        Alert.alert('Login Error', 'There was an error processing your request.');
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
        placeholder="ID da Máquina"
        value={id_maquina}
        onChangeText={setId_maquina}
        autoCapitalize="none"
      />

      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
        placeholder="ID do Operador"
        value={id_operador}
        onChangeText={setId_operador}
      />

      <Button
        title={isLoading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}

export default LoginScreen;
