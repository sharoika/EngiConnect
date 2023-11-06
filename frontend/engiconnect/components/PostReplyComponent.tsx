import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

function PostReplyComponent({ type, navigation }: { type: string, navigation: any }) {
  const backgroundColor = type === 'Post' ? 'green' : 'blue';
  const text = type === 'Post' ? 'Post' : 'Reply';

  const handleNavigateToWriteScreen = () => {
    navigation.navigate('Write', { type });
  };

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