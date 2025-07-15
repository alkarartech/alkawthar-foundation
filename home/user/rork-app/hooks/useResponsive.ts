import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

interface ResponsiveData {
  width: number;
  height: number;
  isWeb: boolean;
  isDesktop: boolean;
  isMobile: boolean;
}

export default function useResponsive(): ResponsiveData {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && dimensions.width >= 768;
  const isMobile = !isDesktop;

  return {
    width: dimensions.width,
    height: dimensions.height,
    isWeb,
    isDesktop,
    isMobile,
  };
}