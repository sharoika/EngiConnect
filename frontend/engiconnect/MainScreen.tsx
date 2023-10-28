import React from 'react';
import { View, Text, Button } from 'react-native';

function MainScreen({ navigation }: { navigation: any }) {
  return (
    <View>
      <Text>Main Screen</Text>
      {/* Add content for your main screen */}
      <Button
        title="Logout"
        onPress={() => {
          // Implement logout logic
          navigation.navigate('Login');
        }}
      />
    </View>
  );
}

export default MainScreen;
