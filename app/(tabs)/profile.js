import React from "react";
import { View, StyleSheet, Text, TouchableOpacity ,Platform} from "react-native";
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
    router.push("/profile/edit-profile");
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
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  profileCard: {
    width: "100%",
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Arial",
    color: "#003161",
    alignSelf: "flex-start",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Palatino",
    fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif',
    color: "#333333",
    alignSelf: "flex-start",
    marginBottom: 6,
    paddingLeft: 5,
  },
  noUserText: {
    fontSize: 18,
    color: "#ff0000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    width: "100%",
  },
  button: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    backgroundColor: "#003161", 
  },
  logoutButton: {
    backgroundColor: "#006A67", 
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "System",
    color: "#ffffff",
  },
});