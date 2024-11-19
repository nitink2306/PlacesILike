import { useState, useEffect } from "react";
import { View, Alert, StyleSheet, Text, Image } from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
  launchImageLibraryAsync,
} from "expo-image-picker";
import { Colors } from "../../constants/colors";
import CustomButton from "../UI/CustomButtom";

function ImagePicker({ onTakeImage, initialImage }) {
  const [selectedImage, setSelectedImage] = useState(initialImage || null); // Default to null if no initial image is provided
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  // Update the selected image when `initialImage` changes
  useEffect(() => {
    if (initialImage) setSelectedImage(initialImage);
  }, [initialImage]);

  // Verify camera permissions
  const verifyPermission = async () => {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permission",
        "This app requires camera permission to proceed."
      );
      return false;
    }
    return true;
  };

  // Handler to launch the camera and capture an image
  const takeImageHandler = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) return;

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (!image.canceled) {
      const imageUri = image?.assets[0].uri;
      setSelectedImage(imageUri);
      onTakeImage(imageUri);
    }
  };

  // Handler to upload an image from the gallery
  const uploadImageHandler = async () => {
    const image = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (!image.canceled) {
      const imageUri = image?.assets[0].uri;
      setSelectedImage(imageUri);
      onTakeImage(imageUri);
    }
  };

  // Render the selected image or a placeholder
  const renderImagePreview = () =>
    selectedImage ? (
      <Image style={styles.image} source={{ uri: selectedImage }} />
    ) : (
      <Text style={styles.noImageText}>No image selected</Text>
    );

  return (
    <View>
      <View style={styles.imagePreview}>{renderImagePreview()}</View>
      <View style={styles.buttonRow}>
        <CustomButton onPress={takeImageHandler} icon="camera">
          Take Image
        </CustomButton>
        <CustomButton onPress={uploadImageHandler} icon="share">
          Upload Image
        </CustomButton>
      </View>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4, // Optional: Add rounded corners for a polished look
  },
  noImageText: {
    color: Colors.primary500,
    fontSize: 16,
    fontStyle: "italic",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
