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

interface Connection {
  id: string;
  name: string;
  location: string;
  firstMet: string;
  daysSinceMet: number;
  encounters: number;   // total times near each other
  lastEncounterDaysAgo: number;
}

const MOCK_CONNECTIONS: Connection[] = [
  {
    id: '1',
    name: 'Elena Rossi',
    location: 'WeWork Milano',
    firstMet: 'Mar 12, 2026',
    daysSinceMet: 17,
    encounters: 8,
    lastEncounterDaysAgo: 1,
  },
  {
    id: '2',
    name: 'Marco Bianchi',
    location: 'Parco Sempione',
    firstMet: 'Mar 5, 2026',
    daysSinceMet: 24,
    encounters: 5,
    lastEncounterDaysAgo: 3,
  },
  {
    id: '3',
    name: 'Sofia Conti',
    location: 'Starbucks Reserve',
    firstMet: 'Feb 25, 2026',
    daysSinceMet: 32,
    encounters: 3,
    lastEncounterDaysAgo: 26,
  },
  {
    id: '4',
    name: 'Luca Moretti',
    location: 'Navigli District',
    firstMet: 'Mar 20, 2026',
    daysSinceMet: 9,
    encounters: 12,
    lastEncounterDaysAgo: 0,
  },
  {
    id: '5',
    name: 'Chiara Lombardi',
    location: 'Fondazione Prada',
    firstMet: 'Feb 28, 2026',
    daysSinceMet: 29,
    encounters: 2,
    lastEncounterDaysAgo: 27,
  },
];

function getStrengthInfo(encounters: number): { label: string; color: string; bars: number } {
  if (encounters >= 10) return { label: 'Strong', color: Brand.blue, bars: 4 };
  if (encounters >= 6) return { label: 'Growing', color: Brand.success, bars: 3 };
  if (encounters >= 3) return { label: 'Building', color: Brand.warning, bars: 2 };
  return { label: 'New', color: Brand.textSecondary, bars: 1 };
}

function isFading(lastEncounterDaysAgo: number): boolean {
  return lastEncounterDaysAgo >= 25;
}

function StrengthBars({ bars, color }: { bars: number; color: string }) {
  return (
    <View style={styles.barsContainer}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              height: 6 + i * 4,
              backgroundColor: i <= bars ? color : Brand.border,
            },
          ]}
        />
      ))}
    </View>
  );
}

function ConnectionCard({ connection }: { connection: Connection }) {
  const strength = getStrengthInfo(connection.encounters);
  const fading = isFading(connection.lastEncounterDaysAgo);
  const fadingProgress = fading
    ? Math.min((connection.lastEncounterDaysAgo - 25) / 5, 1)
    : 0;

  return (
    <View
      style={[
        styles.connectionCard,
        fading && { opacity: 1 - fadingProgress * 0.4 },
      ]}
    >
      {/* Fading indicator */}
      {fading && (
        <View style={styles.fadingBanner}>
          <FontAwesome name="clock-o" size={11} color={Brand.fading} />
          <Text style={styles.fadingText}>
            Fading {connection.lastEncounterDaysAgo >= 30 ? 'soon' : `in ${30 - connection.lastEncounterDaysAgo}d`}
          </Text>
        </View>
      )}

      <View style={styles.cardTop}>
        {/* Avatar placeholder */}
        <View style={[styles.avatar, fading && { borderColor: Brand.fading }]}>
          <Text style={styles.avatarText}>
            {connection.name.split(' ').map((n) => n[0]).join('')}
          </Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.connectionName}>{connection.name}</Text>
          <View style={styles.locationRow}>
            <FontAwesome name="map-pin" size={11} color={Brand.textSecondary} />
            <Text style={styles.locationText}>{connection.location}</Text>
          </View>
        </View>

        {/* Strength indicator */}
        <View style={styles.strengthContainer}>
          <StrengthBars bars={strength.bars} color={strength.color} />
          <Text style={[styles.strengthLabel, { color: strength.color }]}>
            {strength.label}
          </Text>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <View style={styles.metaItem}>
          <FontAwesome name="calendar" size={12} color={Brand.textSecondary} />
          <Text style={styles.metaText}>Met {connection.firstMet}</Text>
        </View>
        <View style={styles.metaItem}>
          <FontAwesome name="exchange" size={12} color={Brand.textSecondary} />
          <Text style={styles.metaText}>{connection.encounters} encounters</Text>
        </View>
      </View>
    </View>
  );
}

export default function ConnectionsScreen() {
  const activeCount = MOCK_CONNECTIONS.filter(
    (c) => !isFading(c.lastEncounterDaysAgo)
  ).length;
  const fadingCount = MOCK_CONNECTIONS.filter(
    (c) => isFading(c.lastEncounterDaysAgo)
  ).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Connections</Text>
          <Text style={styles.headerSubtitle}>
            People you've met in real life
          </Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{MOCK_CONNECTIONS.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Brand.success }]}>
              {activeCount}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Brand.fading }]}>
              {fadingCount}
            </Text>
            <Text style={styles.statLabel}>Fading</Text>
          </View>
        </View>

        {/* Connections list */}
        {MOCK_CONNECTIONS.map((connection) => (
          <ConnectionCard key={connection.id} connection={connection} />
        ))}

        {/* Info note */}
        <View style={styles.infoNote}>
          <FontAwesome name="info-circle" size={14} color={Brand.textSecondary} />
          <Text style={styles.infoText}>
            Connections fade after 30 days without a nearby encounter. Meet again to keep them alive.
          </Text>
        </View>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Brand.dark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Brand.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: Brand.card,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: Brand.blue,
  },
  statLabel: {
    fontSize: 12,
    color: Brand.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  connectionCard: {
    backgroundColor: Brand.card,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  fadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 10,
  },
  fadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.fading,
    marginLeft: 4,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(74, 124, 255, 0.1)',
    borderWidth: 2,
    borderColor: Brand.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.blue,
  },
  cardInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.dark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locationText: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginLeft: 4,
  },
  strengthContainer: {
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    width: 5,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
  cardBottom: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: Brand.textSecondary,
    marginLeft: 6,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 14,
    backgroundColor: 'rgba(74, 124, 255, 0.06)',
    borderRadius: 12,
  },
  infoText: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});
