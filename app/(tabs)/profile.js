import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { logoutAction } from "../(redux)/authSlice";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log(user.student.name)

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/auth/login");
  };

  const handleEditProfile = () => {
    console.log("Edit profile clicked!"); // Dummy function for now
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.title}>Student Profile</Text>
        {user ? (
          <>
            <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{user.student.name}</Text>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.student.email}</Text>
              <Text style={styles.label}>Roll No:</Text>
              <Text style={styles.value}>{user.student.rollno}</Text>
            
            
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={handleEditProfile}
                >
                  <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.logoutButton]}
                  onPress={handleLogout}
                >
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            
          </>
        ) : (
          <Text style={styles.text}>No user logged in</Text>
        )}
        </View>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333333",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  noUserText: {
    fontSize: 18,
    color: "#ff0000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: "#4CAF50", // Green for edit profile
  },
  logoutButton: {
    backgroundColor: "#E52B50", // Red for logout
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});


