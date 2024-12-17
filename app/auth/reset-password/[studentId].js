import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRoute,useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import { resetPassword } from "../../(services)/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setFirstLogin } from "../../(redux)/authSlice";

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
      const response = await resetPassword(studentId, newPassword);  // Ensure resetPassword sends `studentId` in the URL
        console.log("reset wala response here:", response);
      // Handle the response
      if (response.success) {
        console.log("if part success")
        
        dispatch(setFirstLogin(false));
        Alert.alert("Success", "Password reset successfully!");
        
        console.log("user after reset password", user);
        router.push("/auth/login");  
      } else {
        console.log("else part")
        Alert.alert("Error", response.message || "Something went wrong!");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to reset password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
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
    <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
      <Text style={styles.buttonText}>Reset Password</Text>
    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: "#f5f5f5",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 24,
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
    button: {
      height: 50,
      backgroundColor: "#6200ea",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      marginTop: 16,
      width: "100%",
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
});

export default ResetPasswordScreen;
