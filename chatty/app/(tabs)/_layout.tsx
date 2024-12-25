import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Animated from "react-native-reanimated";

const iconNames: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  chatsn: "chatbubble-ellipses-outline",
  aboutn: "person-circle-outline",
  chatsf: "chatbubble-ellipses-sharp",
  aboutf: "person-circle-sharp",
};

export default function TabLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "red",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            height: 60,
            paddingVertical: 10,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          tabBarIcon: ({ color, focused }) => {
            let iconName;
            if (focused) {
              const routeName = (route.name + "f") as keyof typeof iconNames;
              iconName = iconNames[routeName];
            } else {
              const routeName = (route.name + "n") as keyof typeof iconNames;
              iconName = iconNames[routeName];
            }

            return (
              <Animated.View
                style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}
              >
                <Ionicons name={iconName} size={24} color={color} />
              </Animated.View>
            );
          },
        })}
      >
        <Tabs.Screen
          name="chats"
          options={{
            title: "Chats",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: "Profile",
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
}
