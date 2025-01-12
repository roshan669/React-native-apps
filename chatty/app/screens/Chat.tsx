import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import EmojiModal from "@/components/EmojiModal";
import { Toast } from "toastify-react-native";

interface Message {
  id: string;
  fromSelf: boolean;
  message: string;
  timestamp: string;
}

export default function Chat() {
  const { SelectedUser } = useGlobalSearchParams();
  const [lastLoadedMessageId, setLastLoadedMessageId] = useState<string | null>(
    "Empty"
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const selectedUser = SelectedUser ? JSON.parse(SelectedUser as string) : null;
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList<Message>>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Track loading state

  const [refreshing, setRefreshing] = useState(false);

  if (!socketRef.current) {
    socketRef.current = io("https://server-27op.onrender.com", {
      transports: ["websocket"],
    });
  }

  const socket = socketRef.current;

  useEffect(() => {
    const initializeSocket = async () => {
      const currentUserString = await AsyncStorage.getItem("login");
      if (currentUserString) {
        const currentUser = JSON.parse(currentUserString);
        socket.emit("add-user", currentUser._id);

        socket.on("disconnect", () => {});

        socket.on("connect_error", (err: Error) => {});
      }
    };

    initializeSocket();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("msg-recive", (msg) => {
        setArrivalMessage({
          id: `${Date.now()}`,
          fromSelf: false,
          message: msg,
          timestamp: `${Date.now()}`,
        });
        return () => {
          socket.off("msg-recive");
        };
      });
    }
  }, [socket]);

  useEffect(() => {
    const fetchInitialMessages = async () => {
      // Explicit return type
      try {
        const res = await AsyncStorage.getItem("login");
        if (!res) {
          console.error("No login data found");
          return []; // Important: Return an empty array in case of error
        }

        const response = await AsyncStorage.getItem(selectedUser?._id);
        if (!response) {
          Toast.info("No Message");
          return []; // Important: Return an empty array in case of error
        }

        const result = JSON.parse(response);
        console.log(response);
        setMessages(result);
      } catch (error) {
        console.error("Error fetching messages:", error);
        return []; // Important: Return an empty array on error
      }
    };
    fetchInitialMessages();
  }, []);

  useEffect(() => {
    const res = async () => {
      if (arrivalMessage) {
        setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
        const stringmsg = JSON.stringify(messages);

        await AsyncStorage.setItem(selectedUser?._id, stringmsg);
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: false });
        }
      }
    };
    res();
  }, [arrivalMessage]); // <-- Include arrivalMessage in dependency array

  const handleBackbtn = () => {
    router.back();
  };

  const handleSendMsg = async () => {
    // Check if new message is empty
    if (newMessage.trim() === "") return;

    // Get login data
    try {
      const loginDataString = await AsyncStorage.getItem("login");
      if (!loginDataString) {
        console.error("Login data not found in AsyncStorage");
        return;
      }
      const loginData = JSON.parse(loginDataString);
      console.log(loginData);

      // Create new message object
      const newMsg = {
        id: `${Date.now()}`, // Unique ID
        fromSelf: true,
        message: newMessage,
        timestamp: `${Date.now()}`,
      };

      // Update local messages state
      setMessages((prevMessages) => [...prevMessages, newMsg]);

      // Send message via socket (if available)
      if (socketRef.current) {
        socketRef.current.emit("send-msg", {
          to: selectedUser._id,
          from: loginData._id,
          msg: newMessage,
        });
      }

      // Clear new message input
      setNewMessage("");

      // Store message for selected user (optional)
      if (selectedUser) {
        // Retrieve existing messages for the selected user
        let existingMessagesString = await AsyncStorage.getItem(
          selectedUser._id
        );
        let existingMessages: Message[] = [];

        if (existingMessagesString) {
          try {
            existingMessages = JSON.parse(existingMessagesString);
          } catch (error) {
            console.error("Error parsing existing messages:", error);
          }
        }

        // Update and store messages
        const updatedMessages = [...existingMessages, newMsg];
        const updatedMessagesString = JSON.stringify(updatedMessages);
        await AsyncStorage.setItem(selectedUser._id, updatedMessagesString);
      } else {
        Toast.warn("User not found");
      }

      // Scroll to end of message list (if available)
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[styles.message, item.fromSelf ? styles.sended : styles.received]}
      key={item.id} // <-- Use unique keys for each message
    >
      <View style={styles.content}>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    </View>
  );

  const ListHeaderComponent = () => {
    return isLoadingMore ? <View style={styles.loader}>This is it</View> : null;
  };

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
        {messages.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.chatMessages}
            ListHeaderComponent={ListHeaderComponent}
          />
        ) : (
          <View style={styles.nomsg}>
            <Text style={styles.nomsgtxt}>No MSG</Text>
          </View>
        )}
        <View style={styles.chatContainer}>
          <View style={styles.inputfield}>
            <TouchableOpacity
              style={styles.emojibtn}
              onPress={() => {
                setShowModal(true);
              }}
            >
              <Ionicons name="happy-outline" size={27} color={"#FF4500"} />
            </TouchableOpacity>
            <TextInput
              style={styles.textinput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Message..."
              placeholderTextColor="#d1d1d1"
              textAlign="left"
            />
          </View>
          <TouchableOpacity onPress={handleSendMsg} style={styles.sendbtn}>
            <Ionicons name="send" color="white" size={20} />
          </TouchableOpacity>
          <EmojiModal
            isVisible={showModal}
            onClose={() => setShowModal(false)}
            onEmojiSelect={(emoji) => {
              setNewMessage(newMessage + emoji);
            }}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  nomsg: {
    flex: 1,
    flexDirection: "column",
  },
  nomsgtxt: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  titleContainer: {
    backgroundColor: "#333333",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  arrowback: {
    marginRight: 3,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
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
  inputfield: {
    flexDirection: "row",
    borderRadius: 23,
    backgroundColor: "#333333",
    alignContent: "center",
    width: 300,
    height: 50,
    color: "white",
  },
  textinput: {
    flex: 1,
    color: "#FFF",
  },
  emojibtn: {
    alignSelf: "center",
    marginLeft: 10,
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
    paddingHorizontal: 10,
  },
});
