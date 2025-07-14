import React from 'react';
import { Platform, View, Text, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';

type WebViewWrapperProps = {
  source: { uri: string };
  style?: any;
};

const WebViewWrapper: React.FC<WebViewWrapperProps> = ({ source, style }) => {
  if (Platform.OS === 'web') {
    return (
      <iframe 
        src={source.uri} 
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          borderRadius: '8px',
          ...style 
        }} 
      />
    );
  }

  // Only import WebView on mobile platforms
  try {
    const { WebView } = require('react-native-webview');
    return <WebView source={source} style={style} />;
  } catch (error) {
    return (
      <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 8 }]}>
        <Text>WebView not available on this platform</Text>
        <TouchableOpacity onPress={() => {
          if (Platform.OS === 'web') {
            window.open(source.uri, '_blank');
          }
        }}>
          <Text style={{ color: Colors.primary.green, textDecorationLine: 'underline', marginTop: 8 }}>
            Open in browser
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default WebViewWrapper;