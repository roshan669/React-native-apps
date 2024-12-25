import React, { useEffect, useState } from "react";
import { Image, Text } from "react-native";
import Login from "./screens/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const login = await AsyncStorage.getItem("login");
      if (login) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Use replace to navigate to the Chats screen and replace the current screen
      router.replace("./(tabs)/chats");
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return <Image source={{ uri: "../assets/images/loader (1).gif" }} />; // Display a loading screen or spinner if needed
  }

  return isAuthenticated ? null : <Login />;
}
