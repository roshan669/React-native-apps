import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { io } from "socket.io-client";

interface Message {
  id: string;
  fromSelf: boolean;
  message: string;
}

export default function Chat() {
  const { SelectedUser } = useGlobalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<Message | null>(null);
  // Parse SelectedUser from JSON string to object
  const selectedUser = SelectedUser ? JSON.parse(SelectedUser as string) : null;
  const router = useRouter();
  const socket = io("https://server-27op.onrender.com");
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    async function run() {
      const res = await AsyncStorage.getItem("login");
      const data = JSON.parse(res as string);

      const response = await fetch(
        "https://server-27op.onrender.com/api/messages/getmsg",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ from: data._id, to: selectedUser._id }),
        }
      );
      console.log(messages);
      const result = await response.json();
      setMessages(result);
    }
    if (selectedUser) {
      run();
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      socket.emit("add-user", selectedUser._id);
    }
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (selectedUser) {
        const login = await AsyncStorage.getItem("login");
        const currentUser = JSON.parse(login as string)._id;
      }
    };
    getCurrentChat();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("msg-recive", (msg) => {
        setArrivalMessage({
          fromSelf: false,
          message: msg,
          id: selectedUser._id,
        });

        useEffect(() => {
          arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
        }, [arrivalMessage]);
        return () => {
          socket.off("msg-recive");
        };
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const handleBackbtn = () => {
    router.back();
  };

  const handleSendMsg = async (msg: string) => {
    const res = await AsyncStorage.getItem("login");
    const data = JSON.parse(res as string);

    socket.emit("send-msg", {
      to: selectedUser._id,
      from: data._id,
      msg,
    });
    await fetch("https://server-27op.onrender.com/api/messages/addmsg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: data._id, to: data._id, message: msg }),
    });
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[styles.message, item.fromSelf ? styles.sended : styles.received]}
    >
      <View style={styles.content}>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor="#333333" />
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={handleBackbtn} style={styles.arrowback}>
            <Ionicons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
          <Image
            style={styles.avatar}
            source={{ uri: selectedUser?.avatarImage }}
          />
          <Text style={styles.titleText}>{selectedUser?.username}</Text>
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.chatMessages}
        />
        <View style={styles.chatContainer}>
          <TextInput style={styles.textinput} />
          <TouchableOpacity
            onPress={() => handleSendMsg}
            style={styles.sendbtn}
          >
            <Ionicons name="send" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  titleContainer: {
    backgroundColor: "#333333",
    flexDirection: "row", // Arrange children in a row
    alignItems: "center", // Align children vertically centered
    padding: 10,
  },
  arrowback: {
    marginRight: 3, // Add some space between arrow and avatar
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10, // Add some space between avatar and text
    borderColor: "#FFFFFF",
    borderWidth: 1,
  },
  titleText: {
    color: "white",
    textTransform: "uppercase",
    fontSize: 15,
  },
  chatMessages: {
    padding: 10,
  },
  message: {
    flexDirection: "row",
    marginBottom: 10,
  },
  content: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
  },
  messageText: {
    color: "#d1d1d1",
    fontSize: 16,
  },
  sended: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    backgroundColor: "#333555",
    borderRadius: 15,
    height: "auto",
  },
  received: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    backgroundColor: "#333333",
    borderRadius: 15,
    height: "auto",
  },
  textinput: {
    borderRadius: 23,
    backgroundColor: "#333333",
    alignContent: "center",
    width: 300,
    height: 50,
  },
  sendbtn: {
    backgroundColor: "#FF4500",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    marginLeft: 3,
  },
  chatContainer: {
    backgroundColor: "#25292e",
    height: 70,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
});
