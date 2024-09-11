import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from './screens/LoginScreen'; 
import HomeScreen from './screens/HomeScreen';

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
  );
}

const DrawerNavigator = ({ route }) => {
  const { id_operador } = route.params || {}; // Recebe o id_operador da navegação

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home">
        {props => <HomeScreen {...props} id_operador={id_operador} />}
      </Drawer.Screen>
      {/* Adicione outras telas ao drawer aqui */}
    </Drawer.Navigator>
  );
};

export default App;
