import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const SDGComponent = ({ selectedOption, setIsLoading, setSDGFilter }: { selectedOption: any, setIsLoading: any, setSDGFilter: any }) => {
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

  const handleSDGSelect = ( {selectedSDG}: {selectedSDG: string}) => {
    setSDGFilter(selectedSDG);
    setIsLoading(true);
    selectedOption("Issues");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {sdgs.map((sdg, index) => (
        <TouchableOpacity
          key={index}
          style={styles.sdgButton}
          onPress={() => handleSDGSelect({ selectedSDG: sdg })}
        >
          <Text style={styles.sdgText}>{sdg}</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
  },
  sdgButton: {
    flexBasis: '96%',
    padding: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    backgroundColor: 'aliceblue',
  },
  sdgText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SDGComponent;
