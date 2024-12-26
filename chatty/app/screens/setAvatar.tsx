import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "toastify-react-native";
const api = `https://robohash.org`;

export default function SetAvatar() {
  const [avatars, setAvatars] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<number | undefined>(
    undefined
  );
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const auth = await AsyncStorage.getItem("login");
      if (!auth) {
        router.replace("/");
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    async function fetchAvatars() {
      try {
        const requests = [];
        for (let i = 0; i < 4; i++) {
          const randomId = Math.round(Math.random() * 10000);
          const url = `${api}/${randomId}.png`; // Directly use the RoboHash URL
          requests.push(url);
        }
        setAvatars(requests);
        setIsLoading(false);
      } catch (error) {
        Toast.error("Check your internet ", "top");
      }
    }
    fetchAvatars();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      Toast.error("Please select an avatar", "top");
    } else {
      const userString = await AsyncStorage.getItem("login");
      if (userString) {
        const user = JSON.parse(userString);
        const response = await fetch(
          `https://server-27op.onrender.com/api/auth/setAvatar/${user._id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: avatars[selectedAvatar] }),
          }
        );
        const data = await response.json();
        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          await AsyncStorage.setItem("login", JSON.stringify(user));
          router.replace("../(tabs)/chats"); // Navigate to the Chats screen
        } else {
          Toast.error("Error setting avatar", "top");
        }
      } else {
        Toast.error("User not found", "top");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#ff4500" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Pick an avatar</Text>
          </View>
          <View style={styles.avatars}>
            {avatars.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatar,
                  selectedAvatar === index && styles.selectedAvatar,
                ]}
                onPress={() => setSelectedAvatar(index)}
              >
                <Image
                  source={{ uri: avatar }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                  onError={(error) => console.error("Image load error:", error)}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={setProfilePicture}
            style={styles.submitBtn}
          >
            <Text style={styles.submitText}>Set as Profile Picture</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131324",
    justifyContent: "center",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    textTransform: "uppercase",
  },
  avatars: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    height: "80%",
  },
  avatar: {
    borderWidth: 4,
    borderColor: "#fff",
    padding: 4,
    borderRadius: 60,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
  selectedAvatar: {
    borderColor: "#FF4500",
  },
  submitBtn: {
    marginTop: 50,
    backgroundColor: "#FF4500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
