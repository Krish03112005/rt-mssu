import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LinearGradient} from 'expo-linear-gradient';

const DashboardScreen = ({navigation}) => {
  return (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <StatusBar backgroundColor="#10435eff" barStyle="light-content" />
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A6B96', '#060A25', '#1A6B96']}
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
        <Image
            source={require('../../assets/MSSU-Logo.png')}
            style={styles.logo}
            resizeMode="contain"
        />
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>U</Text>
          </View>
        </TouchableOpacity>
        </LinearGradient>


      <View style={styles.content}>
        <View style={styles.carouselPlaceholder}>
          <Text style={styles.placeholderText}>Image Carousel Section</Text>
          <Text style={styles.placeholderSubtext}>(Images will be added here)</Text>
        </View>
      </View>
    </View>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A6B96',
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
 logoContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 35,
},

  logo: {
  flex: 1,
  width: 120,
  height: 29,
  alignSelf: 'center',
  marginLeft: 10,
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
  content: {
    flex: 1,
    padding: 15,
  },
  carouselPlaceholder: {
    width: '100%',
    height: 200,
    borderWidth: 3,
    borderColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
  },
  profileButton: {
    marginLeft: 10,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1A6B96',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A6B96',
  },
});

export default DashboardScreen;
