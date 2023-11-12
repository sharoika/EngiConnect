import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";

function ReadScreen({ route, navigation }: { route: any; navigation: any }) {
  const { issueId, setIsLoading } = route.params;
  const [issue, setIssue] = useState<any | null>(null);
  const [loaded, setLoaded] = useState(false);

  console.log(issueId);

  useEffect(() => {
    // setIsLoading(true);
    const fetchIssue = async () => {
      try {
        const response = await fetch(`http://localhost:3001/issue/${issueId}`);
        const data = await response.json();

        if (response.ok) {
          setIssue(data.issue);
        } else {
          console.error('Error fetching issue:', data.message);
        }

        setLoaded(true);
      } catch (error) {
        console.error('Error fetching issue:', error);
        setLoaded(true);
      }
    };

    fetchIssue();
  }, [issueId]);

  const handleReply = () => {
    // Implement the logic for handling the reply button press
    // For example, navigate to the WriteScreen with the necessary parameters
    navigation.navigate('WriteScreen', {
      type: 'Reply',
      subject: issue?.subject,
      body: issue?.body,
    });
  };

  const handleGoBack = () => {
    setIsLoading(true);
    navigation.navigate('Main');
  };

  if (!loaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!issue) {
    return (
      <View>
        <Text>Error loading issue</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{issue.subject}</Text>
      <Text style={styles.body}>{issue.body}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.replyButton} onPress={handleReply}>
          <Text style={styles.buttonText}>Reply</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
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
  body: {
    fontSize: 18,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "80%",
    marginBottom: 16,
  },
  replyButton: {
    backgroundColor: 'green',
    padding: 12,
    margin: 4,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 12,
    margin: 4,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
};

export default ReadScreen;
