import React, { useEffect, useRef } from 'react';
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
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Brand } from '@/constants/Colors';

const { width } = Dimensions.get('window');

interface Encounter {
  id: string;
  location: string;
  timeAgo: string;
  connected: boolean;
  peopleCount: number;
}

const MOCK_ENCOUNTERS: Encounter[] = [
  { id: '1', location: 'Starbucks Reserve', timeAgo: '2 min ago', connected: false, peopleCount: 2 },
  { id: '2', location: 'WeWork Milano', timeAgo: '15 min ago', connected: true, peopleCount: 1 },
  { id: '3', location: 'Parco Sempione', timeAgo: '1 hour ago', connected: false, peopleCount: 3 },
  { id: '4', location: 'Fondazione Prada', timeAgo: '3 hours ago', connected: true, peopleCount: 1 },
  { id: '5', location: 'Navigli District', timeAgo: '5 hours ago', connected: false, peopleCount: 2 },
  { id: '6', location: 'Biblioteca Ambrosiana', timeAgo: 'Yesterday', connected: false, peopleCount: 1 },
];

function PulsingRadar() {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createPulse = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const a1 = createPulse(pulse1, 0);
    const a2 = createPulse(pulse2, 666);
    const a3 = createPulse(pulse3, 1333);
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
    const scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });
    const opacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    });

    return (
      <Animated.View
        style={[
          styles.pulseRing,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.radarContainer}>
      {renderRing(pulse1)}
      {renderRing(pulse2)}
      {renderRing(pulse3)}
      <View style={styles.radarCenter}>
        <FontAwesome name="wifi" size={28} color="#FFFFFF" />
      </View>
    </View>
  );
}

function EncounterCard({ encounter }: { encounter: Encounter }) {
  return (
    <View style={styles.encounterCard}>
      <View style={styles.encounterLeft}>
        <View style={styles.encounterIcon}>
          <FontAwesome name="map-pin" size={14} color={Brand.blue} />
        </View>
        <View style={styles.encounterInfo}>
          <Text style={styles.encounterLocation}>
            {encounter.peopleCount > 1
              ? `${encounter.peopleCount} people at ${encounter.location}`
              : `Someone at ${encounter.location}`}
          </Text>
          <Text style={styles.encounterTime}>{encounter.timeAgo}</Text>
        </View>
      </View>
      {encounter.connected ? (
        <View style={styles.connectedBadge}>
          <FontAwesome name="check" size={12} color={Brand.success} />
          <Text style={styles.connectedText}>Connected</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.connectButton}>
          <Text style={styles.connectButtonText}>Connect</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function NearbyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CLOSE</Text>
          <Text style={styles.headerSubtitle}>Proximity Network</Text>
        </View>

        {/* Radar */}
        <PulsingRadar />
        <Text style={styles.discoveringText}>Discovering nearby...</Text>

        {/* Nearby count */}
        <View style={styles.nearbyCountContainer}>
          <View style={styles.nearbyCountDot} />
          <Text style={styles.nearbyCountText}>3 people nearby right now</Text>
        </View>

        {/* Recent Encounters */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Encounters</Text>
          <Text style={styles.sectionCount}>{MOCK_ENCOUNTERS.length}</Text>
        </View>

        {MOCK_ENCOUNTERS.map((encounter) => (
          <EncounterCard key={encounter.id} encounter={encounter} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const RADAR_SIZE = width * 0.55;

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
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Brand.dark,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Brand.textSecondary,
    marginTop: 2,
  },
  radarContainer: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Brand.blue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Brand.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  discoveringText: {
    textAlign: 'center',
    fontSize: 15,
    color: Brand.textSecondary,
    marginBottom: 16,
  },
  nearbyCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74, 124, 255, 0.08)',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  nearbyCountDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Brand.success,
    marginRight: 8,
  },
  nearbyCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.blue,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Brand.dark,
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.textSecondary,
    backgroundColor: Brand.border,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  encounterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Brand.card,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  encounterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  encounterIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(74, 124, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  encounterInfo: {
    flex: 1,
  },
  encounterLocation: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.dark,
  },
  encounterTime: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginTop: 2,
  },
  connectButton: {
    backgroundColor: Brand.blue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  connectedText: {
    color: Brand.success,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
});
