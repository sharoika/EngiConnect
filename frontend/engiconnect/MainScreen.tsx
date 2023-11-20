import React, { useEffect, useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsComponent from './components/SettingsComponent';
import IssuesComponent from './components/IssuesComponent';
import SDGComponent from './components/SDGComponent';

function MainScreen({ navigation }: { navigation: any }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [selectedOption, setSelectedOption] = useState('SDG');
  const [SDGFilter, setSDGFilter] = useState(" ");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(" ");
  const [fullName, setFullName] = useState(" ");

  useEffect(() => {
    const checkUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedFullName = await AsyncStorage.getItem('fullName');
      if (!storedUserId || !storedFullName) {
        navigation.navigate('Login');
      } else {
        setUserId(storedUserId);
        setFullName(storedFullName);
      }
    };
    checkUserId();
  }, []);

  const handleOptionSelect = (option: any) => {
    setIsLoading(true);
    setSelectedOption(option);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'SDG':
        return (
          <View style={styles.content}>
            <SDGComponent selectedOption={setSelectedOption} setIsLoading={setIsLoading} setSDGFilter={setSDGFilter} />
          </View>
        );
      case 'Issues':
        return (
          <View style={styles.content}>
            <IssuesComponent SDGFilter={SDGFilter} isLoading={isLoading} setSDGFilter={setSDGFilter} setIsLoading={setIsLoading} />
          </View>
        );
      case 'Settings':
        return (
          <SettingsComponent navigation={navigation} isLoading={isLoading} setIsLoading={setIsLoading} setFullName={setFullName} />
        );
      default:
        return (
          <View style={styles.content}>
            <Text>No content selected</Text>
          </View>
        );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{fullName}</Text>
      <View style={styles.overlay}>
        {renderContent()}
      </View>
      <View style={styles.navigation}>
        <TouchableHighlight
          style={[
            styles.icon,
            selectedOption === 'SDG' ? styles.selectedIcon : null,
          ]}
          onPress={() => handleOptionSelect('SDG')}
        >
          <Text style={styles.iconText}>🌐</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[
            styles.icon,
            selectedOption === 'Issues' ? styles.selectedIcon : null,
          ]}
          onPress={() => handleOptionSelect('Issues')}
        >
          <Text style={styles.iconText}>🗒️</Text>
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
    width: "100%",
    alignItems: 'center'
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
    backgroundColor: 'aliceblue',
  },
  selectedIcon: {
    backgroundColor: 'lightblue',
  },
  iconText: {
    fontSize: 40,
    padding: '4%',
  },
  overlay: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default MainScreen;
