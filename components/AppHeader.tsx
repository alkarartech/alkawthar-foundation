import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '@/constants/colors';

type AppHeaderProps = {
  showLogo?: boolean;
};

export default function AppHeader({ showLogo = true }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {showLogo && (
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
        </View>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Al Kawthar Foundation</Text>
        <Text style={styles.subtitle}>Surrey, BC</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
  },
  logoContainer: {
    marginRight: 12,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.green,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 2,
  },
});