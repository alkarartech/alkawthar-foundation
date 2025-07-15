import React from 'react';
import { Platform, View, Text, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';

type WebViewWrapperProps = {
  source: { uri: string };
  style?: any;
};

const WebViewWrapper: React.FC<WebViewWrapperProps> = ({ source, style }) => {
  if (Platform.OS === 'web') {
    // Convert React Native styles to web-compatible CSS
    const webStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: '8px',
    };

    // Only add safe CSS properties from the style prop
    if (style) {
      if (style.borderRadius) webStyle.borderRadius = `${style.borderRadius}px`;
      if (style.backgroundColor) webStyle.backgroundColor = style.backgroundColor;
      if (style.width) webStyle.width = typeof style.width === 'number' ? `${style.width}px` : style.width;
      if (style.height) webStyle.height = typeof style.height === 'number' ? `${style.height}px` : style.height;
    }

    return (
      <div style={{ ...webStyle, display: 'flex', flex: 1 }}>
        <iframe 
          src={source.uri} 
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: webStyle.borderRadius,
            backgroundColor: webStyle.backgroundColor,
          }}
          title="Calendar View"
        />
      </div>
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