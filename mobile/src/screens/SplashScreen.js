import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useUser} from '../context/UserContext';

const SplashScreen = ({navigation}) => {
  const {restoreSession} = useUser();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Wait minimum time for splash screen visibility
        const minSplashTime = new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check for existing session
        const sessionRestored = await restoreSession();
        
        // Wait for minimum splash time to complete
        await minSplashTime;
        
        // Navigate based on session status
        if (sessionRestored) {
          // Valid token exists, navigate to Dashboard
          navigation.replace('Dashboard');
        } else {
          // No valid token, navigate to ProfileSelection
          navigation.replace('ProfileSelection');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // On error, navigate to ProfileSelection
        navigation.replace('ProfileSelection');
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [navigation, restoreSession]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SPLASH</Text>
      {isCheckingSession && (
        <ActivityIndicator 
          size="large" 
          color="#000" 
          style={styles.loader}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;
