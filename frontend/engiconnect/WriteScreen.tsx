import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Modal, FlatList } from "react-native";

function WriteScreen({ route, navigation }: { route: any, navigation: any }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { setIsLoading } = route.params;

  const [subjectText, setSubjectText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSDGs, setSelectedSDGs] = useState<string[]>([]);

  var userId = "";
  AsyncStorage.getItem('userId').then(ui => {
    userId = ui ?? "";
  });
  
  var fullName = "";
  AsyncStorage.getItem('fullName').then(fn => {
    fullName = fn ?? "";
  })

  const sdgs = [
    'SDG 1: No Poverty',
    'SDG 2: Zero Hunger',
    'SDG 3: Good Health and Well-being',
    'SDG 4: Quality Education',
    'SDG 5: Gender Equality',
    'SDG 6: Clean Water and Sanitation',
    'SDG 7: Affordable and Clean Energy',
    'SDG 8: Decent Work and Economic Growth',
    'SDG 9: Industry, Innovation, and Infrastructure',
    'SDG 10: Reduced Inequality',
    'SDG 11: Sustainable Cities and Communities',
    'SDG 12: Responsible Consumption and Production',
    'SDG 13: Climate Action',
    'SDG 14: Life Below Water',
    'SDG 15: Life on Land',
    'SDG 16: Peace, Justice, and Strong Institutions',
    'SDG 17: Partnerships for the Goals',
  ];

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSelectSDG = (item: string) => {
    const updatedSDGs = [...selectedSDGs];

    if (updatedSDGs.includes(item)) {
      updatedSDGs.splice(updatedSDGs.indexOf(item), 1);
    } else {
      if (updatedSDGs.length < 2) {
        updatedSDGs.push(item);
      } else {
        updatedSDGs.shift();
        updatedSDGs.push(item);
      }
    }

    setSelectedSDGs(updatedSDGs);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePostReply = () => {
    const apiUrl = 'http://localhost:3001/issue';

    const postData = {
      subjectText,
      bodyText,
      selectedSDGs,
      userId,
      fullName,
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        const issueId = data._id;
        navigation.navigate('Read', { issueId, setIsLoading });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container as any}>
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

      <Text style={styles.label as any}>Select SDGs:</Text>
      <TouchableOpacity style={styles.dropdownButton as any} onPress={toggleModal}>
        {selectedSDGs.length > 0 ? (
          selectedSDGs.map((sdg, index) => (
            <Text key={index}>{sdg}</Text>
          ))
        ) : (
          <Text>Select SDGs...</Text>
        )}
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer as any}>
          <FlatList
            data={sdgs}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem as any,
                  selectedSDGs.includes(item) && { backgroundColor: 'lightblue' },
                ]}
                onPress={() => handleSelectSDG(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalCloseButton as any} onPress={toggleModal}>
            <Text style={styles.buttonText as any}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.buttonContainer as any}>
        <TouchableOpacity style={styles.closeButton as any} onPress={handleGoBack}>
          <Text style={styles.buttonText as any}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton as any} onPress={handlePostReply}>
          <Text style={styles.buttonText as any}>{"Post"}</Text>
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
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 16,
    backgroundColor: "white",
  },
  bodyInput: {
    width: "80%",
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 16,
    backgroundColor: "white",
  },
  dropdownButton: {
    width: "80%",
    minHeight: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 16,
    justifyContent: 'center',
    backgroundColor: "white",
  },
  modalContainer: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '100%',
    alignItems: 'center',
  },
  modalCloseButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
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
