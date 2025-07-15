import { Tabs } from "expo-router";
import { Home, Calendar, BookOpen, Play, MapPin } from "lucide-react-native";
import React from "react";
import Colors from "@/constants/colors";
import ResponsiveNavigation from "@/components/ResponsiveNavigation";
import useResponsive from "@/hooks/useResponsive";

export default function TabLayout() {
  const { isDesktop } = useResponsive();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.green,
        tabBarInactiveTintColor: Colors.text.muted,
        tabBarStyle: isDesktop ? { display: 'none' } : {
          borderTopColor: Colors.ui.border,
        },
        headerShown: isDesktop,
        header: () => isDesktop ? <ResponsiveNavigation /> : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar-events"
        options={{
          title: "Calendar/Events",
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: "Resources",
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="watch"
        options={{
          title: "Watch",
          tabBarIcon: ({ color }) => <Play size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: "Contact",
          tabBarIcon: ({ color }) => <MapPin size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}