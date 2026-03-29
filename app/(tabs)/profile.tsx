import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Brand } from '@/constants/Colors';

interface TimelineEvent {
  id: string;
  type: 'connection' | 'encounter' | 'milestone';
  text: string;
  date: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}

const TIMELINE: TimelineEvent[] = [
  { id: '1', type: 'encounter', text: 'Met 2 people at Starbucks Reserve', date: 'Today', icon: 'map-pin', color: Brand.blue },
  { id: '2', type: 'connection', text: 'Connected with Luca Moretti', date: 'Yesterday', icon: 'handshake-o', color: Brand.success },
  { id: '3', type: 'milestone', text: 'Reached 10 encounters at WeWork', date: 'Mar 25', icon: 'star', color: Brand.orange },
  { id: '4', type: 'encounter', text: 'Met 3 people at Parco Sempione', date: 'Mar 24', icon: 'map-pin', color: Brand.blue },
  { id: '5', type: 'connection', text: 'Connected with Elena Rossi', date: 'Mar 12', icon: 'handshake-o', color: Brand.success },
  { id: '6', type: 'milestone', text: 'Joined CLOSE', date: 'Feb 20', icon: 'rocket', color: Brand.orange },
];

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineLine}>
        <View style={[styles.timelineDot, { backgroundColor: event.color }]}>
          <FontAwesome name={event.icon} size={10} color="#FFFFFF" />
        </View>
        {!isLast && <View style={styles.timelineConnector} />}
      </View>
      <View style={styles.timelineContent}>
        <Text style={styles.timelineText}>{event.text}</Text>
        <Text style={styles.timelineDate}>{event.date}</Text>
      </View>
    </View>
  );
}

function SettingsItem({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
}) {
  return (
    <TouchableOpacity style={styles.settingsItem}>
      <View style={styles.settingsLeft}>
        <FontAwesome name={icon} size={16} color={Brand.textSecondary} />
        <Text style={styles.settingsLabel}>{label}</Text>
      </View>
      <FontAwesome name="chevron-right" size={12} color={Brand.border} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with settings */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsGear}>
            <FontAwesome name="cog" size={22} color={Brand.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>JS</Text>
          </View>
          <Text style={styles.profileName}>Jacob Sprake</Text>
          <Text style={styles.profileBio}>
            Building things in Milan. Coffee lover, park walker, co-working regular.
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <ProfileStat label="People met" value="23" />
            <View style={styles.statDivider} />
            <ProfileStat label="Active connections" value="5" />
            <View style={styles.statDivider} />
            <ProfileStat label="Favorite spot" value="WeWork" />
          </View>
        </View>

        {/* Connection Timeline */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activity</Text>
        </View>

        <View style={styles.timelineContainer}>
          {TIMELINE.map((event, index) => (
            <TimelineItem
              key={event.id}
              event={event}
              isLast={index === TIMELINE.length - 1}
            />
          ))}
        </View>

        {/* Settings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Settings</Text>
        </View>

        <View style={styles.settingsCard}>
          <SettingsItem icon="bluetooth-b" label="Bluetooth Discovery" />
          <SettingsItem icon="bell" label="Notifications" />
          <SettingsItem icon="shield" label="Privacy" />
          <SettingsItem icon="question-circle" label="Help & Support" />
          <SettingsItem icon="info-circle" label="About CLOSE" />
        </View>

        {/* Version */}
        <Text style={styles.versionText}>CLOSE v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Brand.dark,
  },
  settingsGear: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Brand.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  profileCard: {
    backgroundColor: Brand.card,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Brand.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: Brand.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarLargeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: Brand.dark,
  },
  profileBio: {
    fontSize: 14,
    color: Brand.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.blue,
  },
  statLabel: {
    fontSize: 11,
    color: Brand.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Brand.border,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Brand.dark,
  },
  timelineContainer: {
    marginHorizontal: 16,
    backgroundColor: Brand.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineLine: {
    width: 32,
    alignItems: 'center',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Brand.border,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 20,
  },
  timelineText: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.dark,
  },
  timelineDate: {
    fontSize: 12,
    color: Brand.textSecondary,
    marginTop: 2,
  },
  settingsCard: {
    backgroundColor: Brand.card,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsLabel: {
    fontSize: 15,
    color: Brand.dark,
    marginLeft: 12,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Brand.textSecondary,
    marginTop: 8,
  },
});
