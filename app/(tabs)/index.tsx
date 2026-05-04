import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Brand } from '@/constants/Colors';
import { NEARBY_PEOPLE, NearbyPerson, getVibeTag } from '@/constants/data';

const { width } = Dimensions.get('window');

function PulsingRadar({ count }: { count: number }) {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createPulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );

    const a1 = createPulse(pulse1, 0);
    const a2 = createPulse(pulse2, 733);
    const a3 = createPulse(pulse3, 1466);
    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, []);

  const renderRing = (anim: Animated.Value) => {
    const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
    const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] });
    return (
      <Animated.View
        style={[styles.pulseRing, { transform: [{ scale }], opacity }]}
      />
    );
  };

  return (
    <View style={styles.radarContainer}>
      {renderRing(pulse1)}
      {renderRing(pulse2)}
      {renderRing(pulse3)}
      <View style={styles.radarCenter}>
        <Text style={styles.radarCenterCount}>{count}</Text>
        <Text style={styles.radarCenterLabel}>here</Text>
      </View>
    </View>
  );
}

function SignalIcon({ signal }: { signal: NearbyPerson['signal'] }) {
  const icon =
    signal === 'bluetooth' ? 'bluetooth-b' : signal === 'nearby' ? 'wifi' : 'location-arrow';
  return <FontAwesome name={icon as any} size={10} color={Brand.blue} />;
}

function VibeChip({ vibeId, mini }: { vibeId: string; mini?: boolean }) {
  const tag = getVibeTag(vibeId);
  if (!tag) return null;
  return (
    <View
      style={[
        styles.vibeChip,
        mini && styles.vibeChipMini,
        { backgroundColor: tag.color + '1A', borderColor: tag.color + '55' },
      ]}
    >
      <FontAwesome name={tag.emoji as any} size={mini ? 9 : 11} color={tag.color} />
      <Text style={[styles.vibeChipText, mini && styles.vibeChipTextMini, { color: tag.color }]}>
        {tag.label}
      </Text>
    </View>
  );
}

function PersonAvatar({ person, size = 56 }: { person: NearbyPerson; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: person.photoColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: person.photoColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      }}
    >
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: size * 0.36,
          fontWeight: '800',
        }}
      >
        {person.name
          .split(' ')
          .map((n) => n[0])
          .join('')}
      </Text>
    </View>
  );
}

function NightVibeStars({ rating, nights }: { rating: number; nights: number }) {
  return (
    <View style={styles.nightVibeRow}>
      <FontAwesome name="moon-o" size={11} color={Brand.warning} />
      <Text style={styles.nightVibeNumber}>{rating.toFixed(1)}</Text>
      <Text style={styles.nightVibeMeta}>· {nights} nights</Text>
    </View>
  );
}

