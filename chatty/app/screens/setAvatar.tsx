import { Text, View } from "react-native";
import React, { Component, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function setAvatar() {
  const router = useRouter();
  useEffect(() => {
    async function checkAuth() {
      const auth = await AsyncStorage.getItem("login");
      if (!auth) {
        router.replace("./login"); // Corrected the navigation path
      }
    }
    checkAuth();
  }, [router]);
  return (
    <SafeAreaView>
      <View>
        <Text>setAvatar</Text>
      </View>
    </SafeAreaView>
  );
}
