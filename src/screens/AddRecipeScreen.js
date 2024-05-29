import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Checkbox } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { firebase, storage, auth } from "../../firebase";
import { ingredientsList } from "../ingredientData/ingredientsList";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Helper function
export const handleSaveRecipe = async (title, ingredients, description, image, setTitle, setIngredients, setDescription, setImage, setUploading) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert('Lütfen tarifi kaydetmeden önce girişi yapınız');
      return;
    }

    let imageURL = '';
    if (image) {
      imageURL = await uploadImageToStorage(image, setUploading);
    }

    const recipeData = {
      title,
      ingredients,
      description,
      image_url: imageURL,
      user_email: user.email,
      user_id: user.uid,
    };
    console.log("Ekle");
    await firebase.firestore().collection('recipes').add(recipeData);
    alert('Tarif başarıyla kaydedildi!');
    setTitle('');
    setIngredients([]);
    setDescription('');
    setImage(null);
  } catch (error) {
    console.error('Tarif kaydedilirken bir hata oluştu: ', error);
    alert('Tarif kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
  }
};

// Image upload function
export const uploadImageToStorage = async (uri, setUploading) => {
  setUploading(true);
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = storage.ref().child(`images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const snapshot = await ref.put(blob);
  const downloadURL = await snapshot.ref.getDownloadURL();
  setUploading(false);
  return downloadURL;
};



const AddRecipeScreen = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const navigation = useNavigation();

  const handleCheckboxChange = (ingredient, checked) => {
    if (checked) {
      setIngredients([...ingredients, ingredient]);
    } else {
      setIngredients(ingredients.filter(item => item !== ingredient));
    }
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Galeriye erişim izni gerekiyor!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Set up the header button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => handleSaveRecipe(
            title, 
            ingredients, 
            description, 
            image, 
            setTitle, 
            setIngredients, 
            setDescription, 
            setImage, 
            setUploading
          )}
          style= {{marginRight: 10}}
        >
          <MaterialCommunityIcons name="check-bold" size={24} color="white"/>
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, ingredients, description, image]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tarif Başlığı"
        placeholderTextColor="#fff"
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Açıklama"
        placeholderTextColor="#fff"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxTitle}>Malzemeler</Text>
        <ScrollView style={styles.checkboxScroll} nestedScrollEnabled={true}>
          {ingredientsList.map((ingredient, index) => (
            <View 
              key={index}
              style={styles.checkboxRow}>
              <Checkbox
                status={ingredients.includes(ingredient) ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(ingredient, !ingredients.includes(ingredient))}
                color="white"
              />
              <Text style={styles.checkboxLabel}>{ingredient}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.imageContainer}>
        {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
        <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
          <Text style={styles.buttonText}>Resim Seç</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#EE4F35',
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: '#fff',
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkboxScroll: {
    maxHeight: 300,
  },
  checkboxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    color: '#fff',
    marginLeft: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFA726',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerButton: {
    color: '#fff',
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddRecipeScreen;