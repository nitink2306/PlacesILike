import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllPlaces from "./screens/AllPlaces";
import PlaceAdd from "./screens/PlaceAdd";
import IconButton from "./components/UI/IconButton";
import { Colors } from "./constants/colors";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary200,
            },
            headerTintColor: Colors.gray700,
            contentStyle: { backgroundColor: Colors.gray700 },
          }}
        >
          <Stack.Screen
            name="AllPlaces"
            component={AllPlaces}
            options={({ navigation }) => ({
              title: "Places I Like",
              headerRight: (tintColor) => (
                <IconButton
                  icon="add"
                  size={28}
                  color={tintColor}
                  onPress={() => navigation.navigate("PlaceAdd")}
                />
              ),
            })}
          />
          <Stack.Screen
            name="PlaceAdd"
            component={PlaceAdd}
            options={{
              title: "Add a new place",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
