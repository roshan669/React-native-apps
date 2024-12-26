import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import ToastManager from "toastify-react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="screens/setAvatar"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screens/signup"
          options={{ headerShown: false, animation: "simple_push" }}
        />
        <Stack.Screen name="screens/login" options={{ headerShown: false }} />
      </Stack>
      <ToastManager />
    </>
  );
}
