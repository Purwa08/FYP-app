import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { resetPassword } from "../(services)/api/api";  // Import the resetPassword function

const ResetPasswordScreen = ({ route }) => {
  const { studentId } = route.params;  // Get the studentId from the route params
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

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
      const response = await resetPassword(studentId, newPassword);  // Ensure resetPassword sends `studentId` in the URL

      // Handle the response
      if (response.success) {
        Alert.alert("Success", "Password reset successfully!");
        router.push("/auth/login");  // Navigate to the home screen or dashboard
      } else {
        Alert.alert("Error", response.message || "Something went wrong!");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to reset password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Reset Password" onPress={handlePasswordReset} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    width: "100%",
  },
});

export default ResetPasswordScreen;
