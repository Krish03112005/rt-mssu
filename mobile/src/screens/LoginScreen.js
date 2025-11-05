import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useUser} from '../context/UserContext';

const LoginScreen = ({navigation}) => {
  const {userRole} = useUser();

  const getRoleDisplay = () => {
    switch (userRole) {
      case 'student':
        return {title: 'Student Login', icon: '🎓', color: '#3B82F6'};
      case 'faculty':
        return {title: 'Faculty Login', icon: '👨‍🏫', color: '#8B5CF6'};
      case 'parent':
        return {title: 'Parent Login', icon: '👨‍👩‍👧', color: '#10B981'};
      default:
        return {title: 'Login', icon: '👤', color: '#007AFF'};
    }
  };

  const roleDisplay = getRoleDisplay();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, {backgroundColor: roleDisplay.color}]}>
          <Text style={styles.icon}>{roleDisplay.icon}</Text>
        </View>
        
        <Text style={styles.title}>{roleDisplay.title}</Text>
        <Text style={styles.subtitle}>Enter your credentials to continue</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('ProfileSelection')}>
          <Text style={styles.backButtonText}>← Change Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: roleDisplay.color}]}
          onPress={() => navigation.replace('Dashboard')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginScreen;
