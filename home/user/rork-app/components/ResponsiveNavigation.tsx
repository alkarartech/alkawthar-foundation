import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Calendar, BookOpen, Play, MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && width >= 768;

interface NavItem {
  name: string;
  title: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  route: string;
}

const navItems: NavItem[] = [
  { name: 'index', title: 'Home', icon: Home, route: '/' },
  { name: 'calendar-events', title: 'Calendar/Events', icon: Calendar, route: '/calendar-events' },
  { name: 'resources', title: 'Resources', icon: BookOpen, route: '/resources' },
  { name: 'watch', title: 'Watch', icon: Play, route: '/watch' },
  { name: 'contact', title: 'Contact', icon: MapPin, route: '/contact' },
];

export default function ResponsiveNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  if (!isDesktop) {
    // Return null for mobile - tabs will be handled by Expo Router
    return null;
  }

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const isActive = (route: string) => {
    if (route === '/') {
      return pathname === '/' || pathname === '/index';
    }
    return pathname === route;
  };

  return (
    <View style={styles.webNavContainer}>
      <View style={styles.webNavContent}>
        <Text style={styles.webNavTitle}>Al Kawthar Foundation</Text>
        <View style={styles.webNavItems}>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.route);
            
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.webNavItem, active && styles.webNavItemActive]}
                onPress={() => handleNavigation(item.route)}
              >
                <IconComponent 
                  size={20} 
                  color={active ? Colors.primary.green : Colors.text.muted} 
                />
                <Text style={[
                  styles.webNavItemText,
                  active && styles.webNavItemTextActive
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webNavContainer: {
    backgroundColor: Colors.background.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  webNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  webNavTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.green,
  },
  webNavItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  webNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    transition: 'all 0.2s ease',
  },
  webNavItemActive: {
    backgroundColor: Colors.background.offWhite,
  },
  webNavItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.muted,
  },
  webNavItemTextActive: {
    color: Colors.primary.green,
    fontWeight: '600',
  },
});