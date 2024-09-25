import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { api } from '../api/api';

const LoginScreen = ({ navigation }) => {
  const [id_maquina, setId_maquina] = useState('');
  const [id_operador, setId_operador] = useState('');
  const [id_tecnico, setId_tecnico] = useState(''); // Estado para o id_tecnico
  const [senha, setSenha] = useState(''); // Estado para a senha do técnico
  const [isLoading, setIsLoading] = useState(false);
  const [isTecnico, setIsTecnico] = useState(false); // Estado para alternar entre login de técnico e operador
  const { setUser } = useUser();

  const handleLogin = () => {
    setIsLoading(true);

    if (isTecnico) {
      // Login para técnico
      api.post('/logintecnicos', { id_tecnico, senha })
        .then(response => {
          setIsLoading(false);
          if (response.data.success) {
            setUser({ id_tecnico: response.data.user.id_tecnico });
            navigation.navigate('DrawerTecnico'); // Redireciona para HomeTecnico
            Alert.alert('Login Successful', `Welcome, Técnico ${response.data.user.id_tecnico}!`);
          } else {
            Alert.alert('Login Failed', response.data.error);
          }
        })
        .catch(error => {
          setIsLoading(false);
          console.error("Error during login", error);
          Alert.alert('Login Error', 'There was an error processing your request.');
        });
    } else {
      // Login para operador
      api.post('/login', { id_maquina, id_operador })
        .then(response => {
          setIsLoading(false);
          if (response.data.success) {
            setUser({ id_operador: response.data.user.id_operador });
            navigation.navigate('Drawer'); // Redireciona para tela do operador
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
    }
  };

  const handleContactPress = () => {
    navigation.navigate('nada ainda'); // Ajustar posteriormente
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Login</Text>
      </View>


      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Bem vindo!!</Text>
        <Image source={require('../assets/logo.png')} style={styles.logo} />

      {/* Barra para alternar entre técnico e operador */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, !isTecnico && styles.activeSwitch]}
          onPress={() => setIsTecnico(false)}
        >
          <Text style={styles.switchText}>Operador</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, isTecnico && styles.activeSwitch]}
          onPress={() => setIsTecnico(true)}
        >
          <Text style={styles.switchText}>Técnico</Text>
        </TouchableOpacity>
      </View>
        {/* Formulário para técnico ou operador */}
        {isTecnico ? (
          <>
            <Text style={styles.loginInstructions}>Login Técnico</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu ID Técnico"
              value={id_tecnico}
              onChangeText={setId_tecnico}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </>
        ) : (
          <>
            <Text style={styles.loginInstructions}>Login Operador</Text>
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
          </>
        )}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.loginButtonText}>{isLoading ? "Logging in..." : "Log-in"}</Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Caso você não lembre o login e a senha, entre em contato com técnico.
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
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  switchButton: {
    padding: 10,
    width: '40%',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  activeSwitch: {
    backgroundColor: '#FEC601',
  },
  switchText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    marginTop: 60,
  },
  welcomeText: {
    color: '#FEC601',
    fontSize: 40,
    textAlign: 'left',
    paddingLeft: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  loginInstructions: {
    color: '#FEC601',
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 70,
    marginTop: 30,
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
    height: 60,
  },
  loginButton: {
    backgroundColor: '#FEC601',
    padding: 10,
    width: '40%',
    alignSelf: 'center',
    borderRadius: 50,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 32,
    color: 'black',
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: 23,
    color: 'white',
    textAlign: 'left',
    maxWidth: '60%',
    marginTop: 80,
    alignSelf: 'center',
  },
  contactLink: {
    fontSize: 23,
    color: 'blue',
    textAlign: 'left',
    marginLeft: 175,
    textDecorationLine: 'underline',
    marginTop: 0,
  }
});

export default LoginScreen;
