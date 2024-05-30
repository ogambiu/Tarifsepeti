import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { firebase, auth, storage } from "../../firebase";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const windowWidth = Dimensions.get("window").width;
  const [userPosts, setUserPosts] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  const fetchUsername = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      const doc = await firebase
        .firestore()
        .collection("usernames")
        .doc(userId)
        .get();
      const data = doc.data();
      if (data && data.username) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

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

  useEffect(() => {
    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const userId = auth.currentUser.uid;
        const doc = await firebase
          .firestore()
          .collection("profile-photos")
          .doc(userId)
          .get();
        const data = doc.data();
        if (data && data.url) {
          setImage(data.url);
        }
      } catch (error) {
        console.error("Error fetching profile photo:", error);
      }
    };
    fetchProfilePhoto();
  }, []);

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

  const handlePostDetail = (item) => {
    navigation.navigate("PostDetails", { item: item });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={handleImageUpload}>
            <Image
              style={styles.profileImage}
              source={{
                uri:
                  image ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
              }}
            />
          </TouchableOpacity>
          <View style={styles.userDetails}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{userEmail}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#EE4F35",
            marginLeft: -20,
            marginRight: -20,
            paddingVertical: 10,
            marginBottom: -10,
            elevation: 10,
          }}
        >
          {/* <View style={styles.separator} /> */}
          <Text style={styles.subHeader}>Tariflerim</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={userPosts}
        renderItem={({ item }) => (
          <TouchableOpacity
        activeOpacity={0.7}
        style={styles.touchable}
        onPress={() => handlePostDetail(item)}
        key={item.id}
      >
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
      </TouchableOpacity>
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
  },
  headerContainer: {
    backgroundColor: "#EE4F35",
    paddingLeft: 10,
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 10,
    elevation: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  userDetails: {
    marginLeft: 10,
  },
  username: {
    fontSize: 30,
    fontWeight: "bold",
  },
  email: {
    fontSize: 12,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "white",
    marginVertical: 0,
    marginRight: -10,
    marginLeft: -10,
  },
  subHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FCECDA",
    textAlign: "center",
  },
  postContainer: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: "#EE4F35",
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
