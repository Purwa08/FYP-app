import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform
} from "react-native";
import { useRoute, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { resetPassword } from "../../(services)/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setFirstLogin } from "../../(redux)/authSlice";
import ProtectedRoute from "../../../components/ProtectedRoute";

const ResetPasswordScreen = () => {
  //const route = useRoute();
  const { studentId } = useLocalSearchParams();
  //const { studentId } = route.params;  // Get the studentId from the route params
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log("user in reset password");
  const router = useRouter();

  //   // Check if studentId is undefined
  //   useEffect(() => {
  //     if (!studentId) {
  //       console.log("Student ID is missing in the route params");
  //     }
  //   }, [studentId]);

  const handlePasswordReset = async () => {
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    // Check if password is long enough (backend already does this, but it's good to validate here as well)
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    try {
      // Call the resetPassword function with the studentId from the URL and the new password
      const response = await resetPassword(studentId, newPassword); // Ensure resetPassword sends studentId in the URL
      console.log("reset wala response here:", response);
      // Handle the response
      if (response.success) {
        console.log("if part success");

        dispatch(setFirstLogin(false));
        Alert.alert("Success", "Password reset successfully!");

        console.log("user after reset password", user);
        router.push("/auth/login");
      } else {
        console.log("else part");
        Alert.alert("Error", response.message || "Something went wrong!");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to reset password. Please try again.");
    }
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={[styles.button, styles.updateButton]}
            onPress={handlePasswordReset}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
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

export default ResetPasswordScreen;