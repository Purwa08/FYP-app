import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Platform } from "react-native";
import ProtectedRoute from "../../components/ProtectedRoute";


export default function RootLayout() {
  return (
    <ProtectedRoute>
    <Tabs screenOptions={{
    headerTitle: "", // Default: No title for all screens
    headerBackTitleVisible: false, // No back button text globally
    headerLeft: () => null,
    tabBarStyle: {
            backgroundColor: "#F4F6F8",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: Platform.OS === "ios" ? "80" : "65",
            paddingBottom: 10,
            paddingTop: 5
          },
          tabBarActiveTintColor: "#003161",
          tabBarInactiveTintColor: "#90A4AE",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },


  }}>

      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          headerLeft: () => null,
          headerStyle: {
              backgroundColor: "#121212", // Dark background
              shadowColor: "rgba(0, 0, 0, 0.2)", // Soft shadow
            },
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={25} name="home" color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
          name="attendance_summary"
          options={{
            headerShown: false,
            title: "Attendance Summary",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={25}name="check-circle" color={color} />
            ),
          }}
        />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          // headerTitle: "Student Profile",
          //headerBackTitleVisible: false, 
          // headerLeft: () => null,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={25} name="user" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={25} name="cog" color={color} />
          ),
        }}
      />

      
      </Tabs>

    </ProtectedRoute>
  );
}