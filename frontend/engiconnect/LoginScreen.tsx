import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function LoginScreen({ navigation }: { navigation: any }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkUserId = async () => {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedFullName = await AsyncStorage.getItem('fullName');
        if (storedUserId && storedFullName) {
          navigation.navigate('Main');
        }
      };
      checkUserId();
    }, [])
  );

  const handleLogin = async () => {
    setMessage("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/login", { email, password });
      if (response.status === 200) {
        await AsyncStorage.setItem('userId', response.data.userId);
        await AsyncStorage.setItem('fullName', response.data.fullName);
        navigation.navigate('Main');
      } else {
        setMessage(response.data.message);
      }
    } catch (error: any) {
      setMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container as any}>
      <Text style={styles.title as any}>EngiConnect Login</Text>
      <Image source={require('frontend/engiconnect/gear.png')} style={styles.gearIcon as any} />
      <Text style={styles.errorText as any}>{message}</Text>
      <TextInput
        style={styles.input as any}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input as any}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {loading ? (
        <View style={styles.loginButton as any}>
          <Text style={styles.buttonText as any}>Logging in...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.loginButton as any} onPress={handleLogin}>
          <Text style={styles.buttonText as any}>Login</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.signupButton as any} onPress={() => { navigation.navigate('SignUp'); setMessage(""); }}>
        <Text style={styles.buttonText as any}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'aliceblue',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: '2%',
    marginTop: '16%',
  },
  gearIcon: {
    width: '100%',
    height: '50%',
  },
  input: {
    width: '80%',
    height: '5%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: '2%',
  },
  loginButton: {
    backgroundColor: 'lightblue',
    padding: '2%',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: '3%',
  },
  signupButton: {
    backgroundColor: 'grey',
    padding: '2%',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: '2%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: '6%',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
  },
  loadingText: {
    fontSize: 12,
    color: 'green',
  },
};

export default LoginScreen;
