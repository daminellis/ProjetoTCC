import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const HomeAdminScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.welcomeText}>Bem-vindo ao painel de administrador!</Text>
      </View>
      <View style={styles.content}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.monitoringText}>Painel de gerenciamentos</Text>
        <Text style={styles.infoText}>Funções administrativas disponíveis:</Text>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gerenciar Operadores')}>
          <Text style={styles.buttonText}>Gerenciar Operadores</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gerenciar Técnicos')}>
          <Text style={styles.buttonText}>Gerenciar Técnicos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gerenciar Trabalhos')}>
          <Text style={styles.buttonText}>Gerenciar Trabalhos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Relatórios</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEC601',
  },
  topBar: {
    backgroundColor: 'transparent', 
    paddingVertical: 50,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white', 
    marginBottom: 10,
  },
  content: {
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
  monitoringText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FEC601',
    paddingVertical: 30,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 32, 
    color: 'white',
    textAlign: 'center', 
    marginVertical: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FEC601',
    padding: 10,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default HomeAdminScreen;
