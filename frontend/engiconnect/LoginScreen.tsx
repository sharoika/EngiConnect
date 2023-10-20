import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';

function LoginScreen({ navigation }) {
  return (
    <View>
      <Text>Login Screen</Text>
      <TextInput placeholder="Username" />
      <TextInput placeholder="Password" secureTextEntry />
      <Button
        title="Login"
        onPress={() => {
          // Implement your login logic here
          // If successful, navigate to the main screen
          navigation.navigate('Main');
        }}
      />
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('SignUp')}
      />
    </View>
  );
}

export default LoginScreen;
