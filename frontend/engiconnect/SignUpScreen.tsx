import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import axios from "axios";

function SignUpScreen({ navigation }: { navigation: any }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setErrorMessage("");
    setLoading(true);
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }
    axios.post("http://localhost:3001/signup", { email, firstName, lastName, password })
      .then((response) => {
        if (response.status === 200) {
          setErrorMessage("");
          setSuccessMessage(response.data.message);
          setTimeout(() => {
            navigation.navigate('Login');
          }, 3000);
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container as any}>
      <Text style={styles.title as any}>EngiConnect Sign Up</Text>
      {errorMessage ? <Text style={styles.errorText as any}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.successText as any}>{successMessage}</Text> : null}
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
      <TouchableOpacity style={styles.backToLoginButton as any} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText as any}>Back to Login</Text>
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
  input: {
    width: '80%',
    height: '5%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: '4%',
  },
  nameInputContainer: {
    width: '80%',
    height: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '4%',
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
    backgroundColor: 'lightblue',
    padding: '2%',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: '3%',
  },
  backToLoginButton: {
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
    marginTop: '6%',
    marginBottom: '6%',
  },
  successText: {
    fontSize: 16,
    color: 'green',
    marginTop: '6%',
    marginBottom: '6%',
  },
};

export default SignUpScreen;
