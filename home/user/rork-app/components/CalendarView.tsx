import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import WebViewWrapper from '@/components/WebViewWrapper';
import Colors from '@/constants/colors';

interface CalendarViewProps {
  style?: any;
}

export default function CalendarView({ style }: CalendarViewProps) {
  const calendarUrl = 'https://calendar.google.com/calendar/embed?src=alkawtharfoundationbc%40gmail.com&ctz=America%2FVancouver';

  // Create web-safe styles
  const webViewStyle = Platform.OS === 'web' 
    ? {
        borderRadius: 12,
        backgroundColor: Colors.background.light,
      }
    : styles.webview;

  return (
    <View style={[styles.container, style]}>
      <WebViewWrapper
        source={{ uri: calendarUrl }}
        style={webViewStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  webview: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: Colors.background.light,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
});