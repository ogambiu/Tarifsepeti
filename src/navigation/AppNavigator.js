import React, { useEffect, useState } from "react";
import { Alert, Image, TouchableOpacity, TurboModuleRegistry, View } from "react-native";
import MainScreen from "../screens/MainScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import AddRecipeScreen, { handleSaveRecipe } from "../screens/AddRecipeScreen";
import PostDetails from "../components/PostDetails";
import Profile from "../screens/Profile";
import { firebase } from "../../firebase";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function LogoTitle() {
  return (
    <Image
      style={{ width: 150, height: 50, resizeMode: "contain" }}
      source={require("../assets/logo.png")}
    />
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={({ navigation, route }) => ({
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: { backgroundColor: "#EE4F35" },
          headerShadowVisible: true,
          headerBackVisible: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.setParams({ toggleSearch: true })}
              style={{ marginRight: 10 }}
            >
              <FontAwesome
                name={route.params?.isSearchVisible ? "close" : "search"}
                size={25}
                color={"#FFF"}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="PostDetails"
        component={PostDetails}
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: { backgroundColor: "#EE4F35" },
          headerShadowVisible: true,
          headerBackVisible: true,
        }}
      />
    </Stack.Navigator>
  );
}

function AddRecipeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddRecipeScreen"
        component={AddRecipeScreen}
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: "#EE4F35",
          },
          /* headerRight: () => (
            <TouchableOpacity
              onPress={handleSaveRecipe} 
              style={{ marginRight: 10}}
            >
              <MaterialCommunityIcons name="check-bold" size={25} color={"#FFF"} />
            </TouchableOpacity>
          ), */
        }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function AppTabs() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      "Hesaptan Çıkış Yapmak Üzeresiniz",
      "Hesabınızdan çıkış yapmak istediğinizden emin misiniz",
      [
        {
          text: "Hayır",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "Evet",
          onPress: async () => {
            try {
              await firebase.auth().signOut();
              await AsyncStorage.removeItem("@user_data");
              navigation.reset({
                index: 0,
                routes: [{ name: "Auth" }],
              });
            } catch (error) {
              alert(error.message);
            }
          },
        },
      ]
    );
  };
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#EE4F35",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home-variant" : "home-variant-outline"}
              size={35}
              color={"#FFF"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddRecipe"
        component={AddRecipeStack}
        options={{
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "plus-circle" : "plus-circle-outline"}
              size={35}
              color={"#FFF"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: { backgroundColor: "#EE4F35", shadowColor: "#000"},
          headerShadowVisible: true,
          headerBackVisible: false,
          headerShown: true,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={35}
              color={"#FFF"}
            />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 20 }}
            >
              <FontAwesome name="sign-out" size={25} color={"#FFF"} />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [, setUserSign] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userDataInf = await AsyncStorage.getItem("@user_data");
        if (userDataInf) {
          setUser(JSON.parse(userDataInf));
        } else {
          setUser(null);
        }
      } catch (error) {
        alert(error.message);
        setUser(null);
      }
      setIsLoading(false);
    };

    checkUserSession();
  }, []);

  useEffect(() => {
    const signInWithStoredData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("@user_data");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const { email, password } = userData;
          if (!email || !password) {
            throw new Error("Email or password is missing");
          }
          await firebase.auth().signInWithEmailAndPassword(email, password);
          setUserSign(firebase.auth().currentUser);
        }
      } catch (error) {
        alert(error.message);
      }
    };
    signInWithStoredData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "App" : "Auth"}>
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="App"
          component={AppTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
