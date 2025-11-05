import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileIcon from '../components/ui/icons/ProfileIcon';
import TuitionIcon from '../components/ui/icons/TuitionIcon';
import NoticeIcon from '../components/ui/icons/NoticeIcon';
import SupportIcon from '../components/ui/icons/SupportIcon';
import HolidayIcon from '../components/ui/icons/HolidayIcon';
import LibraryIcon from '../components/ui/icons/LibraryIcon';
import LogoutIcon from '../components/ui/icons/LogoutIcon';
import MenuIcon from '../components/ui/icons/MenuIcon';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({navigation}) => {
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'ProfileSelection'}],
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
    {
      title: 'Library',
      icon: LibraryIcon,
      onPress: () => console.log('Library'),
    },
  ];

  return (
    <SafeAreaView style={styles.drawerContainer} edges={['top', 'bottom']}>
      <View style={styles.menuHeader}>
        <MenuIcon size={28} color="#000" />
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
    </SafeAreaView>
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
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuTitle: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 12,
  },
  menuItems: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#F9FAFB',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
