import { StyleSheet, Text, View ,TextInput, TouchableOpacity, FlatList, ScrollView} from 'react-native'
import React,{ useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import {ingredientsList} from '../screens/AddRecipeScreen'
import { Checkbox } from 'react-native-paper';

export default function Search({setFilters: setSelectedOptions, filters: selectedOptions, textFilter, setTextFilter}) {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const toggleOption = (option) => {
    const index = selectedOptions.indexOf(option);
    if (index !== -1) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const renderOptionItem = (item,index) => (
    <TouchableOpacity
      key={index}
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}
      onPress={() => toggleOption(item)}
    >
      <Checkbox
        status={selectedOptions.includes(item) ? 'checked' : 'unchecked'}
        color="green"
      />
      {/* <AntDesign
        name={selectedOptions.includes(item) ? 'checkcircle' : 'checkcircleo'}
        size={24}
        color="green"
        style={{ marginRight: 10 }}
      /> */}
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <AntDesign style={styles.iconStyle} size={30} color="black" />
        <TextInput style={styles.inputStyle} placeholder='Ara...' autoCapitalize='none'
          value={textFilter}
          onChangeText={setTextFilter}
        />
        <TouchableOpacity onPress={toggleOptions}>
          <AntDesign style={styles.iconStyle2} name="down" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {showOptions && (
        <View >
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={() => setShowOptions(false)} 
          />
          <ScrollView style={styles.dropdownContainer}>

            {ingredientsList.map((a,index) => {
                return( 
                <View key={index}>
                    {renderOptionItem(a,index)}
                  </View>
                )
              }
            )}
            <View style={{padding: 20}}/>

          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EE4F35',
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCECDA',
    marginHorizontal: 10,
    marginBottom: 10,
    height: 40,
    borderRadius: 7,

  },
  iconStyle: {
    marginHorizontal: 15,
  },
  inputStyle: {
    flex: 1,
    fontSize: 20,
    marginLeft: -10,
  },
  iconStyle2: {
    marginRight: 10,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    padding: 20,
    zIndex: 100,
    overflow: "scroll",
    maxHeight: 300
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButtonText: {
    padding: 10,
    textAlign: 'center',
    backgroundColor: 'lightgray',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    borderRadius: 10,
  },
});
