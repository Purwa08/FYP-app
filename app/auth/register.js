import React, { useEffect } from "react";
import { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../(services)/api/api";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../(redux)/authSlice";

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8, "Too Short!").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const Register = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const mutation = useMutation({
    mutationFn: registerUser,
    mutationKey: ["register"],
  });

  console.log(mutation);
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        {mutation?.isError ? (
          <Text style={styles.errorText}>
            {mutation?.error?.response?.data?.message || "Registration failed"}
          </Text>
        ) : null}
        {mutation?.isSuccess ? (
          <Text style={styles.successText}>Registration successful</Text>
        ) : null}

        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={(values) => {
            const data = {
              email: values.email,
              password: values.password,
            };
            mutation
              .mutateAsync(data)
              .then(() => {
                setMessage("Registration successful!");
                setMessageType("success");
                setTimeout(() => {
                  setMessage("");
                  router.push("/(tabs)");
                }, 2000); // Redirect after 2 seconds
              })
              .catch((error) => {
                setMessage(error?.response?.data?.message);
                setMessageType("error");
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
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                secureTextEntry
              />
              {errors.confirmPassword && touched.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={mutation.isLoading}
              >
                {mutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Register</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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