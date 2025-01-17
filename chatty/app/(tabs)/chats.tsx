import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Network from "expo-network";
import { Toast } from "toastify-react-native";

interface User {
  _id: string;
  isAvatarImageSet: boolean;
}
interface Contact {
  _id: string;
  username: string;
  avatarImage: string;
}
export default function Chats() {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState<number | undefined>(
    undefined
  );
  const [refreshing, setRefreshing] = useState(false);
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
      const internet = await Network.getNetworkStateAsync();
      if (!internet.isInternetReachable) {
        Toast.error("No internet..");
      }
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          setLoading(true);
          const response = await fetch(
            `https://server-27op.onrender.com/api/auth/allusers/${currentUser._id}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
          const data = await response.json();
          setLoading(false);
          setContacts(data);
        } else {
          router.replace("../screens/setAvatar");
        }
      }
    }
    post();
  }, [currentUser]);

  useEffect(() => {
    async function run() {
      const res = await AsyncStorage.getItem("login");

      if (res) {
        const data = JSON.parse(res);
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
      }
    }
    run();
  }, []);

  const changeCurrentChat = (key: Contact) => {
    router.push({
      pathname: "../screens/Chat",
      params: { SelectedUser: JSON.stringify(key) },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loader} size="large" color="#ff5a5f" />
      </View>
    );
  }

  const handleLongPress = async () => {
    // if (currentUser) {
    //   if (currentUser.isAvatarImageSet) {
    //     setLoading(true);
    //     const response = await fetch(
    //       `https://server-27op.onrender.com/api/auth/delmsg`,
    //       {
    //         method: "DELETE",
    //         headers: { "Content-Type": "application/json" },
    //         body:{to:currentUser._id,from:sel}
    //       }
    //     );
    //     const data = await response.json();
    //   }}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brand}>
        <Ionicons
          size={33}
          name="chatbubble-ellipses-outline"
          color={"#FF4500"}
        />
        <Text style={styles.brandText}>Chatter</Text>
        <Text style={styles.headertxt}>
          ALL USERS <View style={styles.onlineindicator}></View>
        </Text>
      </View>

      <ScrollView style={styles.contacts}>
        {contacts.map((contact, index) => (
          <TouchableOpacity
            key={contact._id}
            style={[
              styles.contact,
              currentSelected === index && styles.selected,
            ]}
            onPress={() => changeCurrentChat(contact)}
            onLongPress={handleLongPress}
          >
            <Image
              source={{
                uri: `${contact.avatarImage}`,
              }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{contact.username}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  headertxt: {
    marginLeft: 50,
    alignContent: "flex-end",
    color: "#FFF",
    marginTop: 6,
    backgroundColor: "#FF4500",
    height: 20,
    textAlign: "center",
    width: 120,
    borderRadius: 10,
    fontWeight: "bold",
  },
  onlineindicator: {
    alignContent: "flex-start",
    backgroundColor: "#00ff4d",
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  brand: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 10,
    marginLeft: 10,
  },
  brandText: {
    color: "white",
    textTransform: "uppercase",
    marginLeft: 10,

    fontWeight: "bold",
    fontSize: 23,
  },
  contacts: {
    flex: 1,
  },
  contact: {
    height: 70,
    backgroundColor: "#25292d",
    minHeight: 70,
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#FFF",
  },
  selected: {
    backgroundColor: "#ff4500",
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  username: {
    color: "white",
    marginLeft: 14,
    fontWeight: "bold",
    fontSize: 18,
  },
  currentUser: {
    backgroundColor: "#0d0d30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  currentAvatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  currentUsername: {
    color: "white",
    marginLeft: 10,
    fontSize: 18,
  },
});
