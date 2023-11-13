import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import PostReplyComponent from './PostComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Issue {
  _id: string;
  subject: string;
  body: string;
  selectedSDGs: string[];
}

const IssuesComponent = ({ SDGFilter, isLoading, setSDGFilter, setIsLoading }: { SDGFilter: any, isLoading: any, setSDGFilter: any, setIsLoading: any }) => {  
  const [issues, setIssues] = useState<Issue[]>([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  var fullName = "";
  AsyncStorage.getItem('fullName').then(fn => {
    fullName = fn ?? "";
  })

  var userId = " test ";
  AsyncStorage.getItem('userId').then(ui => {
    userId = ui ?? " pain ";
  });

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setIsLoading(true);
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
    navigation.navigate('Read', { issueId, userId, fullName });
  };

  const handleRemoveFilter = () => {
    setSDGFilter(" ");
  };

  const filteredIssues = SDGFilter === " "
    ? issues
    : issues.filter(issue =>
      issue.selectedSDGs.some(sdg => sdg.includes(SDGFilter))
    );

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
      ) : (
        <View>
          {SDGFilter !== " " && (
          <View style={styles.removeFilterContainer}>
            <TouchableOpacity style={styles.removeFilterButton} onPress={handleRemoveFilter}>
              <Text style={styles.removeFilterText}>Remove Filter</Text>
            </TouchableOpacity>
          </View>
        )}
        <ScrollView contentContainerStyle={styles.container}>
          {filteredIssues.length === 0 ? (
            <Text style={styles.noIssuesText}>No issues match your search.</Text>
          ) : (
            filteredIssues.map((issue, index) => (
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
            ))
          )}
        </ScrollView>
        </View>
      )}
      <PostReplyComponent type="Post" navigation={navigation} isLoading={isLoading} setIsLoading={setIsLoading}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  removeFilterContainer: {
    marginTop: 12,
    alignItems: 'center'
  },
  removeFilterButton: {
    borderRadius: 5,
    padding: 6,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: "lightblue",
  },
  removeFilterText: {
    color: 'white',
    fontSize: 24,
  },
  noIssuesText: {
    textAlign: 'center',
    marginTop: 20,
    padding: 12,
    paddingLeft: 24,
    paddingRight: 24,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default IssuesComponent;
