import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from './screens/LoginScreen'; 
import HomeScreen from './screens/HomeScreen';
import WarningScreen from './screens/WarningScreen';
import HomeTecnicoScreen from './screens/HomeTecnicoScreen'; 
import MaintenceScreen from './screens/MaintenceScreen'; 
import HomeAdminScreen from './screens/HomeAdminScreen';

import { UserProvider, useUser } from './contexts/UserContext';
import { Provider as PaperProvider } from 'react-native-paper';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer); // Limpa o timer se o componente desmontar
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
            component={DrawerNavigatorOperador} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="DrawerTecnico" 
            component={DrawerNavigatorTecnico} 
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DrawerAdmin"
            component={DrawerNavigatorAdmin}
            options={{ headerShown: false }}          
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const DrawerNavigatorOperador = () => {
  return (
    <PaperProvider>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContentOperador {...props} />}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Avisos" component={WarningScreen} />
      </Drawer.Navigator>
    </PaperProvider>
  );
};

const DrawerNavigatorTecnico = () => {
  return (
    <PaperProvider>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContentTecnico {...props} />}>
        <Drawer.Screen name="Home Tecnico" component={HomeTecnicoScreen} />
        <Drawer.Screen name="Manutenções" component={MaintenceScreen} />
      </Drawer.Navigator>
    </PaperProvider>
  );
};

const DrawerNavigatorAdmin = () => {
  return (
    <PaperProvider>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContentAdmin {...props} />}>
        <Drawer.Screen name="Home Admin" component={HomeAdminScreen} />
      </Drawer.Navigator>
    </PaperProvider>
  );
};

const CustomDrawerContentOperador = (props) => {
  const { setUser } = useUser(); 

  const handleLogout = () => {
    setUser(null); 
    props.navigation.navigate('Login'); 
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logoff" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
};

const CustomDrawerContentTecnico = (props) => {
  const { setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
    props.navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logoff" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
};

const CustomDrawerContentAdmin = (props) => {
  const { setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
    props.navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logoff" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
};

export default App;
