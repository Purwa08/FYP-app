// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Image,
//   Alert,
//   StyleSheet,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { Ionicons } from "@expo/vector-icons";
// import { updateProfile } from "../(services)/api/api";
// import {updateUserProfile} from "../(redux)/authSlice.js";
// import { useDispatch } from "react-redux"; // Import useDispatch
// import { useNavigation } from '@react-navigation/native';

// export default function EditProfile() {
//   const user = useSelector((state) => state.auth.user);
//   const dispatch = useDispatch();
//   const navigation = useNavigation(); // Hook for navigation

//   // Handle the case when user is null (logged out)
//   if (!user) {
//     navigation.navigate('auth/login'); // Redirect to login if user is null
//     return null; // Render nothing while redirecting
//   }

//   const [name, setName] = useState(user.student.name || "");
//   const [email, setEmail] = useState(user.student.email || "");
//   const [phone, setPhone] = useState(user.student.phone || "");
//   const [rollno, setRollno] = useState(user.student.rollno || "");
//   const [batch, setBatch] = useState(user.student.batch || "");
//   const [branch, setBranch] = useState(user.student.branch || "");
//   const [year, setYear] = useState(user.student.year?.toString() || "");
//   const [semester, setSemester] = useState(user.student.semester?.toString() || "");
//   const [profileImage, setProfileImage] = useState(user.student.profileImage || "");
//   const [loading, setLoading] = useState(false);

//   const handleSaveChanges = async () => {
//     setLoading(true);
//     const updatedData = {
//       name,
//       email,
//       phone,
//       batch,
//       branch,
//       year: parseInt(year),
//       semester: parseInt(semester),
//       profileImage,
//     };

//     try {
//       const response = await updateProfile(user.student._id, updatedData);
//       console.log("API Response:", response);

//       if (response.success) { // Check if the response is successful
//         // Dispatch the action to update the user in Redux state
//         dispatch(updateUserProfile( {...user, student: updatedData,  // Ensure the full user object gets updated
//         }));
//         Alert.alert("Success", "Profile updated successfully!");
//       }

//     } catch (error) {
//       console.error("Error updating profile:", error);
//       Alert.alert("Error", "Failed to update profile. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Edit Profile</Text>

//       {/* Profile Image */}
//       <TouchableOpacity style={styles.imageContainer}>
//         {profileImage ? (
//           <Image source={{ uri: profileImage }} style={styles.profileImage} />
//         ) : (
//           <View style={styles.placeholderImage}>
//             <Ionicons name="person" size={64} color="#888" />
//           </View>
//         )}
//         <Text style={styles.changeImageText}>Change Profile Picture</Text>
//       </TouchableOpacity>

//       {/* Input Fields */}
//       <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
//       <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
//       <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
//       <TextInput style={styles.disabledInput} placeholder="Roll Number" value={rollno} editable={false} />
//       <TextInput style={styles.input} placeholder="Batch (e.g., 2021-2025)" value={batch} onChangeText={setBatch} />
//       <TextInput style={styles.input} placeholder="Branch" value={branch} onChangeText={setBranch} />
//       <TextInput style={styles.input} placeholder="Year (1-4)" value={year} onChangeText={setYear} keyboardType="numeric" />
//       <TextInput style={styles.input} placeholder="Semester (1-8)" value={semester} onChangeText={setSemester} keyboardType="numeric" />

