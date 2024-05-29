import {
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import LoginStyles from "../styles/LoginStyles";
import { firebase, auth } from "../../firebase";
import { Link, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigation();
  const windowWidth = Dimensions.get("window").width;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const handleLogin = async () => {
    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Kullanıcı verilerini AsyncStorage'a kaydet
      const userData = { email, password }; // Bu örnekte sadece email ve password saklanıyor
      await AsyncStorage.setItem("@user_data", JSON.stringify(userData));
      navigate.reset({
        index: 0,
        routes: [{ name: "App" }],
      });
      console.log("User signed in and data stored:", user);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={LoginStyles.container} behavior="padding">
      <Image
        source={require("../assets/logo.png")}
        style={{
          resizeMode: "contain",
          height: 65,
          marginBottom: 20,
        }}
      />
      <View style={LoginStyles.loginSection}>

        <TextInput
          autoCapitalize="none"
          style={LoginStyles.input}
          placeholder="E-Posta"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          autoCapitalize="none"
          style={LoginStyles.input}
          placeholder="Şifre"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <View style={LoginStyles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} style={LoginStyles.button}>
            <Text style={LoginStyles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
      {!keyboardVisible && (
        <View style={LoginStyles.createSection}>
          <View
            style={{
              flex: 1,
              height: 1,
              width: windowWidth,
              backgroundColor: "white",
              marginBottom: 10,
            }}
          />
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={LoginStyles.outLineButtonText}>Hesabın yok mu?</Text>
              <Link to={{ screen: "SignUp" }}>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                    borderBottomWidth: 0,
                  }}
                >
                  Kaydol
                </Text>
              </Link>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
