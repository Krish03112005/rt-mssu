import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LinearGradient} from 'expo-linear-gradient';

const DashboardScreen = ({navigation}) => {
  return (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <StatusBar backgroundColor="#424588" barStyle="light-content" />
    <View style={styles.container}>
      <LinearGradient
        colors={['#424588', '#060A25']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.navbar}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Dashboard</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Dashboard</Text>
      </View>
    </View>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#424588',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  
  menuButton: {
    padding: 5,
  },
  menuIcon: {
    width: 25,
    height: 20,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: 25,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: '#000',
  },
});

export default DashboardScreen;
