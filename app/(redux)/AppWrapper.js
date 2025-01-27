import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Stack } from "expo-router/stack";
import { loadUser } from "./authSlice";
// import { ThemeProvider } from '../context/ThemeContext';

function AppWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    // <ThemeProvider> 
    <Stack screenOptions={{
      headerShown: false, // Disable headers globally
    }}>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen name="auth/login" options={{ headerShown: true, title: "Login", headerBackTitle: "Back", gestureEnabled: false }} />
    </Stack>
    // </ThemeProvider>
  );
}

export default AppWrapper;