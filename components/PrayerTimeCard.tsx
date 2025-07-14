import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import Colors from '@/constants/colors';

type PrayerTime = {
  name: string;
  adhan: string;
  iqamah: string;
};

type PrayerTimeCardProps = {
  prayer: PrayerTime;
  isNext?: boolean;
};

export default function PrayerTimeCard({ prayer, isNext = false }: PrayerTimeCardProps) {
  return (
    <Card style={[styles.card, isNext && styles.nextPrayer]}>
      <View style={styles.header}>
        <Text style={styles.prayerName}>{prayer.name}</Text>
        {isNext && <View style={styles.nextBadge}><Text style={styles.nextText}>NEXT</Text></View>}
      </View>
      <View style={styles.timeContainer}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>Adhan</Text>
          <Text style={styles.time}>{prayer.adhan}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>Iqamah</Text>
          <Text style={styles.time}>{prayer.iqamah}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  nextPrayer: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.green,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  nextBadge: {
    backgroundColor: Colors.primary.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  nextText: {
    color: Colors.text.light,
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: Colors.text.muted,
    marginBottom: 4,
  },
  time: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.ui.border,
    marginHorizontal: 16,
  },
});