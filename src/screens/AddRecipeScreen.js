import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollViewBase,
  KeyboardAvoidingViewBase,
  KeyboardAvoidingView,
} from "react-native";
import { Checkbox } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { firebase, storage, auth } from "../../firebase";
import { KeyboardAwareListView, KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

export const ingredientsList = [
  "Yumurta",
  "Soğan",
  "Biber",
  "Domates",
  "Patlıcan",
  "Peynir",
  "Kaşar Peyniri",
  "Eski Kaşar",
  "Mantar",
  "Kabak",
  "Ispanak",
  "Brokoli",
  "Karnabahar",
  "Marul",
  "Salatalık",
  "Havuç",
  "Lahana",
  "Kereviz",
  "Maydanoz",
  "Dereotu",
  "Nane",
  "Biberiye",
  "Kekik",
  "Zeytin",
  "Yeşil Zeytin",
  "Siyah Zeytin",
  "Avokado",
  "Turp",
  "Pancar",
  "Kuşkonmaz",
  "Enginar",
  "Bezelye",
  "Bakla",
  "Börülce",
  "Kuru Fasulye",
  "Nohut",
  "Mercimek",
  "Pirinç",
  "Bulgur",
  "Tavuk",
  "Et",
  "Balık",
  "Süt",
  "Yoğurt",
  "Tereyağı",
  "Zeytinyağı",
  "Un",
  "Şeker",
  "Tuz",
  "Karabiber",
  "Pul biber",
  "Kimyon",
  "Tarçın",
  "Zencefil",
  "Sarımsak",
  "Limon",
  "Portakal",
  "Elma",
  "Muz",
  "Çilek",
  "Ahududu",
  "Böğürtlen",
  "Kiraz",
  "Üzüm",
  "Mayonez",
  "Ketçap",
  "Hardal",
  "Sirke",
  "Bal",
  "Reçel",
  "Fıstık Ezmesi",
  "Ceviz",
  "Fındık",
  "Badem",
  "Kaju",
  "Kabak Çekirdeği",
  "Ayçiçeği Çekirdeği",
  "Keten Tohumu",
  "Chia Tohumu",
  "Yulaf",
  "Mısır",
  "Bezelye",
  "Yaban Mersini",
  "Ananas",
  "Mango",
  "Kivi",
  "Şeftali",
  "Erik",
  "Kayısı",
  "Nar",
  "Hurma",
  "Kurutulmuş Üzüm",
  "Kuru Kayısı",
  "Kuru İncir",
  "Kuru Erik",
  "Kuru Üzüm",
];

export const handleSaveRecipe = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Lütfen tarifi kaydetmeden önce girişi yapınız");
      return;
    }

    let imageURL = "";
    if (image) {
      imageURL = await uploadImageToStorage(image);
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
  }
};

const AddRecipeScreen = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const uploadImageToStorage = async (uri) => {
    setUploading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage
      .ref()
      .child(`images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    const snapshot = await ref.put(blob);
    const downloadURL = await snapshot.ref.getDownloadURL();
    setUploading(false);
    return downloadURL;
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
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
      <View style={styles.imageContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
          <Text style={styles.buttonText}>Resim Seç</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={ingredientsList}
        renderItem={({ item }) => (
          <View style={styles.checkboxRow}>
            <Checkbox
              status={ingredients.includes(item) ? "checked" : "unchecked"}
              onPress={() =>
                handleCheckboxChange(item, !ingredients.includes(item))
              }
              color="white"
            />
            <Text style={styles.checkboxLabel}>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.checkboxContainer}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#EE4F35",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: "#fff",
    backgroundColor: "#FF6F61", // Adjusted background color for inputs
  },
  checkboxContainer: {
    padding: 10,
    
    maxHeight: 250,
    marginBottom: 1,
    backgroundColor: "#FF6F61", // Adjusted background color for checkbox container
    borderRadius: 5,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
    padding: 10,
    backgroundColor: "#FF6F61", // Background color for each row
    borderRadius: 5,
  },
  checkboxLabel: {
    color: "#fff",
    marginLeft: 5,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10, // Rounded corners for the image
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
  listContainer: {
    paddingHorizontal: 50,
    backgroundColor: "#EE4F35",
    alignItems: "center", // Center the list items
    flexGrow: 1,
  },
});

export default AddRecipeScreen;
