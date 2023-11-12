import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

function PostReplyComponent({ type, navigation, isLoading }: { type: string, navigation: any, isLoading: any }) {
  const backgroundColor = 'green';
  const text = 'Post';

  const handleNavigateToWriteScreen = () => {
    navigation.navigate('Write', { type });
  };

  console.log(isLoading);

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
    bottom: 20,
    borderRadius: 5,
    padding: 6,
    paddingLeft: 30,
    paddingRight: 30,
    margin: 10,
    right: 6,
  },
  postReplyText: {
    color: 'white',
    fontSize: 24,
  },
});

export default PostReplyComponent;
