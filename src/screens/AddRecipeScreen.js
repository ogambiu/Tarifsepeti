import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Checkbox } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { firebase, storage, auth } from "../../firebase";
import { ingredientsList } from "../ingredientData/ingredientsList";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const handleSaveRecipe = async (
  title,
  ingredients,
  description,
  image,
  setTitle,
  setIngredients,
  setDescription,
  setImage,
  setUploading
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Lütfen tarifi kaydetmeden önce girişi yapınız");
      return;
    }

    setUploading(true);

    let imageURL = "";
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

    await firebase.firestore().collection("recipes").add(recipeData);
    alert("Tarif başarıyla kaydedildi!");
    setTitle("");
    setIngredients([]);
    setDescription("");
    setImage(null);
  } catch (error) {
    console.error("Tarif kaydedilirken bir hata oluştu: ", error);
    alert("Tarif kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
  } finally {
    setUploading(false);
  }
};

export const uploadImageToStorage = async (uri, setUploading) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = storage
    .ref()
    .child(`images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const snapshot = await ref.put(blob);
  const downloadURL = await snapshot.ref.getDownloadURL();
  return downloadURL;
};

const AddRecipeScreen = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation();

  const handleCheckboxChange = (ingredient, checked) => {
    if (checked) {
      setIngredients([...ingredients, ingredient]);
    } else {
      setIngredients(ingredients.filter((item) => item !== ingredient));
    }
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Galeriye erişim izni gerekiyor!");
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

  const validateAndSaveRecipe = () => {
    if (!title || !description || ingredients.length === 0 || !image) {
      Alert.alert("Eksik Bilgi", "Lütfen tüm alanları doldurun.");
      return;
    }

    handleSaveRecipe(
      title,
      ingredients,
      description,
      image,
      setTitle,
      setIngredients,
      setDescription,
      setImage,
      setUploading
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handleImageUpload} style={{ marginRight: 20 }}>
            <MaterialCommunityIcons name="image-plus" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={validateAndSaveRecipe}>
            <MaterialCommunityIcons name="check-bold" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, title, ingredients, description, image]);

  const filteredIngredients = ingredientsList.filter((ingredient) =>
    ingredient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {uploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFA726" />
        </View>
      )}
      <TextInput
        style={[styles.input, styles.textInput]}
        placeholder="Tarif Başlığı"
        placeholderTextColor="#3c3c3c"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textInput, { height: 100 }]}
        placeholder="Açıklama"
        placeholderTextColor="#3c3c3c"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.imageContainer}>
        {image ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <MaterialCommunityIcons name="close-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxTitle}>Malzemeler</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.inputSearch, styles.textInput, styles.searchInput]}
            placeholder="Malzeme Ara"
            placeholderTextColor="#3c3c3c"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <MaterialCommunityIcons name="close" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView style={styles.checkboxScroll} nestedScrollEnabled={true}>
          {filteredIngredients.map((ingredient, index) => (
            <View key={index} style={styles.checkboxRow}>
              <Checkbox
                status={ingredients.includes(ingredient) ? "checked" : "unchecked"}
                onPress={() => handleCheckboxChange(ingredient, !ingredients.includes(ingredient))}
                color="white"
              />
              <Text style={styles.checkboxLabel}>{ingredient}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#EE4F35",
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#3c3c3c",
    borderRadius: 5,
    backgroundColor: "#FCECDA",
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    color: "#000",
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkboxScroll: {
    borderWidth: 1,
    backgroundColor:"#FCECDA",
    borderColor: "#3c3c3c",
    borderRadius: 5,
    maxHeight: 400,
  },
  checkboxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop:-10,
    marginBottom: 20,
    color: "#FCECDA",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10,
  },
  checkboxLabel: {
    color: "#3c3c3c",
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 344,
    height: 240,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3c3c3c",
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
  },
  button: {
    backgroundColor: "#FFA726",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerButton: {
    color: "#fff",
    marginRight: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3c3c3c",
    borderRadius: 5,
    backgroundColor: "#FCECDA",
    padding: 5,
    marginBottom: 20,
    paddingVertical: 1,
    marginVertical: 1,
  },
  searchInput: {
    flex: 1,
    paddingRight: 10,
  },
  clearButton: {
    position: "absolute",
    right: 10,
  },
  inputSearch: {
    borderWidth: 0,
    borderColor: "#3c3c3c",
    borderRadius: 5,
    backgroundColor: "#FCECDA",
    padding: 10,
    marginBottom: 0,
  },
});

export default AddRecipeScreen;
