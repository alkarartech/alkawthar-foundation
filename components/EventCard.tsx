import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from './Card';

type EventCardProps = {
  title: string;
  date: string;
  time: string;
  location: string;
  onPress: () => void;
};

export default function EventCard({ title, date, time, location, onPress }: EventCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.dateContainer}>
          <View style={styles.dateBox}>
            <Text style={styles.day}>{date.split(' ')[0]}</Text>
            <Text style={styles.month}>{date.split(' ')[1]}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Clock size={16} color={Colors.text.muted} />
              <Text style={styles.detailText}>{time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Calendar size={16} color={Colors.text.muted} />
              <Text style={styles.detailText}>{location}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
  },
  dateContainer: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.lightGreen,
  },
  dateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  day: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.light,
  },
  month: {
    fontSize: 14,
    color: Colors.text.light,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  detailsContainer: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text.muted,
  },
});