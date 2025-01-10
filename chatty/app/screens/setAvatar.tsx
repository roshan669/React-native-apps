import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
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
  const [refresh, setRefresh] = useState(false); // Initialize to false
  const router = useRouter();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function checkAuth() {
      try {
        const auth = await AsyncStorage.getItem("login");
        if (!auth) {
          router.replace("/");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    async function fetchAvatars() {
      try {
        setIsLoading(true);
        const requests = [];
        for (let i = 0; i < 4; i++) {
          const randomId = Math.round(Math.random() * 10000);
          const url = `${api}/${randomId}.png`;
          requests.push(url);
        }
        setAvatars(requests);
        setIsLoading(false);
      } catch (error) {
        Toast.error("Check your internet ", "top");
      }
    }
    fetchAvatars();
  }, [refresh]);

  const rotateInterpolate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      Toast.error("Please select an avatar", "top");
    } else {
      try {
        setIsLoading(true);
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
            router.replace("../(tabs)/chats");
          } else {
            Toast.error("Error setting avatar", "top");
          }
          setIsLoading(!isLoading);
        } else {
          Toast.error("User not found", "top");
        }
      } catch (error) {
        Toast.error("Error setting avatar", "top"); // Handle fetch errors
        console.error("Error setting avatar:", error);
        setIsLoading(!isLoading);
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
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.btncontainer}>
            <TouchableOpacity
              style={styles.refreshIcon}
              onPress={() => {
                setRefresh(!refresh);
                setSelectedAvatar(undefined);
              }}
            >
              <Text style={styles.refreshtxt}>Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={setProfilePicture}
              style={styles.submitBtn}
            >
              <Text style={styles.submitText}>Set as Profile picture</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 50,

    marginTop: 10,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    textTransform: "uppercase",
  },
  avatars: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    alignItems: "center",
    width: "95%",
  },
  avatar: {
    width: "40%", // Each avatar takes up 45% of the container width (with some margin for spacing)
    aspectRatio: 1, // Maintain aspect ratio (important for circles)
    borderWidth: 4,
    borderColor: "#fff",
    padding: 4,
    borderRadius: 70,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  selectedAvatar: {
    borderColor: "#FF4500",
  },
  btncontainer: {
    flexDirection: "column",
    marginTop: 40,
  },
  submitBtn: {
    marginTop: 40,
    backgroundColor: "#FF4500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  refreshIcon: {
    marginTop: 20,

    backgroundColor: "#FF4500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 20,
    marginRight: 20,
  },
  refreshtxt: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    textTransform: "uppercase",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
