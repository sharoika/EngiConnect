import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsComponent = ({ navigation, isLoading, setIsLoading }: { navigation: any, isLoading: any, setIsLoading: any }) => {
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

  const loadUserData = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`http://localhost:3001/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
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
      } else {
        console.error('Error saving user data:', response.status);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center', // Center vertically
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
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'lightblue',
    padding: 8,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 4,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'grey',
    padding: 12,
    margin: 4,
    borderRadius: 5,
    width: '48%',
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
    width: '96%',
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
    width: '94%',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default SettingsComponent;
