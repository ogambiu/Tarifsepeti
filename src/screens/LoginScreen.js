import {
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import LoginStyles from "../styles/LoginStyles";
import { auth } from "../../firebase";
import { CommonActions, Link, useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigation();
  const windowWidth = Dimensions.get("window").width;

  const handleLogin = async () => {
    try {
      const userCredentials = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredentials.user;
      navigate.reset({
        index: 0,
        routes: [{ name: "App" }],
      })
      console.log("User", user.email, "logged in");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleTest = () => {
    const userTestInfo= auth.currentUser;
    console.log(userTestInfo);
  }

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
          style={LoginStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={LoginStyles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <View style={LoginStyles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} style={LoginStyles.button}>
            <Text style={LoginStyles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTest}>
            <Text>UserTest</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    </KeyboardAvoidingView>
  );
}