//       {/* Save Button */}
//       <TouchableOpacity
//         style={styles.saveButton}
//         onPress={handleSaveChanges}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.saveButtonText}>Save Changes</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: "#f8f9fa",
//     alignItems: "center",
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 20,
//   },
//   imageContainer: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   placeholderImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: "#ccc",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   changeImageText: {
//     marginTop: 8,
//     color: "#007bff",
//     fontSize: 14,
//   },
//   input: {
//     width: "100%",
//     padding: 12,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   disabledInput: {
//     width: "100%",
//     padding: 12,
//     backgroundColor: "#e9ecef",
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   saveButton: {
//     backgroundColor: "#4CAF50",
//     width: "100%",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   saveButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Platform
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { updateProfile } from "../(services)/api/api"; // Corrected path to the API
import { updateProfileAction } from "../(redux)/authSlice";
import { useRouter } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";

const EditProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
    batch: "",
    branch: "",
    rollno: "",
    year: "",
    semester: "",
  });

  const [loading, setLoading] = useState(false);

  // Load user data into form on mount
  useEffect(() => {
    if (user && user.student) {
      setFormData({
        name: user.student.name || "",
        email: user.student.email || "",
        phone: user.student.phone || "",
        profileImage: user.student.profileImage || "",
        batch: user.student.batch || "",
        branch: user.student.branch || "",
        rollno: user.student.rollno || "",
        year: user.student.year?.toString() || "",
        semester: user.student.semester?.toString() || "",
      });
    }
  }, [user]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle profile update
  const handleSaveChanges = async () => {
    if (!formData.name || !formData.email || !formData.rollno) {
      Alert.alert("Error", "Name, Email, and Roll No are required.");
      return;
    }

    setLoading(true);

    try {
      // Call the backend API to update the profile
      const response = await updateProfile(user.student._id, formData);
      console.log("API Response:", response);

      if (response && response.updatedProfile) {
        // Update Redux state with new profile data
        dispatch(updateProfileAction(response.updatedProfile));

        Alert.alert("Success", "Profile updated successfully!");

        // Navigate back to Profile page
        router.push("/tabs/profile");
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003161" />
        <Text>Updating Profile...</Text>
      </View>
    );
  }

  return (
    <ProtectedRoute>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        {/* Profile Image */}
        <TouchableOpacity style={styles.imageContainer}>
          {formData.profileImage ? (
            <Image
              source={{ uri: formData.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="person" size={64} color="#888" />
            </View>
          )}
          <Text style={styles.changeImageText}>Change Profile Picture</Text>
        </TouchableOpacity>

        {/* <TextInput
          style={styles.input}
          placeholder="Name"
          value={formData.name}
          onChangeText={(text) => handleChange("name", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
          keyboardType="phone-pad"
        />

        {/* <TextInput
        style={styles.input}
        placeholder="Profile Image URL"
        value={formData.profileImage}
        onChangeText={(text) => handleChange("profileImage", text)}
      /> */}

        {/*<TextInput
          style={styles.input}
          placeholder="Batch (e.g., 2021-2025)"
          value={formData.batch}
          onChangeText={(text) => handleChange("batch", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Branch"
          value={formData.branch}
          onChangeText={(text) => handleChange("branch", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Roll Number"
          value={formData.rollno}
          onChangeText={(text) => handleChange("rollno", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Year (1-4)"
          value={formData.year}
          onChangeText={(text) => handleChange("year", text)}
          keyboardType="number-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Semester (1-8)"
          value={formData.semester}
          onChangeText={(text) => handleChange("semester", text)}
          keyboardType="number-pad"
        /> */}

        {[
          { label: "Name", key: "name" },
          { label: "Email", key: "email", keyboardType: "email-address" },
          { label: "Phone Number", key: "phone", keyboardType: "phone-pad" },
          { label: "Batch", key: "batch" },
          { label: "Branch", key: "branch" },
          { label: "Roll Number", key: "rollno" },
          { label: "Year", key: "year", keyboardType: "number-pad" },
          { label: "Semester", key: "semester", keyboardType: "number-pad" },
        ].map((field) => (
          <View key={field.key}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={field.label}
              value={formData[field.key]}
              onChangeText={(text) => handleChange(field.key, text)}
              keyboardType={field.keyboardType || "default"}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </ProtectedRoute>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
    alignItems: "left",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    alignItems: "center",
    marginBottom: 10,    
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Georgia",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 5,
    textAlign: "center",
    color: "#003366",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Arial",
    color: "#333",
    alignSelf: "flex-start",
    marginLeft: "1%",
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bbb",
    width: "100%",
    fontSize: 16,
    fontFamily: "Verdana",
    marginBottom: 12,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#003366",
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  changeImageText: {
    marginTop: 8,
    color: "#005B96",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#00796B",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});