import React, { useState } from 'react';
import { View, Text, Button, TextInput, Image, TouchableOpacity } from 'react-native';
import axios from "axios";

function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(" ");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setMessage(" ");
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: '2%',
    marginTop: '4%',
  },
  gearIcon: {
    width: '80%',
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
    backgroundColor: 'green',
    padding: '2%',
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
    marginTop: '2%',
  },
  signupButton: {
    backgroundColor: 'blue',
    padding: '2%',
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
    marginTop: '1%',
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
