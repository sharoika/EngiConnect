import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView } from "react-native";

interface Reply {
  issueId: string;
  userId: string;
  fullName: string;
  replyText: string;
}

function ReadScreen({ route, navigation }: { route: any; navigation: any }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { issueId, userId, fullName } = route.params;
  const [issue, setIssue] = useState<any | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [hasLiked, setHasLiked] = useState(true);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [replies, setReplies] = useState<Reply[]>([]);
  const [likeCount, setLikeCount] = useState(-1);
  const [dislikeCount, setDislikeCount] = useState(-1);

  useEffect(() => {
    const fetchIssueAndReplies = async () => {
      try {
        const [issueResponse, repliesResponse, interactionResponse] = await Promise.all([
          fetch(`http://localhost:3001/issue/${issueId}`),
          fetch(`http://localhost:3001/replies/${issueId}`),
          fetch('http://localhost:3001/interaction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, issueId: issueId, hasRead: true }),
          }),
        ]);
        const [issueData, repliesData, interactionData] = await Promise.all([
          issueResponse.json(),
          repliesResponse.json(),
          interactionResponse.json(),
        ]);
        if (issueResponse.ok && repliesResponse.ok && interactionResponse.ok) {
          setIssue(issueData.issue);
          setHasLiked(interactionData.interaction.hasLiked);
          setHasDisliked(interactionData.interaction.hasDisliked);
          setReplies(repliesData.replies);
        } else {
          console.error('Error fetching issue, replies, or interactions:', issueData.message || repliesData.message || interactionData.interaction);
        }
        setLoaded(true);
      } catch (error) {
        console.error('Error fetching issue, replies, or interactions:', error);
        setLoaded(true);
      }
    };
    fetchIssueAndReplies();
  }, [issueId, userId]);

  const fetchInteractionCounts = async () => {
    try {
      const response = await fetch(`http://localhost:3001/interaction/count/${issueId}`);
      const data = await response.json();
      if (response.ok) {
        setLikeCount(data.likeCount);
        setDislikeCount(data.dislikeCount);
      } else {
        console.error('Error fetching interaction counts:', data.message);
      }
    } catch (error) {
      console.error('Error fetching interaction counts:', error);
    }
  };

  const handleReply = async () => {
    try {
      toggleFavorite(issue._id);
      const response = await fetch('http://localhost:3001/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueId: issue._id,
          userId: userId,
          fullName: fullName,
          replyText: newReply,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const newReplyObject: Reply = {
          issueId: issue._id,
          userId: userId,
          fullName: fullName,
          replyText: newReply,
        };
        setReplies((prevReplies) => [...prevReplies, newReplyObject]);
        setNewReply("");
      } else {
        console.error('Error adding reply:', data.message);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const toggleFavorite = async (issueId: string) => {
    try {
      if (!issue.favouritedUsers.includes(userId)) {
        const response = await fetch(`http://localhost:3001/issue/${issueId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  const handleGoBack = () => {
    navigation.navigate('Main');
  };

  useEffect(() => {
    fetchInteractionCounts();
  }, [hasLiked, !hasLiked, hasDisliked, !hasDisliked, likeCount, dislikeCount]);

  const handleLike = async () => {
    try {
      setHasLiked(!hasLiked);
      setHasDisliked(false);
      const response = await fetch('http://localhost:3001/interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          issueId: issueId,
          hasRead: true,
          hasLiked: !hasLiked,
          hasDisliked: false,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchInteractionCounts();
      } else {
        console.error('Error liking issue:', data.message);
      }
    } catch (error) {
      console.error('Error liking issue:', error);
    }
  };

  const handleDislike = async () => {
    try {
      setHasDisliked(!hasDisliked);
      setHasLiked(false);
      const response = await fetch('http://localhost:3001/interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          issueId: issueId,
          hasRead: true,
          hasLiked: false,
          hasDisliked: !hasDisliked,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchInteractionCounts();
      } else {
        console.error('Error disliking issue:', data.message);
      }
    } catch (error) {
      console.error('Error disliking issue:', error);
    }
  };

  if (!loaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!issue) {
    return (
      <View style={styles.container}>
        <Text>Error loading issue</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ScrollView style={styles.scrollContainerTitle}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center', paddingBottom: "6%" }}>
            {issue.subject}
          </Text>
        </ScrollView>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center', paddingTop: "2%" }}>
          {"By: " + issue.fullName}
        </Text>
        <ScrollView style={styles.scrollContainerBody}>
          <Text style={{ fontSize: 16, textAlign: 'center', textAlignVertical: 'center', paddingBottom: "8%" }}>
            {issue.body}
          </Text>
        </ScrollView>
      </View>
      {Array.isArray(replies) ? (
        <View style={styles.scrollContainerReplies}>
          <FlatList
            data={replies}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.replyContainer}>
                <Text>{item.replyText}</Text>
                <Text numberOfLines={1}>{"By: " + item.fullName}</Text>
              </View>
            )}
          />
        </View>
      ) : (
        <View>
          <Text>No replies available</Text>
        </View>
      )}
      <View style={styles.additionalInfoContainer}>
        <View style={[styles.countContainer, { backgroundColor: 'lightblue' }]}>
          <Text style={styles.countText}>Likes: {likeCount}</Text>
        </View>
        <View style={[styles.countContainer, { backgroundColor: '#FED8B1' }]}>
          <Text style={styles.countText}>Dislikes: {dislikeCount}</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a reply..."
          value={newReply}
          onChangeText={(text) => setNewReply(text)}
        />
        <TouchableOpacity style={styles.addReplyButton} onPress={handleReply}>
          <Text style={styles.buttonText}>Add Reply</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: hasLiked ? 'blue' : 'lightblue' }]} onPress={handleLike}>
          <Text style={styles.buttonText}>{hasLiked ? 'Liked' : 'Like'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: hasDisliked ? 'orange' : "#FED8B1" }]} onPress={handleDislike}>
          <Text style={styles.buttonText}>{hasDisliked ? 'Disliked' : 'Dislike'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: 'red' }]} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "aliceblue",
    width: "100%",
    paddingTop: "20%",
    paddingLeft: "6%",
    paddingRight: "6%",
    paddingBottom: "8%",
  },
  headerContainer: {
    alignItems: "center",
    width: '100%'
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 16,
  },
  likeButton: {
    backgroundColor: 'blue',
    padding: 12,
    margin: 4,
    borderRadius: 5,
    alignItems: 'center',
  },
  dislikeButton: {
    backgroundColor: 'orange',
    padding: 12,
    margin: 4,
    borderRadius: 5,
    alignItems: 'center',
  },
  replyContainer: {
    padding: 2,
    margin: 4,
    width: "98%",
    borderRadius: 5,
    backgroundColor: '#EEEEEE',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    marginRight: 8,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'lightgrey',
  },
  addReplyButton: {
    backgroundColor: 'green',
    padding: 12,
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
  scrollContainerTitle: {
    width: '95%',
    maxHeight: 40,
    padding: '2%',
    margin: '1%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'lightgrey',
    borderRadius: 10,
  },
  scrollContainerBody: {
    width: '95%',
    maxHeight: 250,
    margin: "2%",
    padding: "4%",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: 'lightgrey',
    borderRadius: 10,
  },
  scrollContainerReplies: {
    width: '95%',
    maxHeight: 250,
    margin: "2%",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: 'lightgrey',
    borderRadius: 10,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    bottom: 0,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 12,
    margin: 4,
    borderRadius: 5,
    alignItems: 'center',
  },
  additionalInfoContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  countContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 8,
    margin: 4,
  },
  countText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default ReadScreen;
