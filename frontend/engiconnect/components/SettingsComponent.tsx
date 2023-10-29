import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsComponent = ({ navigation }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    profileImage: 'https://example.com/placeholder.jpg',
    degreeLevel: '',
    degreeType: '',
    isVerified: false,
    email: '',
    password: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const loadUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      // Replace 'API_ENDPOINT' with your actual API endpoint
      const response = await fetch(`API_ENDPOINT/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        setUserData({
          firstName: 'Placeholder First Name',
          lastName: 'Placeholder Last Name',
          profileImage: 'https://example.com/placeholder.jpg',
          degreeLevel: 'Placeholder Degree Level',
          degreeType: 'Placeholder Degree Type',
          isVerified: false,
          email: 'Placeholder Email',
          password: 'Placeholder Password',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserData({
        firstName: 'Placeholder First Name',
        lastName: 'Placeholder Last Name',
        profileImage: 'https://example.com/placeholder.jpg',
        degreeLevel: 'Placeholder Degree Level',
        degreeType: 'Placeholder Degree Type',
        isVerified: false,
        email: 'Placeholder Email',
        password: 'Placeholder Password',
      });
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    navigation.navigate('Login');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Replace 'API_ENDPOINT' with your actual API endpoint
      await fetch(`API_ENDPOINT/user/${userData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleImageUpload = async () => {
    // Implement image upload logic here
    // You can use a library like react-native-image-picker for image selection and upload
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handleImageUpload}>
          <Image
            source={{ uri: userData.profileImage }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={userData.firstName}
          onChangeText={(text) => setUserData({ ...userData, firstName: text })}
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={userData.lastName}
          onChangeText={(text) => setUserData({ ...userData, lastName: text })}
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          placeholder="Degree Level"
          value={userData.degreeLevel}
          onChangeText={(text) => setUserData({ ...userData, degreeLevel: text })}
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          placeholder="Degree Type"
          value={userData.degreeType}
          onChangeText={(text) => setUserData({ ...userData, degreeType: text })}
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userData.email}
          onChangeText={(text) => setUserData({ ...userData, email: text })}
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={userData.password}
          onChangeText={(text) => setUserData({ ...userData, password: text })}
          editable={isEditing}
        />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  saveButton: {
    backgroundColor: 'lightblue',
    padding: 8,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: 'lightblue',
    padding: 8,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: 'grey',
    padding: 8,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsComponent;
