import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

function ChatButtonComponent({
  navigation,
  isLoading,
  setIsLoading,
  userId,
  fullName,
}: {
  navigation: any;
  isLoading: any;
  setIsLoading: any;
  userId: any;
  fullName: any;
}) {
  const backgroundColor = "lightpink";
  const text = "Chat";

  const handleNavigateToChatScreen = () => {
    if (!isLoading) {
      console.log("PreChat Screen userId:" + userId);
      console.log("PreChat Screen fullName:" + fullName);
      navigation.navigate('Chat', { userId, fullName });
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.chatButton, { backgroundColor, left: 0, right: undefined }]}
      onPress={handleNavigateToChatScreen}
    >
      <Text style={styles.chatButtonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: "absolute",
    bottom: 2,
    borderRadius: 5,
    padding: 4,
    paddingLeft: 40,
    paddingRight: 40,
    marginLeft: 4,
    marginBottom: 10,
  },
  chatButtonText: {
    color: "white",
    fontSize: 28,
  },
});

export default ChatButtonComponent;
