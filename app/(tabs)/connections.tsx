import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Brand } from '@/constants/Colors';
import { NEARBY_PEOPLE, NearbyPerson, getVibeTag } from '@/constants/data';

function getStrengthInfo(encounters: number): {
  label: string;
  color: string;
  bars: number;
} {
  if (encounters >= 10) return { label: 'Strong', color: Brand.blue, bars: 4 };
  if (encounters >= 6)  return { label: 'Growing', color: Brand.success, bars: 3 };
  if (encounters >= 3)  return { label: 'Building', color: Brand.warning, bars: 2 };
  return { label: 'New', color: Brand.textSecondary, bars: 1 };
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

function ConnectionCard({ person }: { person: NearbyPerson }) {
  // Pretend an encounter count: derive from nightsRated for the prototype.
  const encounters = person.nightsRated * 2 + person.mutualConnections;
  const strength = getStrengthInfo(encounters);
  const fading = !person.isHere && person.appearedMinsAgo > 60 * 24 * 25;

  return (
    <TouchableOpacity
      style={styles.connectionCard}
      activeOpacity={0.9}
      onPress={() => router.push(`/profile/${person.id}` as any)}
    >
      <View style={styles.cardTop}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: person.photoColor, borderColor: person.photoColor },
          ]}
        >
          <Text style={styles.avatarText}>
            {person.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.connectionName}>{person.name}</Text>
          <Text style={styles.connectionRole} numberOfLines={1}>
            {person.role}
          </Text>
          <View style={styles.nightVibeRow}>
            <FontAwesome name="moon-o" size={11} color={Brand.warning} />
            <Text style={styles.nightVibeNumber}>{person.nightVibe.toFixed(1)}</Text>
            <Text style={styles.nightVibeMeta}>· {person.nightsRated} nights together</Text>
          </View>
        </View>

        <View style={styles.strengthContainer}>
          <StrengthBars bars={strength.bars} color={strength.color} />
          <Text style={[styles.strengthLabel, { color: strength.color }]}>
            {strength.label}
          </Text>
        </View>
      </View>

      {/* Top vibes others gave them */}
      <View style={styles.vibeRow}>
        {person.vibeTagIds.slice(0, 3).map((vid) => {
          const tag = getVibeTag(vid);
          if (!tag) return null;
          return (
            <View
              key={vid}
              style={[
                styles.vibeChip,
                { backgroundColor: tag.color + '15', borderColor: tag.color + '50' },
              ]}
            >
              <FontAwesome name={tag.emoji as any} size={10} color={tag.color} />
              <Text style={[styles.vibeChipText, { color: tag.color }]}>{tag.label}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/rate/${person.id}` as any)}
          activeOpacity={0.85}
        >
          <FontAwesome name="bolt" size={11} color={Brand.orange} />
          <Text style={[styles.actionText, { color: Brand.orange }]}>Pin a vibe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.85}>
          <FontAwesome name="comment-o" size={11} color={Brand.blue} />
          <Text style={[styles.actionText, { color: Brand.blue }]}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/plan/new' as any)}
          activeOpacity={0.85}
        >
          <FontAwesome name="calendar-plus-o" size={11} color={Brand.success} />
          <Text style={[styles.actionText, { color: Brand.success }]}>Invite out</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function ConnectionsScreen() {
  // Treat anyone with a connection or who appeared recently as a connection.
  const connections = NEARBY_PEOPLE.filter((p) => p.isConnected || p.nightsRated >= 3);
  const totalNights = connections.reduce((s, p) => s + p.nightsRated, 0);
  const avgVibe =
    connections.length > 0
      ? connections.reduce((s, p) => s + p.nightVibe, 0) / connections.length
      : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your circle</Text>
          <Text style={styles.headerSubtitle}>
            People you’ve actually been around
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{connections.length}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Brand.warning }]}>
              {avgVibe.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Avg vibe</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Brand.success }]}>
              {totalNights}
            </Text>
            <Text style={styles.statLabel}>Nights out</Text>
          </View>
        </View>

        {connections.map((person) => (
          <ConnectionCard key={person.id} person={person} />
        ))}

        <View style={styles.infoNote}>
          <FontAwesome name="info-circle" size={14} color={Brand.textSecondary} />
          <Text style={styles.infoText}>
            Connections fade after 30 days without an encounter or shared night out. Real life keeps them alive.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.background },
  scrollContent: { paddingBottom: 32 },
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
    fontSize: 13,
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
    fontSize: 11,
    color: Brand.textSecondary,
    fontWeight: '700',
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
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.dark,
  },
  connectionRole: {
    fontSize: 12,
    color: Brand.textSecondary,
    marginTop: 2,
  },
  nightVibeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  nightVibeNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: Brand.dark,
  },
  nightVibeMeta: {
    fontSize: 11,
    color: Brand.textSecondary,
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
    fontWeight: '800',
    marginTop: 3,
  },
  vibeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  vibeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  vibeChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Brand.background,
    gap: 5,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 14,
    backgroundColor: 'rgba(74, 124, 255, 0.06)',
    borderRadius: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: Brand.textSecondary,
    flex: 1,
    lineHeight: 17,
  },
});
