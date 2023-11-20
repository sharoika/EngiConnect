import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

function PostComponent({ type, navigation, isLoading, setIsLoading }: { type: string, navigation: any, isLoading: any, setIsLoading: any }) {
  const backgroundColor = 'lightgreen';
  const text = type == "Post" ? 'Post' : 'Reply';

  const handleNavigateToWriteScreen = () => {
    navigation.navigate('Write', { setIsLoading });
  };

  if (isLoading) {
    return null;
  }

  return (
    <TouchableOpacity style={[styles.postReply, { backgroundColor }]} onPress={handleNavigateToWriteScreen}>
      <Text style={styles.postReplyText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  postReply: {
    position: 'absolute',
    bottom: 2,
    borderRadius: 5,
    padding: 4,
    paddingLeft: 40,
    paddingRight: 40,
    marginRight: 4,
    marginBottom: 10,
    right: 0,
  },
  postReplyText: {
    color: 'white',
    fontSize: 28,
  },
});

export default PostComponent;
