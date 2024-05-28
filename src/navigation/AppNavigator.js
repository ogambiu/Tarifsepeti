import { Image, TouchableOpacity } from "react-native";
import MainScreen from "../screens/MainScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import AddRecipeScreen from "../screens/AddRecipeScreen";
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
              style={{ marginRight: 15 }}
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
          headerShadowVisible: false,
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
          headerShadowVisible: false,
          headerBackVisible: false,
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

  const signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    } catch (e) {
      console.log(e);
    }
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
          headerStyle: { backgroundColor: "#EE4F35" },
          headerShadowVisible: false,
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
            <TouchableOpacity onPress={signOutUser} style={{ marginRight: 15 }}>
              <MaterialIcons name="logout" size={25} color={"#FFF"} />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
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
