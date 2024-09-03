import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const LoginScreen = () => {
  const [id_maquina, setid_maquina] = useState('');
  const [id_operador, setid_operador] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    axios.post('http://192.168.68.65:5000/login', { id_maquina, id_operador})
      .then(response => {
        setIsLoading(false);
        if (response.data.success) {
          Alert.alert('Login Successful', `Welcome, ${response.data.user.id_operador}!`);
          // Aqui você pode navegar para a próxima tela ou salvar o token de autenticação
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
        onChangeText={setid_maquina}
        autoCapitalize="none"
      />

      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
        placeholder="ID do Operador"
        value={id_operador}
        onChangeText={setid_operador}
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
