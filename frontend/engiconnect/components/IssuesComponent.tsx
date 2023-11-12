import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

interface Issue {
  _id: string;
  subject: string;
  body: string;
  selectedSDGs: string[];
}

const IssuesComponent = ({ isLoading, setIsLoading}: { isLoading: any, setIsLoading: any }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('http://localhost:3001/issues');
        if (response.ok) {
          const data = await response.json();
          setIssues(data.issues);
        } else {
          console.error('Error fetching issues:', response.status);
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, [isFocused]);

  const cropText = (text: string) => {
    if (text.length > 100) {
      return text.substring(0, 100) + '...';
    }
    return text;
  };

  const navigateToReadScreen = (issueId: string) => {
    console.log(issueId);
    navigation.navigate('Read', { issueId } );
  };

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {issues.map((issue, index) => (
            <TouchableOpacity
              key={index}
              style={styles.issueBox}
              onPress={() => navigateToReadScreen(issue._id)}
            >
              <Text style={styles.issueTitle}>{issue.subject}</Text>
              <Text style={styles.issueDescription} numberOfLines={3}>
                {cropText(issue.body)}
              </Text>
              <View style={styles.sdgsContainer}>
                {issue.selectedSDGs.map((sdg, sdgIndex) => (
                  <Text key={sdgIndex} style={styles.sdg}>
                    {sdg}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    flexGrow: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  issueBox: {
    flexBasis: '96%',
    padding: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    backgroundColor: 'aliceblue',
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  issueDescription: {
    marginTop: 8,
  },
  sdgsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 8,
  },
  sdg: {
    backgroundColor: 'lightblue',
    padding: 4,
    marginRight: 8,
    marginBottom: 6,
    borderRadius: 4,
    minWidth: 75,
    maxWidth: 400,
    maxHeight: 24,
    textAlign: 'center',
    overflow: 'hidden',
  },
  loadingIndicator: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IssuesComponent;
