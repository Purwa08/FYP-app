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
import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert,ScrollView,Platform} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch ,useSelector} from "react-redux";
import { logoutAction } from "../(redux)/authSlice";
import { useRouter } from "expo-router";
// import { ThemeContext } from '../context/ThemeContext';
import ProtectedRoute from "../../components/ProtectedRoute";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
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
    <ProtectedRoute>
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your preferences</Text>
        </View>

        {/* Account */}
        <View style={styles.option}>
        <TouchableOpacity
          style={styles.optionContent}
          onPress={() => router.push("/profile/edit-profile")}
        >
          <Icon name="user" size={24} color="#003161" />
          <Text style={styles.optionText}>Account</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={styles.option}>
        <View style={styles.optionContent}>
          <Icon name="bell" size={24} color="#003161" />
          <Text style={styles.optionText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            thumbColor={notificationsEnabled ? "#005B96" : "#ccc"}
            trackColor={{ false: "#ddd", true: "#B3DAFF" }} 
          />
        </View>
        </View>

        {/* Dark Mode */}
        <View style={styles.option}>
        <View style={styles.optionContent}>
          <Icon name="moon-o" size={24} color="#003161" />
          <Text style={styles.optionText}>Dark Mode</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={toggleDarkMode}
            thumbColor={darkModeEnabled ? "#005B96" : "#ccc"}
            trackColor={{ false: "#ddd", true: "#B3DAFF" }}

          />
        </View>
        </View>

        {/* Privacy */}
        <View style={styles.option}>
        <TouchableOpacity
          style={styles.optionContent}
          onPress={() => router.push(`/auth/change-password/${user.student._id}`)}
        >
          <Icon name="lock" size={24} color="#003161" />
          <Text style={styles.optionText}>Privacy</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.option}>
        <TouchableOpacity
          style={styles.optionContent}
          onPress={() => router.push("/about")}
        >
          <Icon name="info-circle" size={24} color="#003161" />
          <Text style={styles.optionText}>About</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.option}>
        <TouchableOpacity style={styles.optionContent} onPress={handleLogout}>
          <Icon name="sign-out" size={24} color="#003161" />
          <Text style={styles.optionText}>Logout</Text>
          <Icon name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
      </View>

    </ScrollView>
    </ProtectedRoute>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  scrollViewContent: {
    alignItems: 'center', 
    paddingBottom: 20, 
  },
  header: {
    paddingTop: 40, // To bring the header down from the top of the screen
    paddingBottom: 10,
    alignItems: "center",
    marginBottom: 10,
    elevation: 5,    
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: 'Georgia',
    marginBottom: 10,
    textAlign: "center",
    color: "#003366",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subtitle: {
    fontSize: 19,
    fontWeight: "600",
    marginBottom: 20,
    fontFamily: 'Arial',
    textAlign: "center",
    color: "#B2B8B0",
  },
  section: {
    marginVertical: 50,
  },
  option: {
    marginBottom: 15,
    elevation: 3,
    borderRadius: 10,
    backgroundColor: "#ffffff", 
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'Verdana',
    color: "#333",
  },
  optionIcon: {
    marginLeft: "auto",
  },
});