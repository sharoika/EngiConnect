import React, { useEffect, useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsComponent from './components/SettingsComponent';
import PostReplyComponent from './components/PostReplyComponent';
import IssuesComponent from './components/IssuesComponent'; // Import the IssuesComponent
import SDGComponent from './components/SDGComponent';

function MainScreen({ navigation }: { navigation: any }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [selectedOption, setSelectedOption] = useState('SDG');
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
    setSelectedOption(option);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'SDG':
        return (
          <View style={styles.content}>
            <SDGComponent selectedOption={setSelectedOption}/>
          </View>
        );
      case 'Issues':
        return (
          <View style={styles.content}>
            <IssuesComponent type="Top" />
            <PostReplyComponent type="Post" />
          </View>
        );
      case 'Settings':
        return (
          <SettingsComponent navigation={navigation} />
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
    alignItems: 'flex-end', // Right-align the content vertically
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
    fontSize: 32,
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
