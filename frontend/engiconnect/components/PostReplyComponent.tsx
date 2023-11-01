import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PostReplyComponent = ({ type }: { type: any }) => {
  const backgroundColor = type === 'Post' ? 'green' : 'blue';
  const text = type === 'Post' ? 'Post' : 'Reply';

  return (
    <TouchableOpacity style={[styles.postReply, { backgroundColor }]}>
      <Text style={styles.postReplyText}>{text}</Text>
    </TouchableOpacity>
  );
};

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