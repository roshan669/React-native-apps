import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface User {
  _id: string;
  isAvatarImageSet: boolean;
  avatarImage: string;
  username: string;
}

export default function AboutScreen() {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/");
  };

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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.titlecontainer}>
          <Ionicons name="person-circle-outline" size={33} color={"#FF4500"} />
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.content}>
          <Image
            style={styles.avatar}
            source={{ uri: currentUser?.avatarImage }}
          />
          <Text style={styles.name}>{currentUser?.username}</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={25} color={"#FFF"} />
          <Text style={styles.btntext}>Logout</Text>
        </TouchableOpacity>
        <Link style={styles.credit} href={"https://github.com/roshan669"}>
          <Ionicons name="logo-github" size={15} /> Roshan
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  titlecontainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 10,
    marginLeft: 10,
  },
  title: {
    color: "white",
    textTransform: "uppercase",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 23,
  },
  content: {
    backgroundColor: "#333333",
    borderRadius: 30,
    elevation: 10,
    width: "90%",
    height: "50%",
    marginTop: 5,
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center", // Center children horizontally
    flexDirection: "column",
  },
  name: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  avatar: {
    height: 200,
    width: 200,
    borderRadius: 100,
    borderColor: "#FFF",
    backgroundColor: "transparent",
    borderWidth: 2,
    alignSelf: "center", // Center the avatar horizontally
    marginTop: 30,
  },
  profileContainer: {
    flex: 1,
    flexDirection: "column",
    elevation: 10,
  },
  btn: {
    backgroundColor: "#FF4500",
    borderRadius: 14,
    marginTop: 100,
    width: "50%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    elevation: 10,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 1)",
    borderColor: "#FFF",
    flexDirection: "row",
  },
  btntext: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "light",
    marginLeft: 5,
  },
  credit: {
    textAlign: "center",
    marginTop: 80,
    color: "#FF4500",
    fontWeight: "bold",
    fontSize: 17,
  },
});
