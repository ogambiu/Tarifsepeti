import React,{useEffect,useState} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { firebase, auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';

export default function PostDetails({ route }) {
  const { item, ingredients } = route.params;
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

  return (
    <ScrollView style={{flex:1,backgroundColor: '#FCECDA',}}>
     <View style={styles.container}> 
      
      <View style={styles.profileContainer}>
        {image === null ? 
          <Image style={styles.profileImage} source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }} /> : 
          <Image source={{ uri: image }} style={styles.profileImage} />
        }
        <Text style={styles.user}>{item.user_email}</Text>
      </View>


      <Text style={styles.title}>{item.title}</Text>


      <Image style={styles.image} source={{ uri: item.image_url }} />


      <Text style={styles.description}>{item.description}</Text>


      <View style={styles.ingredientsContainer}>
        <Text style={styles.ingredientsTitle}>Malzemeler</Text>
          <View style={styles.ingredientsWrapper}>
            {item.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredient}>{ingredient}</Text>
            ))}
          </View>
      </View>
      </View> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop:10,
    padding: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description:{
    fontSize:18
  },
  user: {
    fontWeight:'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 16,
    borderRadius:20
  },
  ingredientsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'red',
    paddingTop: 16,
    width: '100%',
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  ingredientsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ingredient: {
    fontSize: 16,
    fontWeight:'500',
    padding:5,
    marginHorizontal:"auto",
    marginBottom: 4,
    textAlign: 'center',
    borderWidth:2,
    borderRadius:10,
  },
});
