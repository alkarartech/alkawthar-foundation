import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import WebViewWrapper from '@/components/WebViewWrapper';

const { width } = Dimensions.get('window');

interface CalendarViewProps {
  style?: any;
}

export default function CalendarView({ style }: CalendarViewProps) {
  const calendarUrl = "https://calendar.google.com/calendar/embed?src=alkawtharfoundationbc%40gmail.com&ctz=America%2FVancouver";
  
  const getCalendarDimensions = () => {
    if (Platform.OS === 'web') {
      return {
        width: Math.min(width - 32, 800),
        height: 600,
      };
    } else {
      return {
        width: width - 32,
        height: 500,
      };
    }
  };

  const dimensions = getCalendarDimensions();

  return (
    <View style={[styles.container, style]}>
      <WebViewWrapper
        source={{ uri: calendarUrl }}
        style={[styles.calendar, { 
          width: dimensions.width, 
          height: dimensions.height 
        }]}
        scalesPageToFit={Platform.OS !== 'web'}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  calendar: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});