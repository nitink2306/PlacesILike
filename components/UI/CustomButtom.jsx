import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../constants/colors";

function CustomButton({ onPress, icon, children }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      {icon && (
        <Ionicons
          style={styles.icon}
          name={icon}
          size={18}
          color={Colors.primary500}
        />
      )}
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 16,
    borderWidth: 1,
    borderColor: Colors.primary500,
    borderRadius: 4, // Optional: Adds a more polished look
  },
  pressed: {
    opacity: 0.7, // Provides visual feedback on press
  },
  icon: {
    marginRight: 6, // Adds spacing between the icon and text
  },
  text: {
    color: Colors.primary500,
    fontSize: 14, // Optional: Ensures text size consistency
  },
});
