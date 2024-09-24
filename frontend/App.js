import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'; // Mantendo DrawerItemList
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from './screens/LoginScreen'; 
import HomeScreen from './screens/HomeScreen';
import WarningScreen from './screens/WarningScreen';

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
          <Stack.Screen 
            name="Drawer" 
            component={DrawerNavigator} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Warning" component={WarningScreen} />
      {/* Adicione outras telas ao drawer aqui */}
    </Drawer.Navigator>
  );
};

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  const { setUser } = useUser(); // Pega o setUser do contexto

  const handleLogout = () => {
    setUser(null); // Desloga o usuário
    props.navigation.navigate('Login'); // Volta para a tela de login
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Exibe todas as telas da drawer */}
      <DrawerItemList {...props} />
      {/* Botão de Logoff */}
      <DrawerItem
        label="Logoff"
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
};

export default App;
