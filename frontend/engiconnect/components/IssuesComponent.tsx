import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const IssuesComponent = ({ type }: { type: any }) => {
  // Sample list of issues, you can replace this with your data source
  const issues = [
    {
      title: 'Issue 1',
      description: 'Description of Issue 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      sdgs: [1, 2],
    },
    {
      title: 'Issue 2',
      description: 'Description of Issue 2. Pellentesque ac libero vel libero vehicula vehicula.',
      sdgs: [3, 4],
    },
    {
      title: 'Issue 3',
      description: 'Description of Issue 3. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      sdgs: [5, 6],
    },
    {
      title: 'Issue 4',
      description: 'Description of Issue 4. Fusce consectetur semper ex, nec feugiat lectus accumsan a.',
      sdgs: [7, 8],
    },
    {
      title: 'Issue 5',
      description: 'Description of Issue 5. Aenean vel varius nisl. Vivamus placerat bibendum odio, eget condimentum metus volutpat a.',
      sdgs: [9, 10],
    },
    {
      title: 'Issue 6',
      description: 'Description of Issue 6. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.',
      sdgs: [11, 12],
    },
    {
      title: 'Issue 7',
      description: 'Description of Issue 7. Proin eu justo nec neque bibendum congue. Nullam id ex vel libero interdum dapibus.',
      sdgs: [13, 14],
    },
    {
      title: 'Issue 8',
      description: 'Description of Issue 8. Suspendisse potenti. Sed eget massa in sapien egestas scelerisque.',
      sdgs: [15, 16],
    },
    {
      title: 'Issue 9',
      description: 'Description of Issue 9. Aliquam erat volutpat. Vestibulum sit amet sem ut tellus tempor lacinia.',
      sdgs: [17, 18],
    },
    {
      title: 'Issue 10',
      description: 'Description of Issue 10. Phasellus posuere bibendum nunc, ac tincidunt metus gravida at.',
      sdgs: [19, 20],
    },
    {
      title: 'Issue 11',
      description: 'Description of Issue 11. Nulla facilisi. Nam ac neque at mi auctor pellentesque ac in metus.',
      sdgs: [21, 22],
    },
    {
      title: 'Issue 12',
      description: 'Description of Issue 12. Cras euismod, nisi at interdum tristique, metus nisl varius justo.',
      sdgs: [23, 24],
    },
    {
      title: 'Issue 13',
      description: 'Description of Issue 13. Nunc nec ex at purus auctor cursus vel ut mauris.',
      sdgs: [25, 26],
    },
    {
      title: 'Issue 14',
      description: 'Description of Issue 14. Vestibulum vel sapien nec nisl euismod consectetur.',
      sdgs: [27, 28],
    },
    {
      title: 'Issue 15',
      description: 'Description of Issue 15. Sed auctor semper sapien vel bibendum.',
      sdgs: [29, 30],
    },
  ];

  // Crop text at 150 characters
  const cropText = (text) => {
    if (text.length > 100) {
      return text.substring(0, 100) + '...';
    }
    return text;
  };

  // Filter issues based on the selected type
  const filteredIssues = type === 'Top' ? issues : issues.filter(issue => issue.sdgs.includes(type));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {filteredIssues.map((issue, index) => (
        <View key={index} style={styles.issueBox}>
          <Text style={styles.issueTitle}>{issue.title}</Text>
          <Text style={styles.issueDescription} numberOfLines={3}>{cropText(issue.description)}</Text>
          <View style={styles.sdgsContainer}>
            {issue.sdgs.map((sdg, sdgIndex) => (
              <Text key={sdgIndex} style={styles.sdg}>{`SDG ${sdg}`}</Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    flexGrow: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Stretch to reach both sides
  },
  issueBox: {
    flexBasis: '96%', // Adjust as needed to control the width of the boxes
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
    flexDirection: 'row', // Display SDGs horizontally
    marginTop: 8,
  },
  sdg: {
    backgroundColor: 'lightblue',
    padding: 4,
    marginRight: 8,
    marginBottom: 6,
    borderRadius: 4,
    minWidth: 75, // Fixed width for SDG
    maxWidth: 50, // Fixed width for SDG
    maxHeight: 24, 
    textAlign: 'center', // Center text horizontally
    overflow: 'hidden', // Crop text that exceeds the available space
  },
});

export default IssuesComponent;
