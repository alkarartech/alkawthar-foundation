import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import Button from './Button';

type DonationCardProps = {
  title: string;
  description: string;
  goal: number;
  raised: number;
  onDonate: () => void;
};

export default function DonationCard({ title, description, goal, raised, onDonate }: DonationCardProps) {
  const progress = Math.min(raised / goal, 1);
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <LinearGradient
            colors={[Colors.primary.green, Colors.primary.lightGreen]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${percentage}%` }]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressText}>${raised.toLocaleString()} raised</Text>
          <Text style={styles.progressText}>${goal.toLocaleString()} goal</Text>
        </View>
        <Text style={styles.percentage}>{percentage}% Complete</Text>
      </View>
      
      <Button 
        title="Donate Now" 
        onPress={onDonate} 
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.text.muted,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBackground: {
    height: 8,
    backgroundColor: Colors.ui.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.green,
    marginTop: 4,
  },
  button: {
    marginTop: 8,
  },
});