import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import Login from "./screens/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const login = await AsyncStorage.getItem("login");
        setIsAuthenticated(!!login);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false); // Fallback in case of error
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("./(tabs)/chats");
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <Login />;
}
