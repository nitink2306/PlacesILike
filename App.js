import { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";

import AllPlaces from "./screens/AllPlaces";
import PlaceAdd from "./screens/PlaceAdd";
import PlaceDetailed from "./screens/PlaceDetailed";
import EditPlace from "./screens/EditPlace";
import AllLocationsMap from "./screens/AllLocationsMap";
import FavoritePlaces from "./screens/FavoritePlaces";
import Map from "./screens/Map";
import IconButton from "./components/UI/IconButton";
import { initPlacesDB } from "./util/database";
import { Colors } from "./constants/colors";

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await initPlacesDB();
      } catch (error) {
        console.warn("Error initializing the app:", error);
      } finally {
        setDbInitialized(true);
      }
    }
    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (dbInitialized) {
      await SplashScreen.hideAsync();
    }
  }, [dbInitialized]);

  if (!dbInitialized) return null;

  const headerRightButtons = (navigation) => (
    <View style={styles.headerRightContainer}>
      <IconButton
        icon="map"
        size={28}
        color={Colors.gray700}
        onPress={() => navigation.navigate("AllLocationsMap")}
      />
      <IconButton
        icon="add"
        size={28}
        color={Colors.gray700}
        onPress={() => navigation.navigate("PlaceAdd")}
      />
    </View>
  );

  const headerLeftButton = (navigation) => (
    <View style={styles.headerLeftContainer}>
      <IconButton
        icon="heart"
        size={28}
        color={Colors.gray700}
        onPress={() => navigation.navigate("FavoritePlaces")}
      />
    </View>
  );

  return (
    <>
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary200 },
            headerTintColor: Colors.gray700,
            contentStyle: { backgroundColor: Colors.gray700 },
          }}
        >
          <Stack.Screen
            name="AllPlaces"
            component={AllPlaces}
            options={({ navigation }) => ({
              title: "Home",
              headerRight: () => headerRightButtons(navigation),
              headerLeft: () => headerLeftButton(navigation),
            })}
          />
          <Stack.Screen
            name="PlaceAdd"
            component={PlaceAdd}
            options={{ title: "Add a New Place" }}
          />
          <Stack.Screen
            name="PlaceDetailed"
            component={PlaceDetailed}
            options={{ title: "Loading Place..." }}
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
          <Stack.Screen name="Map" component={Map} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = {
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLeftContainer: {
    paddingLeft: 10,
  },
};
