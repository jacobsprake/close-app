import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Brand } from '@/constants/Colors';
import { HOTSPOTS, Hotspot } from '@/constants/data';

const { width } = Dimensions.get('window');
const MAP_HEIGHT = width * 0.78;

function StylizedMap() {
  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapBackground}>
        {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
          <View
            key={`h-${i}`}
            style={[styles.gridLine, styles.horizontalLine, { top: `${pos * 100}%` }]}
          />
        ))}
        {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
          <View
            key={`v-${i}`}
            style={[styles.gridLine, styles.verticalLine, { left: `${pos * 100}%` }]}
          />
        ))}
        <View
          style={[
            styles.streetLine,
            { transform: [{ rotate: '35deg' }], top: '20%', left: '10%', width: '80%' },
          ]}
        />
        <View
          style={[
            styles.streetLine,
            { transform: [{ rotate: '-25deg' }], top: '60%', left: '5%', width: '70%' }
          ]}
        />

        {HOTSPOTS.map((spot) => (
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
                backgroundColor: `rgba(74, 124, 255, ${spot.intensity * 0.28})`,
                borderColor: `rgba(74, 124, 255, ${spot.intensity * 0.5})`,
              },
            ]}
          />
        ))}

        {HOTSPOTS.map((spot) => (
          <View
            key={`dot-${spot.id}`}
            style={[styles.hotspotDot, { left: `${spot.x}%`, top: `${spot.y}%` }]}
          >
            <View
              style={[
                styles.dotInner,
                {
                  backgroundColor: `rgba(255, 255, 255, ${0.5 + spot.intensity * 0.5})`,
                  width: 10 + spot.intensity * 8,
                  height: 10 + spot.intensity * 8,
                  borderRadius: 12,
                },
              ]}
            />
          </View>
        ))}

        {/* You-are-here ping */}
        <View style={[styles.youArePing, { left: '50%', top: '50%' }]}>
          <View style={styles.youArePingInner} />
        </View>
      </View>

      <View style={styles.mapLegend}>
        <FontAwesome name="map" size={12} color={Brand.textSecondary} />
        <Text style={styles.legendText}>CLOSE Hotspots · Milano</Text>
        <View style={styles.legendDivider} />
        <View style={styles.legendDot} />
        <Text style={styles.legendText}>You</Text>
      </View>
    </View>
  );
}

function getTrendIcon(trend: 'up' | 'down' | 'same'): {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
} {
  switch (trend) {
    case 'up': return { icon: 'arrow-up', color: Brand.success };
    case 'down': return { icon: 'arrow-down', color: Brand.danger };
    case 'same': return { icon: 'minus', color: Brand.textSecondary };
  }
}

function HotspotListItem({ spot, rank }: { spot: Hotspot; rank: number }) {
  const trend = getTrendIcon(spot.trend);
  return (
    <TouchableOpacity style={styles.hotspotCard} activeOpacity={0.85}>
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
        <FontAwesome name={trend.icon} size={11} color={trend.color} />
      </View>
    </TouchableOpacity>
  );
}

export default function MapScreen() {
  const sorted = [...HOTSPOTS].sort((a, b) => b.encounters - a.encounters);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hotspots</Text>
          <Text style={styles.headerSubtitle}>Where Close people gather</Text>
        </View>

        <StylizedMap />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top spots this week</Text>
          <Text style={styles.sectionMeta}>Milan</Text>
        </View>

        {sorted.map((spot, index) => (
          <HotspotListItem key={spot.id} spot={spot} rank={index + 1} />
        ))}

        <View style={styles.privacyNote}>
          <FontAwesome name="lock" size={13} color={Brand.textSecondary} />
          <Text style={styles.privacyText}>
            Hotspots are aggregated and anonymized. We never show one person’s location.
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
  mapContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#0F1322',
  },
  mapBackground: {
    width: '100%',
    height: MAP_HEIGHT,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  horizontalLine: { width: '100%', height: 1 },
  verticalLine: { height: '100%', width: 1 },
  streetLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
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
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  youArePing: {
    position: 'absolute',
    width: 22,
    height: 22,
    marginLeft: -11,
    marginTop: -11,
    borderRadius: 11,
    backgroundColor: 'rgba(255,107,53,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  youArePingInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Brand.orange,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    gap: 8,
  },
  legendText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
  },
  legendDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Brand.orange,
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
    fontWeight: '800',
    color: Brand.dark,
  },
  sectionMeta: {
    fontSize: 13,
    color: Brand.textSecondary,
    fontWeight: '700',
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
  hotspotInfo: { flex: 1 },
  hotspotName: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.dark,
  },
  hotspotEncounters: {
    fontSize: 12,
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
    gap: 8,
  },
  privacyText: {
    fontSize: 12,
    color: Brand.textSecondary,
    flex: 1,
    lineHeight: 17,
  },
});
