import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

type PatternBackgroundProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function PatternBackground({ children, style }: PatternBackgroundProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.patternContainer}>
        <View style={styles.pattern} />
      </View>
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']}
        style={styles.gradient}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  pattern: {
    flex: 1,
    backgroundColor: Colors.primary.green,
    opacity: 0.05,
    // This creates a repeating pattern effect
    // The actual pattern is simulated with opacity
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});