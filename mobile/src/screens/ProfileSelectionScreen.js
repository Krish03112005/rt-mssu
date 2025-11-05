import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useUser} from '../context/UserContext';

const ProfileSelectionScreen = ({navigation}) => {
  const {setUserRole} = useUser();

  const handleProfileSelect = role => {
    setUserRole(role);
    navigation.navigate('Login');
  };

  const profiles = [
    {
      id: 'student',
      title: 'Student',
      color: '#3B82F6',
      icon: '🎓',
    },
    {
      id: 'faculty',
      title: 'Faculty',
      color: '#8B5CF6',
      icon: '👨‍🏫',
    },
    {
      id: 'parent',
      title: 'Parent',
      color: '#10B981',
      icon: '👨‍👩‍👧',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Who's using the app?</Text>
      <Text style={styles.subtitle}>Select your profile to continue</Text>

      <View style={styles.profilesContainer}>
        {profiles.map(profile => (
          <TouchableOpacity
            key={profile.id}
            style={[styles.profileCard, {borderColor: profile.color}]}
            onPress={() => handleProfileSelect(profile.id)}>
            <View
              style={[styles.iconContainer, {backgroundColor: profile.color}]}>
              <Text style={styles.icon}>{profile.icon}</Text>
            </View>
            <Text style={styles.profileTitle}>{profile.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 50,
  },
  profilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 20,
  },
  profileCard: {
    width: 140,
    height: 160,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 40,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
});

export default ProfileSelectionScreen;
