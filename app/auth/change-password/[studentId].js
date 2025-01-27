import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter,useLocalSearchParams } from "expo-router"; // Using expo-router for navigation
import { useSearchParams } from "expo-router/build/hooks";
import { changePassword } from "../../(services)/api/api";
import ProtectedRoute from "../../../components/ProtectedRoute"

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
      const response = await changePassword(studentId, currentPassword, newPassword, confirmPassword); // Call the API function

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
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <ProtectedRoute>
    <View style={styles.container}>
      <Text style={styles.header}>Change Password</Text>

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
        style={styles.button}
        onPress={handleChangePassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Updating..." : "Change Password"}</Text>
      </TouchableOpacity>
    </View>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ChangePassword;
