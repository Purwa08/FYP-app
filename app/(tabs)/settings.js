// import React from "react";
// import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";

// const Settings = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Settings</Text>
//       <View style={styles.section}>
//         <TouchableOpacity style={styles.option}>
//           <Icon name="user" size={24} color="#4caf50" />
//           <Text style={styles.optionText}>Account</Text>
//           <Icon
//             name="angle-right"
//             size={24}
//             color="#999"
//             style={styles.optionIcon}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.option}>
//           <Icon name="bell" size={24} color="#ff9800" />
//           <Text style={styles.optionText}>Notifications</Text>
//           <Icon
//             name="angle-right"
//             size={24}
//             color="#999"
//             style={styles.optionIcon}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.option}>
//           <Icon name="lock" size={24} color="#f44336" />
//           <Text style={styles.optionText}>Privacy</Text>
//           <Icon
//             name="angle-right"
//             size={24}
//             color="#999"
//             style={styles.optionIcon}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.option}>
//           <Icon name="info-circle" size={24} color="#3f51b5" />
//           <Text style={styles.optionText}>About</Text>
//           <Icon
//             name="angle-right"
//             size={24}
//             color="#999"
//             style={styles.optionIcon}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.option}>
//           <Icon name="sign-out" size={24} color="#e91e63" />
//           <Text style={styles.optionText}>Logout</Text>
//           <Icon
//             name="angle-right"
//             size={24}
//             color="#999"
//             style={styles.optionIcon}
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Settings;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     fontSize: 32,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#333",
//   },
//   section: {
//     marginVertical: 10,
//   },
//   option: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     marginBottom: 10,
//     elevation: 2,
//   },
//   optionText: {
//     flex: 1,
//     fontSize: 18,
//     marginLeft: 10,
//     color: "#333",
//   },
//   optionIcon: {
//     marginLeft: "auto",
//   },
// });




import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { logoutAction } from "../(redux)/authSlice";
import { useRouter } from "expo-router";
// import { ThemeContext } from '../context/ThemeContext';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  //const { isDarkMode, toggleAppTheme } = useContext(ThemeContext); 

  // Toggle Notifications
  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    Alert.alert("Notifications", notificationsEnabled ? "Disabled" : "Enabled");
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkModeEnabled((prev) => !prev);
    Alert.alert("Theme", darkModeEnabled ? "Light Mode Enabled" : "Dark Mode Enabled");
  };

  // Handle Logout
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          dispatch(logoutAction());
          router.push("/auth/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.section}>
        {/* Account */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/profile/edit-profile")}
        >
          <Icon name="user" size={24} color="#4caf50" />
          <Text style={styles.optionText}>Account</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>

        {/* Notifications */}
        <View style={styles.option}>
          <Icon name="bell" size={24} color="#ff9800" />
          <Text style={styles.optionText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            thumbColor={notificationsEnabled ? "#4caf50" : "#ccc"}
          />
        </View>

        {/* Dark Mode */}
        <View style={styles.option}>
          <Icon name="moon-o" size={24} color="#9c27b0" />
          <Text style={styles.optionText}>Dark Mode</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={toggleDarkMode}
            thumbColor={darkModeEnabled ? "#673ab7" : "#ccc"}
          />
        </View>

        {/* Privacy */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/auth/change-password")}
        >
          <Icon name="lock" size={24} color="#f44336" />
          <Text style={styles.optionText}>Privacy</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>

        {/* About */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/about")}
        >
          <Icon name="info-circle" size={24} color="#3f51b5" />
          <Text style={styles.optionText}>About</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Icon name="sign-out" size={24} color="#e91e63" />
          <Text style={styles.optionText}>Logout</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginVertical: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  optionIcon: {
    marginLeft: "auto",
  },
});