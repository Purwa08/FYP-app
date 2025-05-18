// import React, { useEffect, useState } from "react";
// import { StyleSheet, Text, View, FlatList } from "react-native";
// import { getAttendanceSummary } from "../../services/api/api";

// const AttendanceSummary = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAttendance = async () => {
//       try {
//         const data = await getAttendanceSummary(); // API Call
//         setAttendanceData(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch attendance data:", error);
//         setLoading(false);
//       }
//     };
//     fetchAttendance();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading Attendance Summary...</Text>
//       </View>
//     );
//   }

//   if (attendanceData.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text>No attendance records available.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Attendance Summary</Text>
//       <FlatList
//         data={attendanceData}
//         keyExtractor={(item) => item.courseId}
//         renderItem={({ item }) => (
//           <View style={styles.courseItem}>
//             <Text style={styles.courseTitle}>{item.courseName}</Text>
//             <Text style={styles.courseDetail}>
//               Attendance: {item.attendancePercentage}%
//             </Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default AttendanceSummary;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#333",
//   },
//   courseItem: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     width: "100%",
//     marginVertical: 10,
//     elevation: 3,
//   },
//   courseTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#444",
//   },
//   courseDetail: {
//     fontSize: 16,
//     color: "#666",
//   },
// });

// import React, { useEffect, useState } from "react";
// import { StyleSheet, Text, View, ScrollView } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { getAttendanceSummary } from "../(services)/api/api";
// import { useSelector } from "react-redux";
// import ProtectedRoute from "../../components/ProtectedRoute";

// const AttendanceSummary = () => {
//   const [attendanceData, setAttendanceData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const user = useSelector((state) => state.auth.user);
//   const studentId = user.student._id; // Replace with the logged-in student's ID from your context or global state.
//   console.log(user.student._id)
//   useEffect(() => {
//     const fetchAttendance = async () => {
//       try {
//         const data = await getAttendanceSummary(studentId);
//         console.log(data)
//         setAttendanceData(data);
//         //console.log(attendanceData.attendanceSummary);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching attendance data:", error);
//         setLoading(false);
//       }
//     };

//     fetchAttendance();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (!attendanceData) {
//     return (
//       <View style={styles.container}>
//         <Text>No attendance data found.</Text>
//       </View>
//     );
//   }

// //   console.log(attendanceData);

//   return (
//     <ProtectedRoute>
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Attendance Summary</Text>
//       <Text style={styles.subtitle}>{attendanceData.studentName}</Text>
//       {attendanceData.attendanceSummary.map((course, index) => (
//         <LinearGradient
//           key={index}
//           colors={["#35AFC2", "#61DBFB"]}
//           style={styles.techItem}
//         >
//           <Text style={styles.courseName}>{course.courseName}</Text>
//           <Text style={styles.courseDetails}>
//             Code: {course.courseCode}
//           </Text>
//           <Text style={styles.courseDetails}>
//             Description: {course.description}
//           </Text>
//           <Text style={styles.courseDetails}>
//             Attendance: {user.student.attendancePercentage[course.courseId] || 0}%
//           </Text>
//           <Text style={styles.courseDetails}>Attendance Records:</Text>
//           {course.attendanceRecords.map((record, i) => (
//             <View key={i} style={styles.record}>
//               <Text>{record.date}</Text>
//               <Text>{record.status}</Text>
//             </View>
//           ))}
//         </LinearGradient>
//       ))}
//     </ScrollView>
//     </ProtectedRoute>
//   );
// };

// export default AttendanceSummary;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
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
//   techItem: {
//     marginBottom: 15,
//     borderRadius: 10,
//     padding: 15,
//     elevation: 5,
//   },
//   courseName: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   courseDetails: {
//     fontSize: 18,
//     color: "#fff",
//   },
//   record: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 5,
//     paddingHorizontal: 10,
//     backgroundColor: "#fff",
//     marginVertical: 5,
//     borderRadius: 5,
//   },
// });

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  RefreshControl
} from "react-native";

import { getAttendanceSummary } from "../(services)/api/api.js";
import { useSelector } from "react-redux";
import ProtectedRoute from "../../components/ProtectedRoute";
import ProgressBar from "react-native-progress/Bar";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Calendar } from "react-native-calendars"; // Import calendar

