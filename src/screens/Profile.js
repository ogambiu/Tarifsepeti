import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { firebase, auth, storage } from "../../firebase";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const [userPosts, setUserPosts] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);

      const unsubscribe = firebase
        .firestore()
        .collection("recipes")
        .where("user_email", "==", currentUser.email)
        .onSnapshot((snapshot) => {
          const posts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserPosts(posts);
        });

      return () => unsubscribe();
    }
  }, []);

  firebase
    .firestore()
    .collection("profile-photos")
    .doc(auth.currentUser.uid)
    .get()
    .then((item) => {
      const data = item.data();
      if (data) {
        setImage(data.url);
      }
    });

  const deletePost = (postId) => {
    Alert.alert("Postu Sil", "Bu postu silmek istediğinize emin misiniz?", [
      {
        text: "İptal",
        style: "cancel",
      },
      {
        text: "Sil",
        onPress: () => {
          firebase
            .firestore()
            .collection("recipes")
            .doc(postId)
            .delete()
            .then(() => {
              console.log("Post silindi!");
            })
            .catch((error) => {
              console.error("Hata oluştu:", error);
            });
        },
      },
    ]);
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
      const url = await uploadImageToStorage(result.assets[0].uri);

      await firebase
        .firestore()
        .collection("profile-photos")
        .doc(auth.currentUser.uid)
        .set({
          url,
        });

      alert("Resim başarıyla kaydedildi!");
    }
  };

  const uploadImageToStorage = async (uri) => {
    setUploading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage.ref().child(`pp/${auth.currentUser.uid}`);
    const snapshot = await ref.put(blob);
    const downloadURL = await snapshot.ref.getDownloadURL();
    setUploading(false);
    return downloadURL;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profilim</Text>
      <View style={styles.userInfo}>
        <TouchableOpacity
          onPress={() => {
            handleImageUpload();
          }}
        >
          {image === null ? (
            <Image
              style={{ width: 100, height: 100, borderRadius: 100 }}
              source={{
                uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
              }}
            />
          ) : (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100, borderRadius: 100 }}
            />
          )}
        </TouchableOpacity>

        <Text style={styles.email}>{userEmail}</Text>
      </View>
      <Text style={{ ...styles.header, fontSize: 30 }}>Tariflerim</Text>
      <FlatList
        data={userPosts}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Image source={{ uri: item.image_url }} style={styles.postImage} />
            <TouchableOpacity
              onPress={() => deletePost(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Sil</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FCECDA",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    fontStyle: "",
    fontSize: 60,
    fontWeight: "bold",
    color: "orange",
    marginBottom: 20,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postContainer: {
    marginBottom: 20,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
