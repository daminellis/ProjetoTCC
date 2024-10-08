import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'; // Mantendo DrawerItemList
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from './screens/LoginScreen'; 
import HomeScreen from './screens/HomeScreen';
import WarningScreen from './screens/WarningScreen';
import HomeTecnicoScreen from './screens/HomeTecnicoScreen'; 

import { UserProvider, useUser } from './contexts/UserContext';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Login" 
            options={{ headerShown: false }}
            component={LoginScreen} 
          />
          {/* Drawer para o operador */}
          <Stack.Screen 
            name="Drawer" 
            component={DrawerNavigatorOperador} 
            options={{ headerShown: false }}
          />
          {/* Drawer para o técnico */}
          <Stack.Screen 
            name="DrawerTecnico" 
            component={DrawerNavigatorTecnico} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

// DrawerNavigator para o operador
const DrawerNavigatorOperador = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContentOperador {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Warning" component={WarningScreen} />
      {/* Adicione outras telas ao drawer aqui */}
    </Drawer.Navigator>
  );
};

// DrawerNavigator para o técnico
const DrawerNavigatorTecnico = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContentTecnico {...props} />}>
      <Drawer.Screen name="HomeTecnico" component={HomeTecnicoScreen} />
      {/* Adicione outras telas específicas para o técnico */}
    </Drawer.Navigator>
  );
};

// Custom Drawer Content para o operador
const CustomDrawerContentOperador = (props) => {
  const { setUser } = useUser(); // Pega o setUser do contexto

  const handleLogout = () => {
    setUser(null); // Desloga o usuário
    props.navigation.navigate('Login'); // Volta para a tela de login
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logoff" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
};

// Custom Drawer Content para o técnico
const CustomDrawerContentTecnico = (props) => {
  const { setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
    props.navigation.navigate('Login'); // Volta para a tela de login
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logoff" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
};

export default App;
