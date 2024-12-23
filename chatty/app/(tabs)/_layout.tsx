import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Animated from "react-native-reanimated";

const iconNames: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  index: "chatbubble-ellipses-outline",
  about: "person-circle-outline",
};

export default function TabLayout() {
  return (
    <>
      <StatusBar style="dark" />
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
            const routeName = route.name as keyof typeof iconNames;
            const iconName = iconNames[routeName];

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
          name="index"
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
