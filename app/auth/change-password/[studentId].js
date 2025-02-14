import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // Using expo-router for navigation
import { useSearchParams } from "expo-router/build/hooks";
import { changePassword } from "../../(services)/api/api";
import ProtectedRoute from "../../../components/ProtectedRoute";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  //const { studentId } = useLocalSearchParams();
  //const { studentId } = router.query;
  //const { studentId } = useSearchParams();
  const { studentId } = useLocalSearchParams();
  console.log("studentId:", studentId); // Debugging line
  //console.log(studentId);
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "New passwords do not match");
    }

    setLoading(true);

    try {
      const response = await changePassword(
        studentId,
        currentPassword,
        newPassword,
        confirmPassword
      ); // Call the API function

      if (response.success) {
        Alert.alert("Success", response.message);
        setLoading(false);
        router.replace("/(tabs)/settings.js"); // Redirect to the settings page after success
      } else {
        Alert.alert("Error", response.message || "Something went wrong");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Change Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={[styles.button, styles.updateButton]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Updating..." : "Change Password"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Georgia",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 20,
    color: "#003366",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    width: "100%",
  },
  button: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
    width: "100%", // Full width button inside the card
    backgroundColor: "#006A67",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  updateButton: {
    backgroundColor: "#006A67",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Arial",
    color: "#ffffff",
  },
});

export default ChangePassword;