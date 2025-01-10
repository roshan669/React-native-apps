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
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, animation: "flip" }}
        />
        <Stack.Screen
          name="screens/setAvatar"
          options={{ headerShown: false, animation: "fade_from_bottom" }}
        />
        <Stack.Screen
          name="screens/signup"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="screens/login"
          options={{ headerShown: false, animation: "slide_from_left" }}
        />
        <Stack.Screen
          name="screens/Chat"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
      </Stack>
      <ToastManager
        showProgressBar={false}
        duration={1750}
        showCloseIcon={false}
      />
    </>
  );
}
