import React, { useState, useEffect } from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Platform} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getStudentCourses } from "../(services)/api/api.js";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

const TabHome = () => {
  const [courses, setCourses] = useState([]); // To hold the list of courses
  const [loading, setLoading] = useState(true); // To track loading state
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, // Removes the back button (arrow)
      headerShown: false, // Hides the folder name and header
    });
  }, [navigation]);

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
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Attendify</Text>
          <Text style={styles.subtitle}>Registered Courses:</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#00796B" style={styles.loader} />
        ) : (
            courses.length > 0 ? (
              courses.map((course) => (
                <TouchableOpacity
                  key={course.courseID}
                  style={styles.card}
                  onPress={() => 
                    // Navigate to the course page with courseID
                    router.push(`/course/${course.courseID}`)
                  }
                >

                    <View style={styles.cardContent}>
                      <Icon name="book" size={30} color="#003161" />
                      <View style={styles.textContainer}>
                        <Text style={styles.courseName}>{course.courseName}</Text>
                        <Text style={styles.courseID}>Code: {course.courseCode}</Text>
                      </View>
                    </View>
                  
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noCoursesText}>No courses enrolled yet.</Text>
            )
          
        )}
      </ScrollView>
    </ProtectedRoute>
  );
};

export default TabHome;

const styles = StyleSheet.create({
  
  scrollViewContent: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 20,
    alignItems: "center",
    padding: 20,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
    marginBottom: 10,
    elevation: 5,
    shadowColor: "#000",    
    
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 15,
    textAlign: "center",
    color: "#003366",
  },
  subtitle: {
    fontSize: 19,
    fontWeight: "600",
    marginBottom: 20,
    fontFamily: "Arial",
    textAlign: "center",
    color: "#B2B8B0",
  },
  techList: {
    width: "100%", // Full width of the container
    paddingHorizontal: 15,
    alignItems: "center", // Center the cards horizontally
  },
  card: {
    width: "80%",
    marginBottom: 20,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flexWrap:"wrap"
  },
  
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "flex-start",
    //flexWrap:"wrap"
    
  },
  textContainer: {
    marginLeft: 5,
  },
  courseName: {
    fontSize: 25,
    //fontWeight: "bold",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    // fontFamily: "Courier New",
    color: "#003161",
  },
  courseID: {
    fontSize: 18,
    fontFamily: "Palatino",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: "#555",
    marginTop: 3,
  },
  noCoursesText: {
    fontSize: 18,
    color: "#777",
    fontFamily: "System UI ",
    textAlign: "center",
    marginTop: 20,
  },
  loader: {
    marginTop: 15,
  },
});