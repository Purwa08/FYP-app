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
import { StyleSheet, Text, View, ScrollView, TouchableOpacity,ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAttendanceSummary } from "../(services)/api/api.js";
import { useSelector } from "react-redux";
import ProtectedRoute from "../../components/ProtectedRoute";

const AttendanceSummary = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null); // To track expanded courses
  const user = useSelector((state) => state.auth.user);
  const studentId = user.student._id; // Get logged-in student's ID
  console.log(studentId);


  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user) {
        console.error("No user found!");
        setLoading(false);
        return;
      }

      //const studentId = user.student?._id;
      if (!studentId) {
        console.error("Student ID is not valid!");
        setLoading(false);
        return;
      }

      try {
        const data = await getAttendanceSummary(studentId);
        console.log(data);
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
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#6a11cb" />
      </View>
    );
  }

  if (!attendanceData ) {
    return (
      <View style={styles.container}>
        <Text>No attendance data found.</Text>
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
            
            colors={["#6a11cb", "#2575fc"]} // Gradient for the card's background
            style={styles.techItem}
          >
            <Text style={styles.courseName}>{course.courseName}</Text>
            <Text style={styles.courseDetails}>Code: {course.courseCode}</Text>
            <Text style={styles.courseDetails}>Description: {course.description}</Text>
            <Text style={styles.courseDetails}>
              Attendance: {course.attendancePercentage}%
            </Text>

            {/* Toggle button for Attendance Records */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleAttendanceRecords(course.courseID)}
            >
              <Text style={styles.toggleButtonText}>
                {expandedCourse === course.courseID ? "Hide Records" : "Show Records"}
              </Text>
            </TouchableOpacity>

            {/* Display attendance records if expanded */}
            {expandedCourse === course.courseID && (
              <View style={styles.attendanceRecords}>
                {course.attendanceRecords.map((record, i) => (
                  <View key={i} style={styles.record}>
                    <Text>{new Date(record.date).toLocaleDateString()}</Text>
                    <Text>{record.status}</Text>
                  </View>
                ))}
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
    padding: 20,
    backgroundColor: "#f5f5f5", // Light background to complement the gradient
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333", // Darker text for contrast
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#777", // Slightly lighter for the subtitle
  },
  techItem: {
    marginBottom: 20, // More space between items for clarity
    borderRadius: 12, // More rounded corners for a modern look
    padding: 20, // Increase padding for more space inside
    elevation: 5, // Slight shadow to create depth
  },
  courseName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff", // White text for the course name to stand out
  },
  courseDetails: {
    fontSize: 16,
    color: "#fff", // Maintain white color for details for contrast
    marginTop: 5, // Added spacing between details
  },
  toggleButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#56CCF2", // Use a pleasant green for action button
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
    backgroundColor: "#ffffff", // Light background for attendance records
    borderRadius: 8, // Rounded corners for records section
  },
  record: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0", // Soft background for each record
    borderRadius: 5, // Rounded corners for each record
    marginVertical: 5, // Space between records
  },
});
