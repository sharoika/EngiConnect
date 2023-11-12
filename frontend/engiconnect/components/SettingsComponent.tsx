import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Button, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsComponent = ({ navigation, isLoading, setIsLoading, setFullName }: { navigation: any, isLoading: any, setIsLoading: any, setFullName: any }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    degreeLevel: '',
    degreeType: '',
    isVerified: false,
    email: '',
    password: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [messageColor, setMessageColor] = useState('green');

  const loadUserData = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`http://localhost:3001/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFullName(data.firstName + " " + data.lastName);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    navigation.navigate('Login');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleVerifiedStatusClick = async () => {
    showMessage('Verification status updated', 'green');
  };

  const handleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`http://localhost:3001/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setIsEditing(false);
        loadUserData();
        showMessage('Success updating user data!', 'green');
      } else {
        console.error('Error saving user data:', response.status);
        showMessage('Error updating user data', 'red');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      showMessage('Error updating user data', 'red');
    }
  };

  const showMessage = (text: React.SetStateAction<string>, color: React.SetStateAction<string>) => {
    setMessage(text);
    setMessageColor(color);
    setIsMessageVisible(true);

    setTimeout(() => {
      setIsMessageVisible(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
      ) : (
        <View style={styles.userDataContainer}>
          <View style={styles.detailsContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={userData.firstName}
                onChangeText={(text) => setUserData({ ...userData, firstName: text })}
                editable={isEditing}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={userData.lastName}
                onChangeText={(text) => setUserData({ ...userData, lastName: text })}
                editable={isEditing}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Degree Level</Text>
              <TextInput
                style={styles.input}
                placeholder="Degree Level"
                value={userData.degreeLevel}
                onChangeText={(text) => setUserData({ ...userData, degreeLevel: text })}
                editable={isEditing}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Degree Type</Text>
              <TextInput
                style={styles.input}
                placeholder="Degree Type"
                value={userData.degreeType}
                onChangeText={(text) => setUserData({ ...userData, degreeType: text })}
                editable={isEditing}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={userData.email}
                onChangeText={(text) => setUserData({ ...userData, email: text })}
                editable={isEditing}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={userData.password}
                onChangeText={(text) => setUserData({ ...userData, password: text })}
                editable={isEditing}
              />
            </View>
          </View>
          <View style={styles.verifyContainer}>
            <Text style={styles.isVerifiedText}>
              {userData.isVerified ? 'Verified ✅' : 'Not Verified ❌'}
            </Text>
            {!userData.isVerified && (
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleVerifiedStatusClick}
              >
                <Text style={styles.buttonText}>Verify Now</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.buttonContainer}>
            {isEditing ? (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
          {isMessageVisible && (
            <Modal transparent={true} animationType="fade">
              <View style={styles.messageContainer}>
                <Text style={{ color: messageColor, textAlign: 'center', fontSize: 20}}>{message}</Text>
              </View>
            </Modal>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    verticalAlign: 'middle',
  },
  userDataContainer: {
    alignItems: 'center',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 32,
  },
  input: {
    width: '100%',
    height: 44,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'lightgreen',
    padding: 12,
    margin: 4,
    borderRadius: 5,
    width: '46%',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 4,
    borderRadius: 5,
    width: '46%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'grey',
    padding: 12,
    margin: 4,
    borderRadius: 5,
    width: '46%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifyContainer: {
    justifyContent: 'center',
    width: '84%',
    alignItems: 'center',
  },
  isVerifiedText: {
    fontSize: 24,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  messageContainer: {
    position: 'absolute',
    top: '8%',
    left: '10%',
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
});

export default SettingsComponent;