const AttendanceSummary = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null); // To track expanded courses
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh
  const user = useSelector((state) => state.auth.user);
  const studentId = user.student._id; // Get logged-in student's ID

  
    const fetchAttendance = async () => {
      if (!user || !studentId) {
        setLoading(false);
        return;
      }
 
      try {
        const data = await getAttendanceSummary(studentId);
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
        setRefreshing(false); // Stop refreshing after fetch
      }
    };

  

  useEffect(() => {
    fetchAttendance(); // Initial fetch on mount
  }, [user]);

  // Handler for pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance(); // Refetch data
  };

  const toggleAttendanceRecords = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId); // Toggle the expanded state
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00796B"/>
      </View>
    );
  }

  if (!attendanceData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No attendance data found.</Text>
      </View>
    );
  }

  return (
    <ProtectedRoute>
      <ScrollView style={styles.container}
      refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00796B" />
              }>
      <View style={styles.header}>
    <Text style={styles.title}>Attendance Summary</Text>
    <Text style={styles.subtitle}>Student Name: {attendanceData.studentName}</Text>
  </View>
        {attendanceData.attendanceSummary.map((course, index) => (
          <View
            key={index}
            style={[styles.courseCard, { backgroundColor: "#ffffff", elevation: 5 }]}>
            <Text style={styles.courseName}>{course.courseName}</Text>
            <Text style={styles.courseDetails}>Code: {course.courseCode}</Text>
            <Text style={styles.courseDetails}>Description: {course.description}</Text>

            {/* Attendance percentage with progress bar */}
            <Text style={styles.attendancePercentage}>
              Attendance: {course.attendancePercentage}%
            </Text>

            <ProgressBar
              progress={course.attendancePercentage / 100}
              width={null}
              height={10}
              color={course.attendancePercentage >= 75 ? '#003161' : '#C62828'}
              unfilledColor="#ddd"
              borderRadius={7}
            />

            {/* Session summary */}
            <View style={styles.sessionSummaryContainer}>
              <View style={styles.sessionSummaryItem}>
                <Icon name="check-circle" size={24} color="green" />
                <Text style={styles.sessionText}>
                  Attended: {course.attendedSessions}
                </Text>
              </View>
              <View style={styles.sessionSummaryItem}>
                <Icon name="cancel" size={24} color="red" />
                <Text style={styles.sessionText}>
                  Missed: {course.missedSessions}
                </Text>
              </View>
              <View style={styles.sessionSummaryItem}>
                <Icon name="event" size={24} color="blue" />
                <Text style={styles.sessionText}>
                  Total: {course.attendedSessions + course.missedSessions}
                </Text>
              </View>
            </View>

            {/* Toggle button */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleAttendanceRecords(course.courseID)}
            >
              <Text style={styles.toggleButtonText}>
                {expandedCourse === course.courseID
                  ? "Hide Records"
                  : "Show Records"}
              </Text>
            </TouchableOpacity>

            {/* Calendar */}
            {expandedCourse === course.courseID && (
              <View style={styles.attendanceRecords}>
                <Calendar
                  current={new Date().toISOString().split("T")[0]}
                  markedDates={course.attendanceRecords.reduce(
                    (acc, record) => {
                      const date = new Date(record.date)
                        .toISOString()
                        .split("T")[0];
                      acc[date] = {
                        marked: true,
                        dotColor: record.status === "present" ? "#4caf50": "#f44336",
                      };
                      return acc;
                    },
                    {}
                  )}
                  markingType="dot"
                />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </ProtectedRoute>
  );
};

export default AttendanceSummary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8", // Light background color
    padding: 20,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? "40" : "10", // To bring the header down from the top of the screen
    paddingBottom: 20,
    alignItems: "center",
    marginBottom: 10,
    elevation: 5, // Adding elevation for a shadow effect
    
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: 'Georgia',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 15,
    textAlign: "center",
    color: "#003366",
  },
  subtitle: {
    fontSize: 19,
    fontWeight: "600",
    marginBottom: 20,
    fontFamily: 'Arial',
    textAlign: "center",
    color: "#B2B8B0",
  },
  courseCard: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 6,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  courseName: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: 'Courier New',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: "#003161",
  },
  courseDetails: {
    fontSize: 16,
    fontFamily: 'Palatino',
    fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif',
    color: "#555",
    marginTop: 5,
  },
  attendancePercentage: {
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: 'System UI ',
    color: "#003161",
    marginTop: 5,
    marginBottom: 5,
  },
  sessionSummaryContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 3,
    flexWrap: "wrap-reverse",
  },
  sessionSummaryItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  sessionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginLeft: 8,
  },
  toggleButton: {
    marginTop: 15,
    paddingVertical: 9,
    paddingHorizontal: 30,
    backgroundColor: "#003161",
    borderRadius: 6,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 16,
    fontFamily: 'System UI ',
    color: "#fff",
    fontWeight: "bold",
  },
  attendanceRecords: {
    marginTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  noDataText: {
    fontSize: 18,
    color: "#777",
    fontFamily: 'System UI ',
    textAlign: "center",
    marginTop: 20,
  },
});