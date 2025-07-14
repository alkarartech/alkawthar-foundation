import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

type LogoProps = {
  size?: 'small' | 'medium' | 'large';
};

export default function Logo({ size = 'medium' }: LogoProps) {
  const getFontSize = () => {
    if (size === 'small') return 18;
    if (size === 'medium') return 24;
    if (size === 'large') return 32;
    return 24;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: getFontSize() }]}>
        <Text style={styles.al}>Al</Text> Kawthar
      </Text>
      <Text style={styles.foundation}>FOUNDATION</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: Colors.primary.green,
  },
  al: {
    color: Colors.primary.gold,
  },
  foundation: {
    fontSize: 12,
    color: Colors.text.muted,
    letterSpacing: 2,
    marginTop: 2,
  },
});