import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { Toast } from "toastify-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";

export default function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (password: string, username: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://server-27op.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, username }),
        }
      );
      setLoading(false);
      console.log(response);
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      console.log(data);
      if (data.status == true) {
        Toast.success("You are in 😊!", "top");
        AsyncStorage.setItem("login", JSON.stringify(data.user));
        if (data.user) router.replace("../(tabs)/chats");
      } else {
        Toast.error(data.msg, "top");
      }
    } catch (error) {
      Toast.error("Something went wrong", "top");
    }
  };

  const onLoginPress = () => {
    if (loading) {
      return <ActivityIndicator size={"large"} />;
    }
    if (username && password) {
      handleLogin(password, username);
    } else {
      Toast.error("Please enter all fields", "top");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={100}
          color={"#FF4500"}
          style={styles.icon}
        />
        <Text style={styles.title}>CHATTY</Text>
        <TextInput
          style={[styles.input, styles.shadow]}
          placeholder="Username"
          keyboardType="email-address"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input, styles.shadow]}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={onLoginPress}
          style={[styles.button, styles.shadow]}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href={"./screens/signup"} style={styles.link}>
            Don't have an account? Signup
          </Link>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#333333",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontFamily: "Montserrat",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#AAA",
  },
  input: {
    width: "80%",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#aaa",
  },
  button: {
    backgroundColor: "#FF4500", // using the pleasing red color
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#007bff",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
  },
  shadow: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  icon: {
    elevation: 10,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  loader: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
});