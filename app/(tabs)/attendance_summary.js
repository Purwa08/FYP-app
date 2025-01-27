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
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAttendanceSummary } from "../(services)/api/api.js";
import { useSelector } from "react-redux";
import ProtectedRoute from "../../components/ProtectedRoute";
import ProgressBar from 'react-native-progress/Bar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from "react-native-calendars"; // Import calendar

const AttendanceSummary = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null); // To track expanded courses
  const user = useSelector((state) => state.auth.user);
  const studentId = user.student._id; // Get logged-in student's ID

  useEffect(() => {
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
      }
    };

    fetchAttendance();
  }, [user]);

  const toggleAttendanceRecords = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId); // Toggle the expanded state
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4caf50" />
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
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Attendance Summary</Text>
        <Text style={styles.subtitle}>{attendanceData.studentName}</Text>

        {attendanceData.attendanceSummary.map((course, index) => (
          <LinearGradient
            key={index}
            colors={["#4e73df", "#1cc88a"]} // Updated gradient colors
            style={styles.courseCard}
          >
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
              color={course.attendancePercentage >= 75 ? 'green' : 'red'}
              unfilledColor="#ddd"
              borderRadius={7}
            />

            {/* Session summary */}
            <View style={styles.sessionSummaryContainer}>
              <View style={styles.sessionSummaryItem}>
                <Icon name="check-circle" size={24} color="green" />
                <Text style={styles.sessionText}>Attended: {course.attendedSessions}</Text>
              </View>
              <View style={styles.sessionSummaryItem}>
                <Icon name="cancel" size={24} color="red" />
                <Text style={styles.sessionText}>Missed: {course.missedSessions}</Text>
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
                {expandedCourse === course.courseID ? "Hide Records" : "Show Records"}
              </Text>
            </TouchableOpacity>

            {/* Calendar */}
            {expandedCourse === course.courseID && (
              <View style={styles.attendanceRecords}>
                <Calendar
                  current={new Date().toISOString().split("T")[0]}
                  markedDates={
                    course.attendanceRecords.reduce((acc, record) => {
                      const date = new Date(record.date).toISOString().split("T")[0];
                      acc[date] = {
                        marked: true,
                        dotColor: record.status === "present" ? "green" : "red",
                      };
                      return acc;
                    }, {})
                  }
                  markingType="dot"
                />
              </View>
            )}
          </LinearGradient>
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
  courseCard: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  courseName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  courseDetails: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  attendancePercentage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    marginBottom: 5,
  },
  sessionSummaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 3,
    flexWrap: 'wrap',
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
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#4e73df",
    borderRadius: 6,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 16,
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
    textAlign: "center",
    marginTop: 20,
  },
});

