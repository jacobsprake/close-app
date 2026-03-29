import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Brand } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const MAP_HEIGHT = width * 0.75;

interface Hotspot {
  id: string;
  name: string;
  encounters: number;
  trend: 'up' | 'down' | 'same';
  // position on the stylized map (percentage)
  x: number;
  y: number;
  radius: number; // visual size
  intensity: number; // 0-1 opacity
}

const MOCK_HOTSPOTS: Hotspot[] = [
  { id: '1', name: 'Central Cafe', encounters: 12, trend: 'up', x: 45, y: 35, radius: 50, intensity: 0.9 },
  { id: '2', name: 'WeWork Milano', encounters: 9, trend: 'up', x: 70, y: 25, radius: 42, intensity: 0.75 },
  { id: '3', name: 'Parco Sempione', encounters: 7, trend: 'same', x: 25, y: 45, radius: 55, intensity: 0.6 },
  { id: '4', name: 'Navigli District', encounters: 6, trend: 'down', x: 55, y: 70, radius: 38, intensity: 0.5 },
  { id: '5', name: 'Starbucks Reserve', encounters: 5, trend: 'up', x: 35, y: 55, radius: 32, intensity: 0.45 },
  { id: '6', name: 'Biblioteca Ambrosiana', encounters: 3, trend: 'same', x: 80, y: 60, radius: 28, intensity: 0.3 },
];

function StylizedMap() {
  return (
    <View style={styles.mapContainer}>
      {/* Grid lines for the stylized map */}
      <View style={styles.mapBackground}>
        {/* Horizontal grid lines */}
        {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
          <View
            key={`h-${i}`}
            style={[
              styles.gridLine,
              styles.horizontalLine,
              { top: `${pos * 100}%` },
            ]}
          />
        ))}
        {/* Vertical grid lines */}
        {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
          <View
            key={`v-${i}`}
            style={[
              styles.gridLine,
              styles.verticalLine,
              { left: `${pos * 100}%` },
            ]}
          />
        ))}
        {/* Diagonal street lines */}
        <View style={[styles.streetLine, { transform: [{ rotate: '35deg' }], top: '20%', left: '10%', width: '80%' }]} />
        <View style={[styles.streetLine, { transform: [{ rotate: '-25deg' }], top: '60%', left: '5%', width: '70%' }]} />

        {/* Heat zones */}
        {MOCK_HOTSPOTS.map((spot) => (
          <View
            key={spot.id}
            style={[
              styles.heatZone,
              {
                left: `${spot.x - spot.radius / (MAP_HEIGHT / 50)}%`,
                top: `${spot.y - spot.radius / (MAP_HEIGHT / 50)}%`,
                width: spot.radius * 2,
                height: spot.radius * 2,
                borderRadius: spot.radius,
                backgroundColor: `rgba(74, 124, 255, ${spot.intensity * 0.25})`,
                borderColor: `rgba(74, 124, 255, ${spot.intensity * 0.4})`,
              },
            ]}
          />
        ))}

        {/* Hotspot dots with labels */}
        {MOCK_HOTSPOTS.map((spot) => (
          <View
            key={`dot-${spot.id}`}
            style={[
              styles.hotspotDot,
              {
                left: `${spot.x}%`,
                top: `${spot.y}%`,
              },
            ]}
          >
            <View
              style={[
                styles.dotInner,
                {
                  backgroundColor: `rgba(74, 124, 255, ${0.5 + spot.intensity * 0.5})`,
                  width: 8 + spot.intensity * 8,
                  height: 8 + spot.intensity * 8,
                  borderRadius: 10,
                },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Map legend */}
      <View style={styles.mapLegend}>
        <FontAwesome name="map" size={12} color={Brand.textSecondary} />
        <Text style={styles.legendText}>CLOSE Hotspots - Milano</Text>
      </View>
    </View>
  );
}

function getTrendIcon(trend: 'up' | 'down' | 'same'): { icon: React.ComponentProps<typeof FontAwesome>['name']; color: string } {
  switch (trend) {
    case 'up':
      return { icon: 'arrow-up', color: Brand.success };
    case 'down':
      return { icon: 'arrow-down', color: Brand.danger };
    case 'same':
      return { icon: 'minus', color: Brand.textSecondary };
  }
}

function HotspotListItem({ spot, rank }: { spot: Hotspot; rank: number }) {
  const trend = getTrendIcon(spot.trend);

  return (
    <View style={styles.hotspotCard}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
      <View style={styles.hotspotInfo}>
        <Text style={styles.hotspotName}>{spot.name}</Text>
        <Text style={styles.hotspotEncounters}>
          {spot.encounters} encounters this week
        </Text>
      </View>
      <View style={styles.trendContainer}>
        <FontAwesome name={trend.icon} size={12} color={trend.color} />
      </View>
    </View>
  );
}

export default function MapScreen() {
  const sorted = [...MOCK_HOTSPOTS].sort((a, b) => b.encounters - a.encounters);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hotspots</Text>
          <Text style={styles.headerSubtitle}>
            Where CLOSE users gather
          </Text>
        </View>

        <StylizedMap />

        {/* Top Hotspots list */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Hotspots</Text>
          <Text style={styles.sectionMeta}>This week</Text>
        </View>

        {sorted.map((spot, index) => (
          <HotspotListItem key={spot.id} spot={spot} rank={index + 1} />
        ))}

        {/* Privacy note */}
        <View style={styles.privacyNote}>
          <FontAwesome name="lock" size={14} color={Brand.textSecondary} />
          <Text style={styles.privacyText}>
            No individual locations are ever shown. Hotspots are aggregated and anonymized.
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
  mapContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1A1E2E',
  },
  mapBackground: {
    width: '100%',
    height: MAP_HEIGHT,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  horizontalLine: {
    width: '100%',
    height: 1,
  },
  verticalLine: {
    height: '100%',
    width: 1,
  },
  streetLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heatZone: {
    position: 'absolute',
    borderWidth: 1,
  },
  hotspotDot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
    marginTop: -8,
  },
  dotInner: {
    shadowColor: Brand.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  mapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  legendText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 6,
    fontWeight: '600',
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
  sectionMeta: {
    fontSize: 13,
    color: Brand.textSecondary,
    fontWeight: '600',
  },
  hotspotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.card,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(74, 124, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '800',
    color: Brand.blue,
  },
  hotspotInfo: {
    flex: 1,
  },
  hotspotName: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.dark,
  },
  hotspotEncounters: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginTop: 2,
  },
  trendContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Brand.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 14,
    backgroundColor: 'rgba(74, 124, 255, 0.06)',
    borderRadius: 12,
  },
  privacyText: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});
