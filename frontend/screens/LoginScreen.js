import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { api } from '../api/api';

// logs para operador
// log 1: |1/1| |1/2| |1/3| |2/6|
// logs para tecnico
// log 2: |1/123|

// Pares de (id_maquina, id_operador) que representam administradores
const ADMIN_CREDENTIALS = [
  { id_maquina: 'a', id_operador: 'a' }, 
  { id_maquina: 'maquina2', id_operador: 'admin2' }, 
];

const LoginScreen = ({ navigation }) => {
  const [id_maquina, setId_maquina] = useState('');
  const [id_operador, setId_operador] = useState('');
  const [id_tecnico, setId_tecnico] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTecnico, setIsTecnico] = useState(false);
  const { setUser } = useUser();

  useFocusEffect(
    useCallback(() => {
      // Quando a tela ganha foco (quando você navega para ela)
      return () => {
        // Quando a tela perde foco (quando você sai da tela)
        setId_maquina('');
        setId_operador('');
        setId_tecnico('');
        setSenha('');
      };
    }, [])
  );

const handleLogin = () => {
  if (isLoading) return;

  // Validação de entradas
  if (isTecnico && (!id_tecnico || !senha)) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos para o login de Técnico.');
    return;
  }

  if (!isTecnico && (!id_maquina || !id_operador)) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos para o login de Operador.');
    return;
  }

  // Verifica se o par (id_maquina, id_operador) corresponde a um administrador
  const isAdmin = ADMIN_CREDENTIALS.some(
    admin => admin.id_maquina === id_maquina && admin.id_operador === id_operador
  );

  if (isAdmin) {
    // Se for um administrador, navega para a tela de administrador
    const nextScreen = 'DrawerAdmin'; 
    navigation.navigate(nextScreen);
    Alert.alert('Login bem-sucedido', `Bem-vindo, Administrador ${id_operador}!`);
    return;
  } else {
    setIsLoading(true);
    
    const endpoint = isTecnico ? '/logintecnicos' : '/login';
    const payload = isTecnico ? { id_tecnico, senha } : { id_maquina, id_operador };

    api.post(endpoint, payload)
      .then(response => {
        setIsLoading(false);
        if (response.data.success) {
          const user = isTecnico ? { id_tecnico: response.data.user.id_tecnico } : { id_operador: response.data.user.id_operador };
          setUser(user);
          const nextScreen = isTecnico ? 'DrawerTecnico' : 'Drawer';
          navigation.navigate(nextScreen);
          Alert.alert('Login bem-sucedido', `Bem-vindo, ${isTecnico ? 'Técnico' : 'Operador'} ${response.data.user.id_operador || response.data.user.id_tecnico}!`);
        } else {
          Alert.alert('Erro de login', response.data.error);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error("Erro no login:", error);
        Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login.');
      });
  }
};
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Login</Text>
      </View>

      <View style={styles.formContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        {/* Alternância entre técnico e operador */}
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

        {/* Formulário de login */}
        {isTecnico ? (
          <>
            <Text style={styles.loginInstructions}>Login Técnico</Text>
            <TextInput
              style={styles.input}
              placeholder="ID Técnico"
              value={id_tecnico}
              onChangeText={setId_tecnico}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
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
              placeholder="ID Máquina"
              value={id_maquina}
              onChangeText={setId_maquina}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="ID Operador"
              value={id_operador}
              onChangeText={setId_operador}
              secureTextEntry
            />
          </>
        )}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Text style={styles.loginButtonText}>Log-in</Text>
          )}
        </TouchableOpacity>
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
    padding: 20,
  },
  switchButton: {
    padding: 10,
    width: '40%',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 20,
  },
  activeSwitch: {
    backgroundColor: '#FEC601',
  },
  switchText: {
    fontSize: 25,
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
    borderRadius: 10,
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
