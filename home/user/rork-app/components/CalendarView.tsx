import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import WebViewWrapper from '@/components/WebViewWrapper';
import Colors from '@/constants/colors';

interface CalendarViewProps {
  style?: any;
}

export default function CalendarView({ style }: CalendarViewProps) {
  const calendarUrl = 'https://calendar.google.com/calendar/embed?src=alkawtharfoundationbc%40gmail.com&ctz=America%2FVancouver';

  return (
    <View style={[styles.container, style]}>
      <WebViewWrapper
        source={{ uri: calendarUrl }}
        style={[
          styles.webview,
          Platform.OS === 'web' && styles.webviewWeb
        ]}
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
    overflow: 'hidden',
    backgroundColor: Colors.background.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  webviewWeb: {
    minHeight: 600,
    height: '100%',
  },
});