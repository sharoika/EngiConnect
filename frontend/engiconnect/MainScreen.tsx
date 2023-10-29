import React, { useEffect, useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsComponent from './components/SettingsComponent';

function MainScreen({ navigation }: { navigation: any }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [selectedOption, setSelectedOption] = useState('Home');
  const [userId, setUserId] = useState(" ");

  useEffect(() => {
    const checkUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        navigation.navigate('Login');
      } else {
        setUserId(storedUserId);
      }
    };
    checkUserId();
  }, []);

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'Home':
        return (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>🌐</Text>
          </View>
        );
      case 'Top Issues':
        return (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>🔝</Text>
          </View>
        );
      case 'Settings':
        return (
          <SettingsComponent navigation={navigation} />
        );
      default:
        return (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>No content selected</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title as any}>EngiConnect</Text>

      <View style={styles.overlay}>
        {renderContent()}
      </View>

      <View style={styles.navigation}>
      <TouchableHighlight
        style={[
          styles.icon,
          selectedOption === 'Home' ? styles.selectedIcon : null,
        ]}
        onPress={() => handleOptionSelect('Home')}
      >
        <Text style={styles.iconText}>🌐</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={[
          styles.icon,
          selectedOption === 'Top Issues' ? styles.selectedIcon : null,
        ]}
        onPress={() => handleOptionSelect('Top Issues')}
      >
        <Text style={styles.iconText}>🔝</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={[
          styles.icon,
          selectedOption === 'Settings' ? styles.selectedIcon : null,
        ]}
        onPress={() => handleOptionSelect('Settings')}
      >
        <Text style={styles.iconText}>⚙️</Text>
      </TouchableHighlight>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'aliceblue',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: '2%',
    marginTop: '16%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'aliceblue',
  },
  icon: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'aliceblue', // Default background color
  },
  selectedIcon: {
    backgroundColor: 'lightblue', // Darker background color for selected option
  },
  iconText: {
    fontSize: 32,
    padding: '4%',
  },
  overlay: {
    flex: 6,
    width: '100%',
    backgroundColor: 'white',
  },
});

export default MainScreen;
