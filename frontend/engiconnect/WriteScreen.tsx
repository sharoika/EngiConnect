import React, { useState } from "react";
import { Text, View, Button, TextInput, TouchableOpacity, ScrollView } from "react-native";

function WriteScreen({ route, navigation }: { route: any, navigation: any }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { type, subject, body } = route.params;

  const [subjectText, setSubjectText] = useState(subject);
  const [bodyText, setBodyText] = useState(body);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePostReply = () => {
    const apiUrl = 'http://localhost:3001/issue';

    const postData = {
      subjectText,
      bodyText,
      type,
    };
    console.log(postData);

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container as any}>
      <Text style={styles.title as any}>{type}</Text>
      <Text style={styles.label as any}>Subject:</Text>
      <TextInput
        style={styles.subjectInput as any}
        value={subjectText}
        onChangeText={(text) => setSubjectText(text)}
        placeholder="Enter subject"
      />

      <Text style={styles.label as any}>Body:</Text>
      <TextInput
        style={styles.bodyInput as any}
        value={bodyText}
        onChangeText={(text) => setBodyText(text)}
        placeholder="Enter body"
        multiline={true}
        numberOfLines={4}
      />

      <View style={styles.buttonContainer as any}>
        <TouchableOpacity style={styles.closeButton as any} onPress={handleGoBack}>
          <Text style={styles.buttonText as any}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton as any} onPress={handlePostReply}>
          <Text style={styles.buttonText as any}>{type === "Post" ? "Post" : "Reply"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "aliceblue",
    paddingTop: 20, 
    paddingBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subjectInput: {
    width: "80%",
    height: "20%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 16,
    backgroundColor: "white",
  },
  bodyInput: {
    width: "80%",
    flex: 0.8,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 16,
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 12,
    margin: 4,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 12,
    margin: 4,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
};

export default WriteScreen;
