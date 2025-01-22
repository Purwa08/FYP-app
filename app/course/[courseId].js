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
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';


const CoursePage = () => {
  const { courseId } = useLocalSearchParams(); // Extract courseId from the URL
  const [courseDetails, setCourseDetails] = useState(null); // State for course data
  const [loading, setLoading] = useState(true); // Loading state
  const [isWindowOpen, setIsWindowOpen] = useState(false); // Window status
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false); // Attendance marked status
  const [statusMessage, setStatusMessage] = useState(""); // Message to display
  const user = useSelector((state) => state.auth.user);
  const [geofence, setGeofence] = useState(null); // Add this line


  const checkBiometricSupport = async () => {
    const hasBiometrics = await LocalAuthentication.hasHardwareAsync(); // Check if the device supports biometrics
    if (!hasBiometrics) {
      Alert.alert("Error", "Biometric authentication is not supported on this device.");
      return false;
    }
  
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync(); // Get supported biometric types
    if (supportedTypes.length === 0) {
      Alert.alert("Error", "No supported biometric types available.");
      return false;
    }

    const hasFingerprint = supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
    const hasFaceID = supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
  
    if (hasFaceID) {
      console.log("Face ID is available (iOS)");
    } else if (hasFingerprint) {
      console.log("Fingerprint authentication is available");
    }
  
    return true;
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync(); // Request permission for foreground access to location
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to mark attendance.');
      return false;
    }
    return true;
  };

  
  // const getCurrentLocation = async () => {
  //   try {
  //     const location = await Location.getCurrentPositionAsync({
  //       accuracy: Location.Accuracy.High, // Request high accuracy for location
  //     });
  //     return location.coords; // Returns latitude and longitude
  //   } catch (error) {
  //     console.error('Error getting location:', error);
  //     Alert.alert('Error', 'Unable to get location. Please try again.');
  //     return null;
  //   }
  // };
  

  // const calculateDistance = (lat1, lon1, lat2, lon2) => {
  //   const toRad = (value) => (value * Math.PI) / 180; // Helper function to convert degrees to radians
  //   const R = 6371; // Radius of the Earth in kilometers
  
  //   const dLat = toRad(lat2 - lat1);
  //   const dLon = toRad(lon2 - lon1);
  
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
  //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  //   const distance = R * c; // Distance in kilometers
  //   return distance * 1000; // Return distance in meters
  // };
  

  // const isStudentInsideGeofence = (studentLocation, geofence) => {
  //   const { latitude, longitude } = studentLocation;
  //   console.log("latitude: ", latitude, "longitude: ", longitude)
  //   const { latitude: courseLat, longitude: courseLong, radius } = geofence;
  //   console.log(geofence)
  
  //   // const distance = Location.distance(
  //   //   { latitude, longitude },
  //   //   { latitude: courseLat, longitude: courseLong }
  //   // );

  //   const distance = calculateDistance(latitude, longitude, courseLat, courseLong);

  //   console.log("distance: ",distance);
  
  //   return distance <= radius;  // Check if the student is within the geofence radius
  // };
  
  const MAX_ALLOWED_ACCURACY = 25;
  const MAX_RETRIES = 3;  // Retry limit for location
  
  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        enableHighAccuracy:true,
        accuracy: Location.Accuracy.BestForNavigation,  // Max accuracy

        timeInterval: 1000, // Update every second
      distanceInterval: 1, // Update every meter
      });
  
      const { latitude, longitude, accuracy } = location.coords;
  
      // Limit to 7 decimal places for precision
      const roundedLatitude = parseFloat(latitude.toFixed(7));
      const roundedLongitude = parseFloat(longitude.toFixed(7));
  
      console.log(`📍 Current Location: Lat: ${roundedLatitude}, Lon: ${roundedLongitude}`);
      console.log(`📏 GPS Accuracy: ±${accuracy} meters`);

      // if (accuracy > MAX_ALLOWED_ACCURACY) {
      //   Alert.alert(
      //     "Poor GPS Accuracy",
      //     `Your current GPS accuracy is ±${Math.round(accuracy)}m. Please move to an open area or enable Wi-Fi.`
      //   );
      //   return null; // Reject the location if accuracy is too low
      // }
  
      return { latitude: roundedLatitude, longitude: roundedLongitude };
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get location. Please try again.');
      return null;
    }
  };
  
  // Updated Haversine Formula with rounding
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
  
    // Round all values to 5 decimal places
    lat1 = parseFloat(lat1.toFixed(7));
    lon1 = parseFloat(lon1.toFixed(7));
    lat2 = parseFloat(lat2.toFixed(7));
    lon2 = parseFloat(lon2.toFixed(7));
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c * 1000; // Distance in meters
  };
  
  // Updated Geofence Validation
  const isStudentInsideGeofence = (studentLocation, geofence) => {
    const { latitude, longitude } = studentLocation;
    const { latitude: courseLat, longitude: courseLong, radius } = geofence;
  
    // Ensure geofence coordinates are rounded
    const roundedCourseLat = parseFloat(courseLat.toFixed(7));
    const roundedCourseLong = parseFloat(courseLong.toFixed(7));
  
    const distance = calculateDistance(latitude, longitude, roundedCourseLat, roundedCourseLong);
  
    console.log(`📏 Distance to Geofence Center: ${distance.toFixed(2)} meters`);
  
    return distance <= radius;
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseData = await getCourseDetails(courseId);
        setCourseDetails(courseData);
        setGeofence(courseData.geofence);  // Store geofence data
        //console.log(courseData);

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

  // const markAttendanceHandler = async () => {
  //   try {
  //     await markAttendance(courseId, user.student._id);
  //     setIsAttendanceMarked(true);
  //     setStatusMessage("✅ You have already marked attendance for today.");
  //     Alert.alert("Success", "Attendance marked successfully!");
  //   } catch (error) {
  //     console.error("Error marking attendance:", error);
  //     Alert.alert("Error", "Unable to mark attendance. Please try again.");
  //   }
  // };

  const markAttendanceHandler = async () => {
    const isBiometricSupported = await checkBiometricSupport(); // Check if biometric authentication is supported
  
    if (!isBiometricSupported) {
      Alert.alert(
        "Biometric Required",
        "Your device does not support biometric authentication. Attendance cannot be marked."
      );
      return; // If biometric authentication is not supported, stop the process
    }

  const hasLocationPermission = await requestLocationPermission();
  if (!hasLocationPermission) {
    Alert.alert(
      "Location Permission Denied",
      "You need to enable location permission to mark attendance. Please enable it in your device settings."
    );
    return; // Stop if location permission is denied
  }

  const studentLocation = await getCurrentLocation(); // Get the student's current location
  if (!studentLocation) {
    Alert.alert(
      "Location Error",
      "Unable to get your location. Please check your GPS or try again later."
    );
    return;
  }

  if (studentLocation && geofence) {
    const isInsideGeofence = isStudentInsideGeofence(studentLocation, geofence);

    if (!isInsideGeofence) {
      Alert.alert("Location Error", 
        "You are outside the designated attendance area. Please move inside the classroom.");
      return; // Stop the process if the student is not within the geofence
    }
  }
    // Re-check Attendance Window Status (Edge Case Handling)
  const windowStatus = await getAttendanceWindowStatus(courseId, user.student._id);
  if (!windowStatus.isWindowOpen) {
    Alert.alert(
      "Attendance Window Closed",
      "The attendance window has been closed. You cannot mark attendance now."
    );
    return;
  }
  
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to mark attendance', // Message shown during authentication
        fallbackLabel: 'Use Passcode', // Label for fallback option
        disableDeviceFallback: false, // 🔒 Disables passcode fallback
      });
  
      if (result.success) {
        // If authentication is successful, proceed to mark attendance
        await markAttendance(courseId, user.student._id);
        setIsAttendanceMarked(true);
        setStatusMessage("✅ You have already marked attendance for today.");
        Alert.alert("Success", "Attendance marked successfully!");
      } else {
        Alert.alert("Authentication Failed", "Biometric authentication was not successful.");
      }
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
        <Text style={styles.courseInfo}>Latitude: {courseDetails.geofence.latitude}</Text>
        <Text style={styles.courseInfo}>Longitude: {courseDetails.geofence.longitude}</Text>
        <Text style={styles.courseInfo}>Radius: {courseDetails.geofence.radius}</Text>
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
