import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useUser} from '../context/UserContext';
import { API_URL } from '../config/api';

const LoginScreen = ({navigation}) => {
  const {userRole, login} = useUser();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getRoleDisplay = () => {
    switch (userRole) {
      case 'student':
        return {
          title: 'Student Login',
          icon: '🎓',
          color: '#3B82F6',
          placeholder: 'Student ID',
        };
      case 'faculty':
        return {
          title: 'Faculty Login',
          icon: '👨‍🏫',
          color: '#8B5CF6',
          placeholder: 'Faculty ID',
        };
      case 'parent':
        return {
          title: 'Parent Login',
          icon: '👨‍👩‍👧',
          color: '#10B981',
          placeholder: 'Parent ID',
        };
      default:
        return {
          title: 'Login',
          icon: '👤',
          color: '#007AFF',
          placeholder: 'User ID',
        };
    }
  };

  const roleDisplay = getRoleDisplay();

  const handleLogin = async () => {
    if (!userId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both User ID and Password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId.trim(),
          password: password.trim(),
          role: userRole,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Pass JWT token to login function
        await login(userRole, data.user, data.token);
        navigation.replace('Dashboard');
      } else {
        // Display server error message
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle network failures with user-friendly message
      Alert.alert(
        'Connection Error',
        'Unable to connect to server. Please check your connection.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View
          style={[styles.iconContainer, {backgroundColor: roleDisplay.color}]}>
          <Text style={styles.icon}>{roleDisplay.icon}</Text>
        </View>

        <Text style={styles.title}>{roleDisplay.title}</Text>
        <Text style={styles.subtitle}>Enter your credentials to continue</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder={roleDisplay.placeholder}
            value={userId}
            onChangeText={setUserId}
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('ProfileSelection')}
          disabled={loading}>
          <Text style={styles.backButtonText}>← Change Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {backgroundColor: roleDisplay.color},
            loading && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
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
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#F9FAFB',
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginScreen;
