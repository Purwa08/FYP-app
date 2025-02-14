import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform
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
      console.log(user.firstLogin);
      router.push(`/auth/reset-password/${user.student._id}`);
    } else if (user && !user.firstLogin) {
      console.log(user.firstLogin);
      router.push("/(tabs)");
    }
  }, [user]);
  console.log("user", user);

  // Function to get device ID
  const getDeviceId = async () => {
    try {
      const deviceId =
        Device.osInternalBuildId || Device.osBuildId || Device.deviceName;
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
      <View style={styles.card}>
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
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f0f4f8",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Georgia",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 20,
    color: "#003366",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    width: "100%",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    backgroundColor: "#006A67",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  successText: {
    color: "green",
    marginBottom: 10,
  },
});