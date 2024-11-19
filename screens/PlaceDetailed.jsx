import {
  ScrollView,
  Image,
  View,
  StyleSheet,
  Text,
  Alert,
  ActionSheetIOS,
  Platform,
  Share,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import CustomButton from "../components/UI/CustomButtom";
import { Colors } from "../constants/colors";
import { fetchPlaceWithId, deletePlace } from "../util/database";

export default function PlaceDetailed({ route, navigation }) {
  const [fetchedPlace, setFetchedPlace] = useState(null); // Store fetched place details
  const [isFavorite, setIsFavorite] = useState(false); // Track favorite status
  const selectedPlaceId = route.params.placeId;
  const isFocused = useIsFocused();

  // Load place data and update navigation title
  useEffect(() => {
    if (isFocused) {
      async function loadPlaceData() {
        try {
          const place = await fetchPlaceWithId(selectedPlaceId);
          setFetchedPlace(place);
          navigation.setOptions({ title: place.title });
        } catch (error) {
          console.error("Failed to load place data:", error);
        }
      }
      loadPlaceData();
    }
  }, [isFocused, selectedPlaceId, navigation]);

  // Check and set favorite status from AsyncStorage
  useEffect(() => {
    async function checkFavoriteStatus() {
      try {
        const favorites = await AsyncStorage.getItem("favoritePlaces");
        const favoriteIds = favorites ? JSON.parse(favorites) : [];
        setIsFavorite(favoriteIds.includes(selectedPlaceId));
      } catch (error) {
        console.error("Failed to fetch favorite status:", error);
      }
    }

    if (isFocused) {
      checkFavoriteStatus();
    }
  }, [isFocused, selectedPlaceId]);

  // Toggle favorite status and update AsyncStorage
  const toggleFavoriteHandler = useCallback(async () => {
    try {
      const favorites = await AsyncStorage.getItem("favoritePlaces");
      let favoriteIds = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favoriteIds = favoriteIds.filter((id) => id !== selectedPlaceId);
      } else {
        favoriteIds.push(selectedPlaceId);
      }

      await AsyncStorage.setItem("favoritePlaces", JSON.stringify(favoriteIds));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite status:", error);
    }
  }, [isFavorite, selectedPlaceId]);

  // Share image handler
  const shareImage = async () => {
    try {
      await Share.share({
        url: fetchedPlace?.imageUri,
        message: `Check out this place: ${fetchedPlace?.title}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  // Share location handler
  const shareLocation = async () => {
    try {
      await Share.share({
        message: `Check out this place: ${fetchedPlace?.title}\n\nLocation: https://www.google.com/maps/search/?api=1&query=${fetchedPlace?.lat},${fetchedPlace?.lng}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle sharing options for iOS and Android
  const sharePlaceHandler = useCallback(() => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Share Image", "Share Location"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) shareImage();
          else if (buttonIndex === 2) shareLocation();
        }
      );
    } else {
      Alert.alert("Share Options", "Choose what you'd like to share", [
        { text: "Share Image", onPress: shareImage },
        { text: "Share Location", onPress: shareLocation },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  }, [fetchedPlace]);

  // Navigate to map view
  const showOnMapHandler = () => {
    navigation.navigate("Map", {
      initialLat: fetchedPlace?.lat,
      initialLng: fetchedPlace?.lng,
    });
  };

  // Delete place handler
  const deletePlaceHandler = () => {
    Alert.alert("Delete Place", "Are you sure you want to delete this place?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePlace(selectedPlaceId);
            navigation.navigate("AllPlaces");
          } catch (error) {
            console.error("Failed to delete place:", error);
          }
        },
      },
    ]);
  };

  // Navigate to edit place screen
  const editPlaceHandler = () => {
    navigation.navigate("EditPlace", { placeId: selectedPlaceId });
  };

  // Fallback loading state
  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image source={{ uri: fetchedPlace.imageUri }} style={styles.image} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <CustomButton icon="map" onPress={showOnMapHandler}>
          View on Map
        </CustomButton>
        <CustomButton icon="pencil" onPress={editPlaceHandler}>
          Edit Place
        </CustomButton>
        <CustomButton icon="trash" onPress={deletePlaceHandler}>
          Delete Place
        </CustomButton>
        <CustomButton icon="share" onPress={sharePlaceHandler}>
          Share Place
        </CustomButton>
        <TouchableOpacity
          onPress={toggleFavoriteHandler}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={28}
            color={Colors.primary500}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  favoriteButton: {
    marginTop: 10,
    alignItems: "center",
  },
});
