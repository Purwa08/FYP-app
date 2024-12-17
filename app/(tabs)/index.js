// import React from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import Icon from "react-native-vector-icons/FontAwesome";
// import Fontisto from "@expo/vector-icons/Fontisto";
// import ProtectedRoute from "../../components/ProtectedRoute";

// const TabHome = () => {
//   return (
//     <ProtectedRoute>
//     <View style={styles.container}>
//       <Text style={styles.title}>Attendify</Text>
//       <Text style={styles.subtitle}>Registered Courses:</Text>
//       <View style={styles.techList}>
//         <LinearGradient colors={["#61DBFB", "#35AFC2"]} style={styles.techItem}>
//           <Icon name="code" size={30} color="#fff" />
//           <Text style={styles.techText}>Computer Networks</Text>
//         </LinearGradient>
//         <LinearGradient colors={["#764ABC", "#543B9A"]} style={styles.techItem}>
//           <Fontisto name="redux" size={30} color="#fff" />
//           <Text style={styles.techText}>Operating System</Text>
//         </LinearGradient>
//         <LinearGradient colors={["#FF4154", "#D12B3A"]} style={styles.techItem}>
//           <Icon name="database" size={30} color="#fff" />
//           <Text style={styles.techText}>Database Management System</Text>
//         </LinearGradient>
//         <LinearGradient colors={["#0FAAFF", "#0B79C1"]} style={styles.techItem}>
//           <Icon name="wpforms" size={30} color="#fff" />
//           <Text style={styles.techText}>Design and Analysis of Algorithms</Text>
//         </LinearGradient>
//         <LinearGradient colors={["#000000", "#434343"]} style={styles.techItem}>
//           <Icon name="server" size={30} color="#fff" />
//           <Text style={styles.techText}>Data Structures and Algorithms</Text>
//         </LinearGradient>
//       </View>
//     </View>
//     </ProtectedRoute>
//   );
// };

// export default TabHome;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#333",
//   },
//   subtitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#666",
//   },
//   techList: {
//     flexDirection: "column",
//     alignItems: "center",
//     width: "100%",
//   },
//   techItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     width: "90%",
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     marginBottom: 15,
//     elevation: 5,
//   },
//   techText: {
//     fontSize: 18,
//     color: "#fff",
//     marginLeft: 10,
//     fontWeight: "bold",
//   },
// });



import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getStudentCourses } from "../(services)/api/api.js";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window"); // Get the screen width to make it responsive

const TabHome = () => {
  const [courses, setCourses] = useState([]); // To hold the list of courses
  const [loading, setLoading] = useState(true); // To track loading state
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();


  useEffect(() => {
    if (user && user.student) {
      const studentId = user.student._id; // Replace with actual studentId from auth or context
      console.log(studentId);
      // Fetch courses when the component mounts
      const fetchCourses = async () => {
        try {
          const data = await getStudentCourses(studentId); // Call the API to fetch student courses
          console.log("API Response:", data);
          setCourses(data.courses); // Set courses data
        } catch (error) {
          console.error("Error fetching student courses:", error);
          setCourses([]); // Clear courses to ensure no stale data
          Alert.alert("Error", "Unable to fetch courses. Please try again later.");
        } finally {
          setLoading(false); // Stop loading after the fetch is complete
        }
      };

      fetchCourses();
    }
  }, [user]); // Empty dependency array to run only once when the component mounts

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Text style={styles.title}>Attendify</Text>
        <Text style={styles.subtitle}>Registered Courses:</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        ) : (
          <ScrollView contentContainerStyle={styles.techList}>
             {Array.isArray(courses) && courses.length > 0 ? ( // Check if courses is an array
            // {courses.length > 0 ? (
              courses.map((course) => (
                <View key={course.courseID} style={styles.card}>
                  <LinearGradient
                    colors={["#6a11cb", "#2575fc"]} // Gradient for the card's background
                    style={styles.cardGradient}
                  >
                    <View style={styles.cardContent}>
                      <Icon name="book" size={25} color="#fff" />
                      <View style={styles.textContainer}>
                        <Text style={styles.courseName}>{course.courseName}</Text>
                        <Text style={styles.courseID}>Code: {course.courseCode}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              ))
            ) : (
              <Text style={styles.noCoursesText}>No courses enrolled yet.</Text>
            )}
          </ScrollView>
        )}
      </View>
    </ProtectedRoute>
  );
};

export default TabHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Align to the top of the screen
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
    paddingBottom: 20, // Adding bottom padding for a neat layout
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6a11cb",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 20,
  },
  techList: {
    width: "100%",
    paddingHorizontal: 15,
    alignItems: "center", // Center the cards horizontally
  },
  card: {
    width: width * 0.85, // Cards take up 85% of the screen width
    marginBottom: 15,
    borderRadius: 10,
    elevation: 5, // Shadow effect for the cards on Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  cardGradient: {
    borderRadius: 10,
    overflow: "hidden", // Ensure the gradient does not overflow
    padding: 15,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Left-aligned
  },
  textContainer: {
    marginLeft: 15,
  },
  courseName: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  courseID: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  noCoursesText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
});
