import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function RootLayout() {
  return (
    <ProtectedRoute>
    <Tabs screenOptions={{
    headerTitle: "", // Default: No title for all screens
    headerBackTitleVisible: false, // No back button text globally
    headerLeft: () => null
  }}>

      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          headerLeft: () => null,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
          name="attendance_summary"
          options={{
            headerShown: false,
            title: "Attendance Summary",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="check-circle" color={color} />
            ),
          }}
        />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          // title: "Profile",
          // headerTitle: "Student Profile",
          headerBackTitleVisible: false, 
          // headerLeft: () => null,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />

      
      </Tabs>

    </ProtectedRoute>
  );
}