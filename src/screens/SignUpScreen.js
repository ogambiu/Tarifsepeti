import {
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Keyboard, // Import Keyboard API
} from "react-native";
import React, { useState, useEffect } from "react";
import SignUpStyles from "../styles/SignUpStyles";
import { auth } from "../../firebase";
import { Link, useNavigation } from "@react-navigation/native";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false); // State to track keyboard visibility
  const navigation = useNavigation();
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

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert(
        "Şifreler Eşleşmiyor",
        "Girilen şifreler eşleşmiyor. Lütfen tekrar deneyin.",
        [{ text: "Tamam", onPress: () => console.log("OK Pressed") }]
      );
      return;
    }

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("User", user.email);
        Alert.alert(
          "Kayıt Başarılı",
          "Başarılı bir biçimde kaydoldunuz.",
          [{ text: "Tamam", onPress: () => console.log("OK Pressed") }]
        );
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={SignUpStyles.container} behavior="padding">
      <Image
        source={require("../assets/logo.png")}
        style={{
          resizeMode: "contain",
          height: 65,
          marginBottom: 20,
        }}
      />
      <View style={SignUpStyles.SignUpSection}>
        <TextInput
          style={SignUpStyles.input}
          placeholder="E-Posta"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={SignUpStyles.input}
          placeholder="Şifre"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TextInput
          style={SignUpStyles.input}
          placeholder="Şifrenizi Onaylayın"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />

        <View style={SignUpStyles.buttonContainer}>
          <TouchableOpacity onPress={handleSignUp} style={SignUpStyles.button}>
            <Text style={SignUpStyles.buttonText}>Kaydol</Text>
          </TouchableOpacity>
        </View>
      </View>
      {!isKeyboardVisible && ( // Hide this section when keyboard is visible
        <View style={SignUpStyles.createSection}>
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
              <Text style={SignUpStyles.outLineButtonText}>Zaten Üye Misin?</Text>
              <Link to={{ screen: "Login" }}>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                    borderBottomWidth: 0,
                  }}
                >
                  Giriş Yap
                </Text>
              </Link>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
