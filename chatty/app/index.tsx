import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Login from "./screens/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Network from "expo-network";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isconnected, setIsconnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const conn = await Network.getNetworkStateAsync();
        if (conn.isInternetReachable) {
          setIsconnected(true);
        }

        const login = await AsyncStorage.getItem("login");
        setIsAuthenticated(!!login);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
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

  if (isAuthenticated) {
    return null; // Navigation is handled in the useEffect above
  }

  return <Login />;
}
