import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import PostReplyComponent from './PostComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatComponent from './ChatComponent';

interface Issue {
  _id: string;
  subject: string;
  body: string;
  selectedSDGs: string[];
  createdDate: number,
  userId: string;
  fullName: string;
  FavouritedUsers: string[];
}

const IssuesComponent = ({
  SDGFilter,
  isLoading,
  setSDGFilter,
  setIsLoading,
  userId,
  fullName,
}: {
  SDGFilter: any;
  isLoading: any;
  setSDGFilter: any;
  setIsLoading: any;
  userId: any;
  fullName: any;
}) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [favoritedIssues, setFavoritedIssues] = useState<string[]>([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        console.log("hithere");
        setIsLoading(true);
        const response = await fetch('http://localhost:3001/issues');
        if (response.ok) {
          const data = await response.json();
          const initialFavoritedIssues = data.issues
            .filter((issue: { favouritedUsers: string | string[]; }) => issue.favouritedUsers.includes(userId))
            .map((issue: { _id: any; }) => issue._id);
          setFavoritedIssues(initialFavoritedIssues);
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

  const toggleFavorite = async (issueId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/issue/${issueId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (favoritedIssues.includes(issueId)) {
          setFavoritedIssues((prevFavoritedIssues) =>
            prevFavoritedIssues.filter((favIssueId) => favIssueId !== issueId)
          );
        } else {
          setFavoritedIssues((prevFavoritedIssues) => [...prevFavoritedIssues, issueId]);
        }
      } else {
        console.error('Error toggling favorite status:', response.status);
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  const sortedIssues = issues.sort((a, b) => {
    const aFavorited = favoritedIssues.includes(a._id);
    const bFavorited = favoritedIssues.includes(b._id);

    if (aFavorited && !bFavorited) {
      return -1;
    } else if (!aFavorited && bFavorited) {
      return 1;
    } else {
      return b.createdDate - a.createdDate;
    }
  });

  const handleRemoveFilter = () => {
    setSDGFilter(' ');
  };

  const filteredIssues =
    SDGFilter === ' '
      ? sortedIssues
      : sortedIssues.filter((issue) =>
        issue.selectedSDGs.some((sdg) => sdg.includes(SDGFilter))
      );

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
      ) : (
        <View>
          {SDGFilter !== ' ' && (
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
                  style={!favoritedIssues.includes(issue._id) ? styles.issueBox : styles.issueBoxFavourited}
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
                  <TouchableOpacity onPress={() => toggleFavorite(issue._id)}>
                    <Text style={styles.favoritedButton}>
                      {favoritedIssues.includes(issue._id) ? 'Unfavorite' : 'Favorite'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}
      <PostReplyComponent type="Post" navigation={navigation} isLoading={isLoading} setIsLoading={setIsLoading} />
      <ChatComponent navigation={navigation} isLoading={isLoading} setIsLoading={setIsLoading} userId={userId} fullName={fullName} />
    </View>
  );
};

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
  issueBoxFavourited: {
    flexBasis: '96%',
    padding: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    backgroundColor: 'lightblue',
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
  favoritedButton: {
    color: 'blue',
    marginTop: 8,
  },
});

export default IssuesComponent;