function PersonCard({
  person,
  onWave,
  waved,
}: {
  person: NearbyPerson;
  onWave: () => void;
  waved: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.personCard}
      onPress={() => router.push(`/profile/${person.id}` as any)}
    >
      <View style={styles.personCardTop}>
        <View style={styles.personLeft}>
          <PersonAvatar person={person} />
          {person.isHere && <View style={styles.liveBadge} />}
        </View>

        <View style={styles.personInfo}>
          <View style={styles.personNameRow}>
            <Text style={styles.personName}>{person.name}</Text>
            <Text style={styles.personAge}>· {person.age}</Text>
          </View>
          <Text style={styles.personRole} numberOfLines={1}>
            {person.role}
          </Text>
          <View style={styles.personMetaRow}>
            <SignalIcon signal={person.signal} />
            <Text style={styles.personDistance}>{person.distanceLabel}</Text>
            {person.mutualConnections > 0 && (
              <>
                <View style={styles.metaDot} />
                <FontAwesome name="users" size={10} color={Brand.textSecondary} />
                <Text style={styles.personDistance}>{person.mutualConnections} mutual</Text>
              </>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.waveButton, waved && styles.waveButtonActive]}
          onPress={onWave}
          activeOpacity={0.85}
        >
          <FontAwesome
            name={waved ? 'check' : 'hand-paper-o'}
            size={14}
            color={waved ? Brand.success : Brand.blue}
          />
          <Text
            style={[
              styles.waveButtonText,
              waved && { color: Brand.success },
            ]}
          >
            {waved ? 'Sent' : 'Wave'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.personVibeRow}>
        {person.vibeTagIds.slice(0, 3).map((vid) => (
          <VibeChip key={vid} vibeId={vid} mini />
        ))}
      </View>

      <View style={styles.personCardBottom}>
        <NightVibeStars rating={person.nightVibe} nights={person.nightsRated} />
        {person.isConnected && (
          <View style={styles.connectedPill}>
            <FontAwesome name="check" size={9} color={Brand.success} />
            <Text style={styles.connectedPillText}>Connected</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function NearbyScreen() {
  const [waved, setWaved] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'here' | 'today'>('here');

  const filtered = useMemo(() => {
    return filter === 'here'
      ? NEARBY_PEOPLE.filter((p) => p.isHere)
      : NEARBY_PEOPLE;
  }, [filter]);

  const hereCount = NEARBY_PEOPLE.filter((p) => p.isHere).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>CLOSE</Text>
            <Text style={styles.headerSubtitle}>Milano · who’s near you right now</Text>
          </View>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/premium' as any)}
            activeOpacity={0.85}
          >
            <FontAwesome name="bolt" size={14} color={Brand.orange} />
            <Text style={styles.headerButtonText}>Plus</Text>
          </TouchableOpacity>
        </View>

        <PulsingRadar count={hereCount} />
        <Text style={styles.discoveringText}>Scanning Bluetooth + Nearby</Text>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'here' && styles.filterChipActive]}
            onPress={() => setFilter('here')}
          >
            <View style={styles.liveDot} />
            <Text
              style={[
                styles.filterChipText,
                filter === 'here' && styles.filterChipTextActive,
              ]}
            >
              Here now · {hereCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'today' && styles.filterChipActive]}
            onPress={() => setFilter('today')}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'today' && styles.filterChipTextActive,
              ]}
            >
              Today · {NEARBY_PEOPLE.length}
            </Text>
          </TouchableOpacity>
        </View>

        {filtered.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            waved={!!waved[person.id]}
            onWave={() => setWaved((s) => ({ ...s, [person.id]: !s[person.id] }))}
          />
        ))}

        <View style={styles.privacyNote}>
          <FontAwesome name="shield" size={13} color={Brand.textSecondary} />
          <Text style={styles.privacyText}>
            Your profile is only visible to people physically near you. Walk away and you disappear.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const RADAR_SIZE = width * 0.5;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.background },
  scrollContent: { paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Brand.dark,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginTop: 2,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF1E8',
    borderRadius: 20,
    gap: 6,
  },
  headerButtonText: {
    color: Brand.orange,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  radarContainer: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 6,
  },
  pulseRing: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    borderWidth: 2,
    borderColor: Brand.blue,
    backgroundColor: 'rgba(74, 124, 255, 0.05)',
  },
  radarCenter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Brand.blue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Brand.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  radarCenterCount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
  },
  radarCenterLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: -2,
  },
  discoveringText: {
    textAlign: 'center',
    fontSize: 13,
    color: Brand.textSecondary,
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: Brand.card,
    borderWidth: 1,
    borderColor: Brand.border,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: Brand.blue,
    borderColor: Brand.blue,
  },
  filterChipText: {
    color: Brand.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Brand.success,
  },
  personCard: {
    backgroundColor: Brand.card,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  personCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personLeft: {
    width: 56,
    marginRight: 12,
  },
  liveBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Brand.success,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  personInfo: {
    flex: 1,
  },
  personNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personName: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.dark,
  },
  personAge: {
    fontSize: 14,
    color: Brand.textSecondary,
    marginLeft: 4,
    fontWeight: '600',
  },
  personRole: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginTop: 1,
  },
  personMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  personDistance: {
    fontSize: 11,
    color: Brand.textSecondary,
    fontWeight: '600',
    marginLeft: 2,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Brand.border,
    marginHorizontal: 4,
  },
  waveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(74,124,255,0.1)',
    borderRadius: 16,
    gap: 6,
  },
  waveButtonActive: {
    backgroundColor: 'rgba(52,199,89,0.12)',
  },
  waveButtonText: {
    color: Brand.blue,
    fontWeight: '800',
    fontSize: 12,
  },
  personVibeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  vibeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
  },
  vibeChipMini: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  vibeChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  vibeChipTextMini: {
    fontSize: 11,
  },
  personCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },
  nightVibeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nightVibeNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: Brand.dark,
  },
  nightVibeMeta: {
    fontSize: 12,
    color: Brand.textSecondary,
    marginLeft: 2,
  },
  connectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(52,199,89,0.1)',
    gap: 4,
  },
  connectedPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Brand.success,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    backgroundColor: 'rgba(74,124,255,0.06)',
    borderRadius: 14,
    gap: 10,
  },
  privacyText: {
    fontSize: 12,
    color: Brand.textSecondary,
    flex: 1,
    lineHeight: 17,
  },
});
