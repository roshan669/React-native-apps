import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { Toast } from "toastify-react-native";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSignup = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      const response = await fetch(
        "https://server-27op.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, username }),
        }
      );
      const text = await response.text();

      const data = text ? JSON.parse(text) : {};
      if (data.status == true) {
        Toast.success(data.msg, "top");
        router.replace("/");
      } else {
        Toast.error(data.msg, "top");
      }
    } catch (error) {
      Toast.error("Something went wrong", "top");
    }
  };

  const onSignupPress = () => {
    if (email && password && username) {
      if (password.length < 6) {
        Toast.error("Invalid Password", "top");
        return;
      }
      if (username.length < 3 || username.includes(" ")) {
        Toast.error("Invalid Username", "top");
        return;
      }
      if (!email.includes("@")) {
        Toast.error("Please enter a valid email", "top");
        return;
      }
      handleSignup(email, password, username);
    } else {
      Toast.error("Please enter all fields", "top");
    }
  };
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Hello There!</Text>
          <TextInput
            style={[styles.input, styles.shadow]}
            placeholder="Username"
            keyboardType="email-address"
            onChangeText={setUsername}
          />
          <TextInput
            style={[styles.input, styles.shadow]}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, styles.shadow]}
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={onSignupPress}
            style={[styles.button, styles.shadow]}
          >
            <Text style={styles.buttonText}>Sign Me Up</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Link href={"/"} style={styles.link}>
              Already Have An account? Login
            </Link>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#FF4500",
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
  },
  shadow: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
