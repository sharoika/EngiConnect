import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import axios from "axios";

function SignUpScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(" ");
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setMessage(" ");
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    axios.post("http://localhost:3001/signup", { email, firstName, lastName, password })
      .then((response) => {
        if (response.status === 200) {
          setTimeout(() => {
            navigation.navigate('Login');
          }, 3000);
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
      <Text style={styles.title as any}>EngiConnect Sign Up</Text>
      <Text style={styles.errorText as any}>{message}</Text>
      <TextInput
        style={styles.input as any}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <View style={styles.nameInputContainer as any}>
        <TextInput
          style={styles.nameInput as any}
          placeholder="First Name"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
        <TextInput
          style={styles.nameInput as any}
          placeholder="Last Name"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
      </View>
      <TextInput
        style={styles.input as any}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input as any}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      {loading ? (
        <View style={styles.signupButton as any}>
          <Text style={styles.buttonText as any}>Signing up...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.signupButton as any} onPress={handleSignUp}>
          <Text style={styles.buttonText as any}>Sign Up</Text>
        </TouchableOpacity>
      )}
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
  input: {
    width: '80%',
    height: '5%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: '2%',
  },
  nameInputContainer: {
    width: '80%',
    height: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '2%',
  },
  nameInput: {
    width: '48%',
    height: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  signupButton: {
    backgroundColor: 'blue',
    padding: '2%',
    borderRadius: 5,
    width: '30%',
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
};

export default SignUpScreen;
