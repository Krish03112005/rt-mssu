import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text, StyleSheet} from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = () => {
  return (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerText}>slidebar Menu</Text>
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 250,
        },
      }}>
      <Drawer.Screen name="DashboardMain" component={DashboardScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  drawerText: {
    fontSize: 18,
    color: '#000',
  },
});

export default DrawerNavigator;
