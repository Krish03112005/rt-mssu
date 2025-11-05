import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileIcon from '../components/ui/icons/ProfileIcon';
import TuitionIcon from '../components/ui/icons/TuitionIcon';
import NoticeIcon from '../components/ui/icons/NoticeIcon';
import SupportIcon from '../components/ui/icons/SupportIcon';
import HolidayIcon from '../components/ui/icons/HolidayIcon';
import LogoutIcon from '../components/ui/icons/LogoutIcon';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({navigation}) => {
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  const menuItems = [
    {
      title: 'Profile Settings',
      icon: ProfileIcon,
      onPress: () => console.log('Profile Settings'),
    },
    {
      title: 'Tuition Fees',
      icon: TuitionIcon,
      onPress: () => console.log('Tuition Fees'),
    },
    {
      title: 'Circular/Notice',
      icon: NoticeIcon,
      onPress: () => console.log('Circular/Notice'),
    },
    {
      title: 'Support Ticket',
      icon: SupportIcon,
      onPress: () => console.log('Support Ticket'),
    },
    {
      title: 'Holiday',
      icon: HolidayIcon,
      onPress: () => console.log('Holiday'),
    },
  ];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.menuHeader}>
        <Text style={styles.menuTitle}>Menu</Text>
      </View>

      <ScrollView style={styles.menuItems}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}>
            <item.icon size={24} color="#4F46E5" />
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogoutIcon size={24} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
          width: 280,
        },
      }}>
      <Drawer.Screen name="DashboardMain" component={DashboardScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  menuItems: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 15,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 15,
    fontWeight: '600',
  },
});

export default DrawerNavigator;
