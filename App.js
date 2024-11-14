import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllPlaces from "./screens/AllPlaces";
import PlaceAdd from "./screens/PlaceAdd";
import IconButton from "./components/UI/IconButton";
import { Colors } from "./constants/colors";
import Map from "./screens/Map";
import * as SplashScreen from "expo-splash-screen";
import * as LocalAuthentication from "expo-local-authentication";
import { useState, useEffect, useCallback } from "react";
import { initPlacesDB } from "./util/database";
import PlaceDetailed from "./screens/PlaceDetailed";
import EditPlace from "./screens/EditPlace";
import AllLocationsMap from "./screens/AllLocationsMap";
import FavoritePlaces from "./screens/FavoritePlaces";

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await initPlacesDB();
        const authResult = await authenticate();
        setIsAuthenticated(authResult);
      } catch (e) {
        console.warn(e);
      } finally {
        setDbInitialized(true);
      }
    };
    prepare();
  }, []);

  async function authenticate() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      console.warn("Biometric authentication is not available on this device.");
      return false;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      console.warn("No biometrics found. Please set up biometrics.");
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with Biometrics",
      cancelLabel: "Cancel",
      fallbackLabel: "Enter PIN",
      disableDeviceFallback: false, // Allows fallback to PIN if Face ID or Touch ID fails
    });

    return result.success;
  }

  const onLayoutRootView = useCallback(async () => {
    if (dbInitialized) {
      await SplashScreen.hideAsync();
    }
  }, [dbInitialized]);

  if (!dbInitialized || !isAuthenticated) return null;

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer onReady={onLayoutRootView}>
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
              title: "Home",
              headerRight: (tintColor) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ marginRight: 15 }}>
                    <IconButton
                      icon="map"
                      size={28}
                      color={tintColor}
                      onPress={() => navigation.navigate("AllLocationsMap")}
                    />
                  </View>
                  <IconButton
                    icon="add"
                    size={28}
                    color={tintColor}
                    onPress={() => navigation.navigate("PlaceAdd")}
                  />
                </View>
              ),
              headerLeft: (tintColor) => (
                <View style={{ paddingLeft: 10 }}>
                  <IconButton
                    icon="heart"
                    size={28}
                    color={tintColor}
                    onPress={() => navigation.navigate("FavoritePlaces")}
                  />
                </View>
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
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen
            name="PlaceDetailed"
            component={PlaceDetailed}
            options={{
              title: "Loading Place...",
            }}
          />
          <Stack.Screen
            name="EditPlace"
            component={EditPlace}
            options={{ title: "Edit A Place" }}
          />
          <Stack.Screen
            name="AllLocationsMap"
            component={AllLocationsMap}
            options={{ title: "All Locations" }}
          />
          <Stack.Screen
            name="FavoritePlaces"
            component={FavoritePlaces}
            options={{ title: "Favorite Places" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
