import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Colors } from "../../constants/colors";
import { Place } from "../../models/place";
import SubmitButton from "../UI/SubmitButton";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";

function PlaceForm({ onCreatePlace, onEditPlace, initialValues }) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(
    initialValues?.imageUri || ""
  );
  const [pickedLocation, setPickedLocation] = useState();

  useEffect(() => {
    if (initialValues) {
      setEnteredTitle(initialValues.title || "");
    }
  }, [initialValues]);

  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  function takeImageHandler(imageUri) {
    setSelectedImage(imageUri);
  }

  const pickLocationHandler = useCallback((location) => {
    setPickedLocation(location);
  }, []);

  function savePlaceHandler() {
    const placeData = new Place(
      enteredTitle,
      selectedImage,
      pickedLocation || initialValues.location
    );

    if (initialValues && initialValues.id) {
      placeData.id = initialValues.id;
      onEditPlace(placeData);
    } else {
      onCreatePlace(placeData);
    }
  }

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
        />
      </View>
      <ImagePicker
        onTakeImage={takeImageHandler}
        initialImage={initialValues?.imageUri}
      />
      <LocationPicker
        onPickLocation={pickLocationHandler}
        initialLocation={initialValues?.location} // Pass initial location directly
      />
      <SubmitButton onPress={savePlaceHandler}>
        {initialValues ? "Save Changes" : "Add Place"}
      </SubmitButton>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
    color: "#FFFFFF",
  },
});
