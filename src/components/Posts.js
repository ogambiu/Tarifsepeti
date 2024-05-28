import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { firebase, auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';

export default function Posts({ filters, textFilter }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, [filters, textFilter]);

  const fetchRecipes = async () => {
    try {
      const querySnapshot = await firebase.firestore().collection('recipes').get();
      let recipeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      //console.log('Fetched recipes');

      if (textFilter.length > 0  || filters.length > 0) {
        let result = recipeList

        if (textFilter.length > 0) {
          result = recipeList.filter((item) => {          
            const regex = new RegExp(textFilter, "i");

            return regex.test(item.title)
          })
        }

        if (filters.length > 0) {
          function filterAlgotihm(item) {

            let s = false
            item.ingredients.forEach(element => {
              if (filters.includes(element)) {
                s = true
              }
            });

            return s
          }

          result = result.filter((item) => filterAlgotihm(item))
        }

        setRecipes(result)
        return
      }

      setRecipes(recipeList);
    } catch (error) {
      console.error('Error fetching recipes: ', error);
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchRecipes().then(() => setRefreshing(false))
  };

  return (<>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        
        {recipes.map((item, index) => {
          return <Lel item={item} key={index}/>      
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    zIndex: -20
  },
});
 

function Lel({item}) {
  const [image, setImage] = useState(null)
  const navigation = useNavigation();

  useEffect(() => {
    firebase.firestore().collection('profile-photos')
      .doc(item.user_id)
      .get()
      .then((aa) => {
        const data = aa.data()
        if (data) {
          setImage(data.url)
        } else {
          setImage(null)
        }
      })})
  
  const handlePostDetail = (item) => {
    navigation.navigate("PostDetails", { item: item });
  };

  return <>
    <TouchableOpacity style={styles.touchable} onPress={() => handlePostDetail(item)} key={item.id}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: 'black', backgroundColor: '#FCECDA', width: "100%"}}>
          <View>
          {image === null ? 
            <Image style={{width:50,height:50,borderRadius:100, resizeMode: 'cover'}} source={ {uri:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} }/> : 
            <Image source={{ uri: image }} style={{width:50,height:50,borderRadius:100, resizeMode: 'cover'}}/>}
            <Text>{item.user_email}</Text>
          </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
            <Image style={{ height: 250, width: "full", resizeMode: 'cover' }} source={{ uri: item.image_url }} />
          </View>
        </TouchableOpacity>
      </>
}