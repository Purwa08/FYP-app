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
import ProtectedRoute from "../../components/ProtectedRoute";

// Removed imports for turf and geolib

// Custom function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  lat1 = parseFloat(lat1.toFixed(6));
  lon1 = parseFloat(lon1.toFixed(6));
  lat2 = parseFloat(lat2.toFixed(6));
  lon2 = parseFloat(lon2.toFixed(6));

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c * 1000; // Distance in meters
};

const isLocationInPolygon = (lat, lon, polygon) => {
    let inside = false;
    const n = polygon.length;
  
    // Iterate over each edge of the polygon
    for (let i = 0, j = n - 1; i < n; j = i++) {
      // Get the coordinates for the current pair of vertices.
      // Note: polygon[i] is in [lat, lon] format.
      const yi = polygon[i][0],
            xi = polygon[i][1];
      const yj = polygon[j][0],
            xj = polygon[j][1];
  
      // Check if the point's latitude is between the latitudes of the edge's endpoints
      // and if the point is to the left of the edge.
      const intersect = ((yi > lat) !== (yj > lat)) &&
                        (lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
  
    return inside;
  };
  


// Winding Number Algorithm for Point-in-Polygon Check
const isLocationInPolygonWinding = (lat, lon, polygon) => {
    // Convert the point coordinates with consistent precision
    // const point = {
    //   x: parseFloat(lon.toFixed(6)),
    //   y: parseFloat(lat.toFixed(6)),
    // };
  
    // Convert polygon coordinates (assuming GeoJSON format where each coord is [longitude, latitude])
    const polygonCoords = polygon.coordinates[0].map(coord => ({
      x: parseFloat(coord[0].toFixed(6)),
      y: parseFloat(coord[1].toFixed(6)),
    }));
  
    let windingNumber = 0;
  
    // Loop through each edge of the polygon
    for (let i = 0; i < polygonCoords.length - 1; i++) {
      const current = polygonCoords[i];
      const next = polygonCoords[i + 1];
  
      // Check if the edge is an upward crossing
      if (current.y <= point.y && next.y > point.y) {
        if (isLeft(current, next, point) > 0) {
          windingNumber++;
        }
      }
      // Check if the edge is a downward crossing
      else if (current.y > point.y && next.y <= point.y) {
        if (isLeft(current, next, point) < 0) {
          windingNumber--;
        }
      }
    }
    // If winding number is non-zero, the point is inside the polygon.
    return windingNumber !== 0;
  };
  
  // Helper function: Returns a positive value if point p2 is left of the line from p0 to p1,
  // negative if to the right, and zero if the point is on the line.
  const isLeft = (p0, p1, p2) => {
    return (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
  };


  /**
 * Determines whether a point is within a polygon using the ray-casting algorithm,
 * including checks for edge cases where the point lies exactly on an edge.
 *
 * @param {Array} point - The point to test, in the form [x, y].
 * @param {Array} polygon - An array of points defining the polygon, each in the form [x, y]. 
 *                          The polygon should be closed (first and last point the same) or will be treated as such.
 * @returns {boolean} - Returns true if the point is inside the polygon or on its edge.
 */
function isPointInPolygon(lat, lon, polygon) {

  // Convert the point coordinates with consistent precision
    // const point = {
    //   x: parseFloat(lon.toFixed(6)),
    //   y: parseFloat(lat.toFixed(6)),
    // };
  //console.log("1\n")
    // // Convert polygon coordinates (assuming GeoJSON format where each coord is [longitude, latitude])
    // const polygonCoords = polygon.coordinates[0].map(coord => ({
    //   x: parseFloat(coord[0].toFixed(6)),
    //   y: parseFloat(coord[1].toFixed(6)),
    // }));
    //console.log("1\n")

  const px=lat;
  const py=lon;
  const point = [px, py];

  const epsilon = 1e-10;

  let polygonCoords=polygon.coordinates;
  // Ensure the polygon is closed by checking if the first and last coordinates are the same
  if (polygonCoords.length > 0) {
    const first = polygonCoords[0];
    const last = polygonCoords[polygonCoords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      polygonCoords.push(first);
      //console.log("loop\n")
    }
  }
  console.log("Polygon Coordinates:", polygonCoords);

  // Ensure polygon is closed
  const poly = polygonCoords;
  // if (poly.length > 0 && (poly[0][0] !== poly[poly.length - 1][0] || poly[0][1] !== poly[poly.length - 1][1])) {
  //   poly.push(poly[0]);
  //   console.log("loop\n")
  // }
  //console.log("1\n")

  // Compute bounding box for quick exclusion
  let minX = poly[0][0], maxX = poly[0][0],
      minY = poly[0][1], maxY = poly[0][1];
  for (let i = 1; i < poly.length; i++) {
    const [x, y] = poly[i];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  // Quick bounding box check
  if (px < minX - epsilon || px > maxX + epsilon || py < minY - epsilon || py > maxY + epsilon) {
    return false;
  }
  //console.log("1\n")

  // Helper function: check if point is on line segment between p1 and p2
  const isPointOnSegment = (p, p1, p2) => {//console.log("on\n")
    const [x, y] = p;
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    // Compute the cross product to check for collinearity
    const cross = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
    if (Math.abs(cross) > epsilon) return false;
    // Check if the point lies within the segment's bounding box
    const dot = (x - x1) * (x2 - x1) + (y - y1) * (y2 - y1);
    if (dot < 0) return false;
    const lenSq = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (dot > lenSq) return false;
    return true;
  };

  // Check if the point lies on any polygon edge
  for (let i = 0; i < poly.length - 1; i++) {
    if (isPointOnSegment(point, poly[i], poly[i + 1])) {//console.log("on\n")
      return true;
    }
  }

  // Ray-casting algorithm to count intersections
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    //console.log("for\n")
    // Check if the point's y coordinate is between the y-coordinates of the edge endpoints
    const intersect = ((yi > py) !== (yj > py)) &&
                      (px < ((xj - xi) * (py - yi)) / (yj - yi + epsilon) + xi);
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
}

  

// Custom geofencing logic using the custom functions above
const isStudentInsideGeofenceCustom = (studentLocation, geofence) => {
  const { latitude, longitude } = studentLocation;
  const { circle, polygon } = geofence;
  console.log(geofence);

  // --- Circular Geofence Check ---
  let insideCircle = true;
  if (circle) {
    const distance = calculateDistance(
      latitude,
      longitude,
      circle.latitude,
      circle.longitude
    );
    const circleDistanceError = distance - circle.radius;
    insideCircle = distance <= circle.radius;
    console.log(
      `Circle - Actual distance: ${distance} m, Allowed radius: ${circle.radius} m, Error: ${circleDistanceError} m`
    );
    console.log(`Is inside circle: ${insideCircle}`);
  }

  if(!insideCircle)
  {
    return insideCircle;
  }

  // --- Polygonal Geofence Check ---
  let insidePolygon = true;
  if (polygon && polygon.coordinates) {
    insidePolygon = isPointInPolygon(latitude, longitude, polygon);
    console.log(`Is inside polygon: ${insidePolygon}`);
  }
  return insideCircle && insidePolygon;
};

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
  const RETRY_DELAY_MS = 2000; // 2-second delay before retrying

  const getCurrentLocation = async () => {
    let retries = 0;
  
    while (retries < MAX_RETRIES) {
      try {
        const location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000, // Update every second
          distanceInterval: 0.5, // Update every meter
        });

        const { latitude, longitude, accuracy } = location.coords;
        console.log(`Current Location: 
        Latitude: ${latitude}, 
        Longitude: ${longitude}, 
        Accuracy: ${accuracy} meters`);

        // If accuracy is acceptable, return the precise location
        if (accuracy <= MAX_ALLOWED_ACCURACY) {
          return {
            latitude: parseFloat(latitude.toFixed(10)), // Ensure 10 decimal places
            longitude: parseFloat(longitude.toFixed(10))
          };
        }

        retries++;
        if (retries < MAX_RETRIES) {
          console.log(`Retrying... (${retries}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS)); // Wait before retrying
        }
      
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Unable to get location. Please try again.");
        return null;
      }
    }

    // If retries fail, show an alert and return null
    Alert.alert(
      "Poor GPS Accuracy",
      "GPS accuracy is too low. Keep your device stable, enable Wi-Fi, then retry."
    );
    return null;
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

    const hasLocationPermission = await requestLocationPermission();
    if (!hasLocationPermission) {
      setIsProcessing(false); // Re-enable button if location permission fails
      Alert.alert(
        "Location Permission Denied",
        "You need to enable location permission to mark attendance.");
      return;
    }

    const studentLocation = await getCurrentLocation();
    if (!studentLocation) {
      setIsProcessing(false); // Re-enable button if location is unavailable
      Alert.alert(
        "Location Error",
        "Unable to get your location.");
      return;
    }

    if (studentLocation && geofence) {
      const isInsideGeofence = isStudentInsideGeofenceCustom(studentLocation, geofence);

      if (!isInsideGeofence) {
        Alert.alert("Location Error",
          "You are outside the designated attendance area. Please move inside the classroom.");
        setIsProcessing(false); // Re-enable button if outside geofence
        return; // Stop the process if the student is not within the geofence
      }
    }

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
            <Text style={[styles.subtitle, { fontWeight: "bold", color: "#003366" }]}>Faculty:</Text>
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
