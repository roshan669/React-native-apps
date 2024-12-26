import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  _id: string;
  isAvatarImageSet: boolean;
}
export default function Chats() {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [constacts, setContacts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const auth = await AsyncStorage.getItem("login");
      if (!auth) {
        router.replace("/"); // Corrected the navigation path
      } else {
        setCurrentUser(JSON.parse(auth));
        setLoading(false); // Set loading to false once authentication is checked
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    async function post() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const response = await fetch(
            `https://server-27op.onrender.com/api/auth/allusers/${currentUser._id}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
          const data = await response.json();

          setContacts(data);
        } else {
          router.replace("../screens/setAvatar");
        }
      }
    }
    post();
  }, [currentUser]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff5a5f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Welcome,!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
});
