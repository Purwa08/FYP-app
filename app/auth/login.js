import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../(services)/api/api";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../(redux)/authSlice";
import * as Device from "expo-device";


const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(8, "Too Short!").required("Required"),
  });

const Login = () => {
  const router = useRouter();
  //dispatch
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: loginUser,
    mutationKey: ["login"],
  });


  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    
    if (user && user.firstLogin) {
      console.log(user.firstLogin)
      router.push(`/auth/reset-password/${user.student._id}`);
      
    }
    else if(user && !user.firstLogin)
    {
      console.log(user.firstLogin)
      router.push("/(tabs)");
    }
  }, [user]);
  console.log("user", user);

  // Function to get device ID
  const getDeviceId = async () => {
    try {
      const deviceId = Device.osInternalBuildId || Device.osBuildId || Device.deviceName;
      console.log("Device ID:", deviceId);
      return deviceId;
    } catch (error) {
      console.error("Error getting device ID:", error);
      Alert.alert("Error", "Unable to get device information.");
      return null;
    }
  };

  return (
    <View style={styles.container}>
       <Text style={styles.title}>Login</Text>

      {mutation?.isError ? (
        <Text style={styles.errorText}>
          {mutation?.error?.response?.data?.message}
        </Text>
      ) : null} 
      {mutation?.isSuccess ? (
        <Text style={styles.successText}>
          {mutation?.error?.response?.data?.message}
        </Text>
      ) : null}

      <Formik
        initialValues={{ email: "student1@gmail.com", password: "student1" }}
        validationSchema={LoginSchema}

        onSubmit={(values) => {
          console.log(values);
          mutation
            .mutateAsync(values)
            .then((data) => {
              console.log("data", data);
              dispatch(loginAction(data));

              if (data.firstLogin) {
                // If it's the user's first login, navigate to reset password screen
                router.push(`/auth/reset-password/${data.student._id}`);
              } else {
                // Otherwise, navigate to the home screen
                router.push("/(tabs)");
              }
              //router.push("/(tabs)");
            })
            .catch((err) => {
              console.log(err);
            });
          
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              keyboardType="email-address"
            />
            {errors.email && touched.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              
              disabled={mutation.isLoading}
            >
              
              {mutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )} 
            </TouchableOpacity>
            
          </View>
        )}
      </Formik>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f5f5f5",
      },
      title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 24,
      },
      form: {
        width: "100%",
      },
      input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#fff",
      },
      errorText: {
        color: "red",
        marginBottom: 16,
      },
      button: {
        height: 50,
        backgroundColor: "#6200ea",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 16,
      },
      buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
      },
})