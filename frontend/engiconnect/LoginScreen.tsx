import React, { useState } from 'react';
import { View, Text, Button, TextInput, Image, TouchableOpacity } from 'react-native';
import axios from "axios";

function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setMessage("");
    setLoading(true);
    axios.post("http://localhost:3001/login", { email, password })
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('Main');
        } else {
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container as any}>
      <Text style={styles.title as any}>EngiConnect</Text>
      <Image source={require('frontend/engiconnect/gear.png')} style={styles.gearIcon as any} />
      {message && <Text style={styles.errorText}>{message}</Text>}
      {!message && <View style={styles.space}></View>}
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
        <View style={styles.loadingContainer as any}>
          <Text style={styles.loadingText}>Logging in...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.loginButton as any} onPress={handleLogin}>
          <Text style={styles.buttonText as any}>Login</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.signupButton as any} onPress={() => navigation.navigate('SignUp')}>
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
    backgroundColor: 'white',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  gearIcon: {
    width: '100%',
    height: '50%',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    marginBottom: 12,
  },
  space: {
    height: 42,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 18,
    color: 'green',
  },
};

export default LoginScreen;
