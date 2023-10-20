import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';

function SignUpScreen({ navigation }) {
  return (
    <View>
      <Text>Sign Up Screen</Text>
      {/* Add input fields for sign-up details */}
      <Button
        title="Sign Up"
        onPress={() => {
          // Implement your sign-up logic here
          // If successful, navigate to the main screen
          navigation.navigate('Main');
        }}
      />
    </View>
  );
}

export default SignUpScreen;
