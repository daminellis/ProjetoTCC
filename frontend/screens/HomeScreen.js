import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const HomeScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    axios.post('http://192.168.68.65:5000/home', { email, password })
      .then(response => {
        setIsLoading(false);
        if (response.data.success) {
          Alert.alert('Login Successful', `Welcome, ${response.data.user}!`);
          // Aqui você pode navegar para a próxima tela ou salvar o token de autenticação
        } else {
          Alert.alert('Login Failed', 'Invalid email or password.');
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
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={isLoading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}

export default HomeScreen;
