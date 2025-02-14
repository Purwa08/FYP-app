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
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  getCourseDetails,
  getAttendanceWindowStatus,
  markAttendance,
} from "../(services)/api/api";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import * as Location from "expo-location";
import turf from "@turf/turf";
import ProtectedRoute from "../../components/ProtectedRoute";

const CoursePage = () => {
  const { courseId } = useLocalSearchParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [geofence, setGeofence] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const checkBiometricSupport = async () => {
    const hasBiometrics = await LocalAuthentication.hasHardwareAsync();

    if (!hasBiometrics) {
      Alert.alert(
        "Error",
        "Biometric authentication is not supported on this device."
      );
      return false;
    }

    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (supportedTypes.length === 0) {
      Alert.alert("Error", "No supported biometric types available.");
      return false;
    }

    // const hasFingerprint = supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
    // const hasFaceID = supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);

    // if (hasFaceID) {
    //   console.log("y\n")
    //   console.log("Face ID is available (iOS)");
    // } else if (hasFingerprint) {
    //   console.log("y\n")
    //   console.log("Fingerprint authentication is available");
    // }

    return true;
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to mark attendance."
      );
      return false;
    }
    return true;
  };

  const MAX_ALLOWED_ACCURACY = 25;
  const MAX_RETRIES = 3; // Retry limit for location

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000, // Update every second
        distanceInterval: 1, // Update every meter
      });
      const { latitude, longitude, accuracy } = location.coords;
      console.log(`Current Location: 
        Latitude: ${latitude}, 
        Longitude: ${longitude}, 
        Accuracy: ${accuracy} meters`);

      // if (accuracy > MAX_ALLOWED_ACCURACY) {
      //   Alert.alert(
      //     "Poor GPS Accuracy",
      //     Your current GPS accuracy is ±${Math.round(accuracy)}m. Please move to an open area or enable Wi-Fi.
      //   );
      //   return null; // Reject the location if accuracy is too low
      // }

      return {
        latitude: parseFloat(latitude.toFixed(7)),
        longitude: parseFloat(longitude.toFixed(7)),
      };
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Unable to get location. Please try again.");
      return null;
    }
  };

  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;

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

  // Check if the student's location is within the polygon
  const isLocationInPolygon = (lat, lon, polygon) => {
    const polygonCoords = polygon.coordinates[0];
    let inside = false;

    for (
      let i = 0, j = polygonCoords.length - 1;
      i < polygonCoords.length;
      j = i++
    ) {
      const xi = polygonCoords[i][0],
        yi = polygonCoords[i][1];
      const xj = polygonCoords[j][0],
        yj = polygonCoords[j][1];

      const intersect =
        yi > lon !== yj > lon &&
        lon < ((xj - xi) * (lon - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Check if the student is inside the geofence (circle or polygon)
  const isStudentInsideGeofence = (studentLocation, geofence) => {
    const { latitude, longitude } = studentLocation;
    const { circle, polygon } = geofence;
    console.log(geofence);

    //  // Ensure geofence coordinates are rounded
    //  const roundedCourseLat = parseFloat(circle.latitude.toFixed(7));
    //  const roundedCourseLong = parseFloat(circle.longitude.toFixed(7));

    //  const distance = calculateDistance(latitude, longitude, roundedCourseLat, roundedCourseLong);

    //  console.log(📏 Distance to Geofence Center: ${distance.toFixed(2)} meters);

    //  return distance <= circle.radius;

    // // Check for circular geofence
    // if (circle) {
    //   const distance = calculateDistance(latitude, longitude, circle.latitude, circle.longitude);
    //   console.log("DISTANCE", distance);
    //   if (distance > circle.radius) return false;

    // }

    // // Check for polygonal geofence
    // if (polygon && polygon.coordinates) {
    //   return isLocationInPolygon(latitude, longitude, polygon);
    // }

    // Circle geofence check using Turf.js
    const studentPoint = turf.point([longitude, latitude]);
    const circleCenter = turf.point([circle.longitude, circle.latitude]);
    const circleRadius = circle.radius;
    const isInsideCircle =
      turf.distance(studentPoint, circleCenter, { units: "meters" }) <=
      circleRadius;
    console.log(`📍 Checking Circle Geofence: Inside = ${isInsideCircle}`);

    // Polygon geofence check using Turf.js
    const polygonArea = turf.polygon([polygon.coordinates]);
    const isInsidePolygon = turf.booleanPointInPolygon(
      studentPoint,
      polygonArea
    );
    console.log(`📍 Checking Polygon Geofence: Inside = ${isInsidePolygon}`);

    return isInsideCircle && isInsidePolygon;

    //return false;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourseDetails(courseId);
        setCourseDetails(courseData);
        setGeofence(courseData.geofence);
        //console.log(courseData);

        const windowStatus = await getAttendanceWindowStatus(
          courseId,
          user.student._id
        );
        if (windowStatus.isAttendanceMarked) {
          setIsAttendanceMarked(true);
          setStatusMessage("✅ You have already marked attendance for today.");
        } else {
          setIsWindowOpen(windowStatus.isWindowOpen);
          setStatusMessage(
            windowStatus.isWindowOpen
              ? "🟢 Attendance window is open."
              : "🔴 Attendance window is closed."
          );
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
      const windowStatus = await getAttendanceWindowStatus(
        courseId,
        user.student._id
      );
      if (windowStatus.isAttendanceMarked) {
        setIsAttendanceMarked(true);
        setStatusMessage("✅ You have already marked attendance for today.");
      } else {
        setIsWindowOpen(windowStatus.isWindowOpen);
        setStatusMessage(
          windowStatus.isWindowOpen
            ? "🟢 Attendance window is open."
            : "🔴 Attendance window is closed."
        );
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
    if (isProcessing) return; // Prevent double clicking
    setIsProcessing(true); // Disable button

    const isBiometricSupported = await checkBiometricSupport();

    if (!isBiometricSupported) {
      setIsProcessing(false); // Re-enable button if biometrics fail
      Alert.alert(
        "Biometric Required",
        "Your device does not support biometric authentication. Attendance cannot be marked."
      );
      return;
    }

    // const hasLocationPermission = await requestLocationPermission();
    // if (!hasLocationPermission) {
    //   setIsProcessing(false); // Re-enable button if location permission fails
    //   Alert.alert(
    //     "Location Permission Denied",
    //     "You need to enable location permission to mark attendance.");
    //   return;
    // }

    // const studentLocation = await getCurrentLocation();
    // if (!studentLocation) {
    //   setIsProcessing(false); // Re-enable button if location is unavailable
    //   Alert.alert(
    //     "Location Error",
    //     "Unable to get your location.");
    //   return;
    // }

    // if (studentLocation && geofence) {
    //   const isInsideGeofence = isStudentInsideGeofence(studentLocation, geofence);

    //   if (!isInsideGeofence) {
    //     Alert.alert("Location Error",
    //       "You are outside the designated attendance area. Please move inside the classroom.");
    //       setIsProcessing(false); // Re-enable button if outside geofence
    //     return; // Stop the process if the student is not within the geofence
    //   }
    // }

    // Re-check Attendance Window Status (Edge Case Handling)
    const windowStatus = await getAttendanceWindowStatus(
      courseId,
      user.student._id
    );
    if (!windowStatus.isWindowOpen) {
      Alert.alert(
        "Attendance Window Closed",
        "The attendance window has been closed. You cannot mark attendance now."
      );
      setIsProcessing(false);
      return;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to mark attendance",
        fallbackLabel: "Use Passcode",
        disableDeviceFallback: false,
      });

      if (result.success) {
        await markAttendance(courseId, user.student._id);
        setIsAttendanceMarked(true);
        setStatusMessage("✅ You have already marked attendance for today.");
        Alert.alert("Success", "Attendance marked successfully!");
      } else {
        Alert.alert(
          "Authentication Failed",
          "Biometric authentication was not successful."
        );
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      Alert.alert("Error", "Unable to mark attendance. Please try again.");
    } finally {
      setIsProcessing(false); // Re-enable button after the process ends
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#003161" />
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Course Details</Text>
          <Text style={styles.subtitle}>
            <Text style={[styles.subtitle, { fontWeight: "bold",color: "#003366"  }]}>Faculty:</Text>
            {courseDetails.facultyId.username}
          </Text>
          
        </View>
        <View style={styles.card}>
          <Text style={styles.courseTitle}>{courseDetails.name}</Text>
          <Text style={styles.courseInfo}>Code: {courseDetails.code}</Text>
          <Text style={styles.courseInfo}>
            Description: {courseDetails.description}
          </Text>
          <Text style={styles.courseInfo}>
            Latitude: {courseDetails.geofence.circle.latitude}
          </Text>
          <Text style={styles.courseInfo}>
            Longitude: {courseDetails.geofence.circle.longitude}
          </Text>
          <Text style={styles.courseInfo}>
            Radius: {courseDetails.geofence.circle.radius}
          </Text>
        </View>

        <View style={styles.attendanceContainer}>
          <View style={styles.statusRow}>
            <Text style={styles.statusMessage}>{statusMessage}</Text>
            {!isAttendanceMarked && (
              <TouchableOpacity
                onPress={refreshStatusHandler}
                style={styles.refreshButton}
              >
                <MaterialIcons name="refresh" size={24} color="#00796B" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {!isAttendanceMarked && isWindowOpen && (
          <TouchableOpacity
            style={styles.attendanceButton}
            onPress={markAttendanceHandler}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.attendanceButtonText}>Mark Attendance</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ProtectedRoute>
  );
};

export default CoursePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 16,
  },
  header: {
    paddingTop: 40, // To bring the header down from the top of the screen
    paddingBottom: 20,
    alignItems: "center",
    marginBottom: 10,
    elevation: 5, // Adding elevation for a shadow effect
    
  },
  subtitle: {
    fontSize: 19,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: "Arial",
    textAlign: "center",
    color: "#6E7570",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Georgia",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 15,
    textAlign: "center",
    color: "#003366",
  },

  courseID: {
    fontSize: 18,
    color: "#555",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#003161",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  courseInfo: {
    fontSize: 16,
    fontFamily: "Palatino",
    color: "#555",
    marginTop: 5,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Times New Roman",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: "#003161",
  },

  attendanceContainer: {
    //flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    flexWrap: "wrap"
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusMessage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
  },
  attendanceButton: {
    backgroundColor: "#00796B",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  attendanceButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  refreshButton: {
    marginLeft: Platform.OS === 'ios' ? 50 : 10,
    padding: 5,
    borderRadius: 5,
  },
});