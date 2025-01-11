// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator, Alert, Button, TouchableOpacity } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { getCourseDetails, getAttendanceWindowStatus, markAttendance } from "../(services)/api/api";
// import { useSelector } from "react-redux";

// const CoursePage = () => {
//   const { courseId } = useLocalSearchParams(); // Extract courseId from the URL
//   const [courseDetails, setCourseDetails] = useState(null); // State for course data
//   const [loading, setLoading] = useState(true); // Loading state
//   const [isWindowOpen, setIsWindowOpen] = useState(false);
//   const user = useSelector((state) => state.auth.user);
//   const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const data = await getCourseDetails(courseId);
//         console.log("Course Details:", data);
//         setCourseDetails(data);

//         const windowStatus = await getAttendanceWindowStatus(courseId);
//         console.log("Attendance Window Status:", windowStatus);
//         setIsWindowOpen(windowStatus.isWindowOpen);

//       } catch (error) {
//         console.error("Error fetching course details:", error);
//         Alert.alert("Error", "Unable to fetch course details. Please try again later.");
//       } finally {
//         setLoading(false); // Stop loading spinner
//       }
//     };

//     fetchCourse();
//   }, [courseId]);


//   const markAttendanceHandler = async () => {
//     try {
//       const response = await markAttendance(courseId, user.student._id); // Call the API
//       console.log("marking attendance response:", response);
//       Alert.alert("Success", "Attendance marked successfully!");
//       setIsAttendanceMarked(true); // Mark attendance as done
//     } catch (error) {
//       Alert.alert("Error", "Unable to mark attendance. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading Course Details...</Text>
//       </View>
//     );
//   }

//   if (!courseDetails) {
//     return (
//       <View style={styles.container}>
//         <Text>Unable to fetch course details. Please try again later.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{courseDetails.name}</Text>
//       <Text style={styles.details}>Code: {courseDetails.code}</Text>
//       <Text style={styles.details}>Description: {courseDetails.description}</Text>

//       <View style={styles.statusContainer}>
//         <Text style={styles.status}>
//           Attendance Window: {isWindowOpen ? "Open" : "Closed"}
//         </Text>
//         <Button
//           title="Refresh Status"
//           onPress={async () => {
//             try {
//               const windowStatus = await getAttendanceWindowStatus(courseId);
//               console.log("Refreshed Attendance Window Status:", windowStatus);
//               setIsWindowOpen(windowStatus.isWindowOpen);
//             } catch (error) {
//               console.error("Error refreshing window status:", error);
//               Alert.alert("Error", "Unable to refresh attendance window status.");
//             }
//           }}
//         />

//         {/* Render the Mark Attendance button */}
//       {isWindowOpen && !isAttendanceMarked && (
//         <TouchableOpacity
//           style={styles.button}
//           onPress={markAttendanceHandler}
//         >
//           <Text style={styles.buttonText}>Mark Attendance</Text>
//         </TouchableOpacity>
//       )}

//       {/* Show a message if attendance is already marked */}
//       {isAttendanceMarked && (
//         <Text style={styles.successText}>Attendance already marked for today!</Text>
//       )}
//       </View>
//     </View>
//   );
// };

// export default CoursePage;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   details: {
//     fontSize: 18,
//     marginBottom: 8,
//   },
//   statusContainer: {
//     marginTop: 20,
//     alignItems: "center",
//   },
//   status: {
//     fontSize: 20,
//     fontWeight: "bold",
//     //color: isWindowOpen ? "green" : "red",
//     marginBottom: 10,
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: "#6200ea",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   successText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: "green",
//   },
// });



import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getCourseDetails, getAttendanceWindowStatus, markAttendance } from "../(services)/api/api";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";

const CoursePage = () => {
  const { courseId } = useLocalSearchParams(); // Extract courseId from the URL
  const [courseDetails, setCourseDetails] = useState(null); // State for course data
  const [loading, setLoading] = useState(true); // Loading state
  const [isWindowOpen, setIsWindowOpen] = useState(false); // Window status
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false); // Attendance marked status
  const [statusMessage, setStatusMessage] = useState(""); // Message to display
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseData = await getCourseDetails(courseId);
        setCourseDetails(courseData);

        // Fetch attendance window status
        const windowStatus = await getAttendanceWindowStatus(courseId, user.student._id);
        if (windowStatus.isAttendanceMarked) {
          setIsAttendanceMarked(true);
          setStatusMessage("✅ You have already marked attendance for today.");
        } else {
          setIsWindowOpen(windowStatus.isWindowOpen);
          setStatusMessage(windowStatus.isWindowOpen ? "🟢 Attendance window is open." : "🔴 Attendance window is closed.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Unable to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const refreshStatusHandler = async () => {
    try {
      const windowStatus = await getAttendanceWindowStatus(courseId, user.student._id);
      if (windowStatus.isAttendanceMarked) {
        setIsAttendanceMarked(true);
        setStatusMessage("✅ You have already marked attendance for today.");
      } else {
        setIsWindowOpen(windowStatus.isWindowOpen);
        setStatusMessage(windowStatus.isWindowOpen ? "🟢 Attendance window is open." : "🔴 Attendance window is closed.");
      }
    } catch (error) {
      console.error("Error refreshing status:", error);
      Alert.alert("Error", "Unable to refresh attendance status.");
    }
  };

  const markAttendanceHandler = async () => {
    try {
      await markAttendance(courseId, user.student._id);
      setIsAttendanceMarked(true);
      setStatusMessage("✅ You have already marked attendance for today.");
      Alert.alert("Success", "Attendance marked successfully!");
    } catch (error) {
      console.error("Error marking attendance:", error);
      Alert.alert("Error", "Unable to mark attendance. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Course Details */}
      <View style={styles.courseCard}>
        <Text style={styles.courseTitle}>{courseDetails.name}</Text>
        <Text style={styles.courseInfo}>Code: {courseDetails.code}</Text>
        <Text style={styles.courseInfo}>Description: {courseDetails.description}</Text>
      </View>

      {/* Attendance Status */}
      <View style={styles.attendanceContainer}>
        <View style={styles.statusRow}>
          <Text style={styles.statusMessage}>{statusMessage}</Text>
          {!isAttendanceMarked && (
            <TouchableOpacity onPress={refreshStatusHandler}>
              <MaterialIcons name="refresh" size={24} color="#4caf50" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Mark Attendance Button */}
      {!isAttendanceMarked && isWindowOpen && (
        <TouchableOpacity style={styles.attendanceButton} onPress={markAttendanceHandler}>
          <Text style={styles.attendanceButtonText}>Mark Attendance</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CoursePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  courseInfo: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  attendanceContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusMessage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  attendanceButton: {
    backgroundColor: "#6200ea",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: "center",
    shadowColor: "#6200ea",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  attendanceButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
