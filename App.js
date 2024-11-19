import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllPlaces from "./screens/AllPlaces";
import PlaceAdd from "./screens/PlaceAdd";
import IconButton from "./components/UI/IconButton";
import { Colors } from "./constants/colors";
import Map from "./screens/Map";
import * as SplashScreen from "expo-splash-screen";
import { useState, useEffect, useCallback } from "react";
import { initPlacesDB } from "./util/database";
import PlaceDetailed from "./screens/PlaceDetailed";
import EditPlace from "./screens/EditPlace";
import AllLocationsMap from "./screens/AllLocationsMap";
import FavoritePlaces from "./screens/FavoritePlaces";

const Stack = createNativeStackNavigator();

export default function App() {
  // State to track if the database has been initialized
  const [dbInitialized, setDbInitialized] = useState(false);

  // Run once on component mount to prepare the app (initialize database and manage splash screen)
  useEffect(() => {
    const prepare = async () => {
      try {
        // Prevent auto-hiding the splash screen until preparation is done
        await SplashScreen.preventAutoHideAsync();
        // Initialize the SQLite database
        await initPlacesDB();
      } catch (e) {
        console.warn(e); // Log any initialization errors
      } finally {
        // Mark the database as initialized
        setDbInitialized(true);
      }
    };
    prepare();
  }, []);

  // Callback to hide the splash screen once the root view is ready
  const onLayoutRootView = useCallback(async () => {
    if (dbInitialized) {
      await SplashScreen.hideAsync();
    }
  }, [dbInitialized]);

  // Return null while the database is not initialized to prevent rendering
  if (!dbInitialized) return null;

  return (
    <>
      {/* StatusBar for managing the app's status bar appearance */}
      <StatusBar style="dark" />
      {/* NavigationContainer to manage the navigation stack */}
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator
          screenOptions={{
            // Common styles for all screens' headers
            headerStyle: {
              backgroundColor: Colors.primary200, // Header background color
            },
            headerTintColor: Colors.gray700, // Header text color
            contentStyle: { backgroundColor: Colors.gray700 }, // Screen background color
          }}
        >
          {/* Main Home Screen: All Places */}
          <Stack.Screen
            name="AllPlaces"
            component={AllPlaces}
            options={({ navigation }) => ({
              title: "Home", // Title displayed in the header
              // Buttons on the right side of the header
              headerRight: (tintColor) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* Navigate to the AllLocationsMap screen */}
                  <View style={{ marginRight: 15 }}>
                    <IconButton
                      icon="map"
                      size={28}
                      color={tintColor}
                      onPress={() => navigation.navigate("AllLocationsMap")}
                    />
                  </View>
                  {/* Navigate to the PlaceAdd screen */}
                  <IconButton
                    icon="add"
                    size={28}
                    color={tintColor}
                    onPress={() => navigation.navigate("PlaceAdd")}
                  />
                </View>
              ),
              // Button on the left side of the header
              headerLeft: (tintColor) => (
                <View style={{ paddingLeft: 10 }}>
                  {/* Navigate to the FavoritePlaces screen */}
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
          {/* Screen for adding a new place */}
          <Stack.Screen
            name="PlaceAdd"
            component={PlaceAdd}
            options={{
              title: "Add a new place", // Header title for this screen
            }}
          />
          {/* Screen for displaying and interacting with the map */}
          <Stack.Screen name="Map" component={Map} />
          {/* Detailed view of a specific place */}
          <Stack.Screen
            name="PlaceDetailed"
            component={PlaceDetailed}
            options={{
              title: "Loading Place...", // Header title while loading place details
            }}
          />
          {/* Screen for editing a specific place */}
          <Stack.Screen
            name="EditPlace"
            component={EditPlace}
            options={{ title: "Edit A Place" }} // Header title
          />
          {/* Screen for displaying all saved locations on a map */}
          <Stack.Screen
            name="AllLocationsMap"
            component={AllLocationsMap}
            options={{ title: "All Locations" }} // Header title
          />
          {/* Screen for displaying favorite places */}
          <Stack.Screen
            name="FavoritePlaces"
            component={FavoritePlaces}
            options={{ title: "Favorite Places" }} // Header title
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
