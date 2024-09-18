import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, Linking } from 'react-native';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
// lembrar de importar o link do contato do tecnico

const LoginScreen = ({ navigation }) => {
  const [id_maquina, setId_maquina] = useState('');
  const [id_operador, setId_operador] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();

  const handleLogin = () => {
    setIsLoading(true);
    axios.post('http://10.32.8.240:5000/login', { id_maquina, id_operador })
      .then(response => {
        setIsLoading(false);
        if (response.data.success) {
          setUser({ id_operador: response.data.user.id_operador });
          navigation.navigate('Drawer');
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

  const handleContactPress = () => {
    navigation.navigate('nada ainda'); //necessario ajustar ainda
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Login</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Bem vindo!!</Text>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.loginInstructions}>Faça o login da máquina</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite aqui o login da máquina"
          value={id_maquina}
          onChangeText={setId_maquina}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Digite aqui a senha da máquina"
          value={id_operador}
          onChangeText={setId_operador}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.loginButtonText}>{isLoading ? "Logging in..." : "Log-in"}</Text>
        </TouchableOpacity>
        <Text style={styles.helpText}>
          Caso você não lembre o login e a senha do maquinário, entre em contato com técnico.
        </Text>
        <Text style={styles.contactLink} onPress={handleContactPress}>
          Contato técnico
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEC601',
  },
  header: {
    paddingVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold'
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'gray', 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  logo: {
    width: 762,
    height: 217,
    alignSelf: 'center',
    marginTop: 60
  },
  welcomeText: {
    color: '#FEC601',
    fontSize: 40,
    textAlign: 'left',
    paddingLeft: 20,
    paddingVertical: 10,
    marginBottom: 20
  },
  loginInstructions: {
    color: '#FEC601',
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 70,
    marginTop: 30
  },
  input: {
    backgroundColor: 'white', 
    borderColor: '#FEC601',
    alignSelf: 'center',
    width: '60%',
    color: 'black',
    borderWidth: 2,
    marginBottom: 50,
    padding: 10,
    borderRadius: 10, 
    fontSize: 20,
    height: 60
  },
  loginButton: {
    backgroundColor: '#FEC601',
    padding: 10,
    width: '40%',
    alignSelf: 'center',
    borderRadius: 50,
    alignItems: 'center'
  },
  loginButtonText: {
    fontSize: 32,
    color: 'black',
    fontWeight: 'bold'
  },
  helpText: {
    fontSize: 23,
    color: 'white',
    textAlign: 'center', 
    maxWidth: '60%', 
    marginTop: 150,
    alignSelf: 'center',
  },
  contactLink: {
    fontSize: 23,
    color: 'blue',
    textAlign: 'left',
    marginLeft: 160,
    textDecorationLine: 'underline',
    marginTop: 0,
  }
});

export default LoginScreen;
