import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Brand } from '@/constants/Colors';
import {
  getPersonById,
  getVibeTag,
  RATING_PINS_FOR_ME,
} from '@/constants/data';

const { width } = Dimensions.get('window');

export default function PersonProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = getPersonById(id ?? '');
  const [waved, setWaved] = useState(false);

  if (!person) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Profile' }} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Profile not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backCta}>
            <Text style={styles.backCtaText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: Brand.background },
          headerTintColor: Brand.dark,
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero photo */}
        <View style={[styles.hero, { backgroundColor: person.photoColor }]}>
          <View style={styles.heroOverlay} />
          <Text style={styles.heroInitials}>
            {person.name.split(' ').map((n) => n[0]).join('')}
          </Text>
          {person.isHere && (
            <View style={styles.hereBadge}>
              <View style={styles.hereBadgeDot} />
              <Text style={styles.hereBadgeText}>HERE NOW · {person.distanceLabel.toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* Identity card */}
        <View style={styles.identityCard}>
          <View style={styles.identityRow}>
            <View>
              <Text style={styles.name}>{person.name}, {person.age}</Text>
              <Text style={styles.role}>{person.role}</Text>
              <Text style={styles.metaLine}>
                {person.starSign && `${person.starSign} · `}
                {person.city}
                {person.mutualConnections > 0 && ` · ${person.mutualConnections} mutual`}
              </Text>
            </View>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>{person.nightVibe.toFixed(1)}</Text>
              <Text style={styles.scoreLabel}>vibe</Text>
            </View>
          </View>

          <Text style={styles.bio}>{person.bio}</Text>

          {/* Action row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.primaryAction, waved && styles.primaryActionDone]}
              activeOpacity={0.85}
              onPress={() => setWaved(true)}
            >
              <FontAwesome
                name={waved ? 'check' : 'hand-paper-o'}
                size={14}
                color="#FFFFFF"
              />
              <Text style={styles.primaryActionText}>
                {waved ? 'Wave sent' : 'Send a wave'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryAction}
              activeOpacity={0.85}
              onPress={() => router.push('/plan/new' as any)}
            >
              <FontAwesome name="calendar-plus-o" size={14} color={Brand.blue} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryAction}
              activeOpacity={0.85}
              onPress={() => router.push(`/rate/${person.id}` as any)}
            >
              <FontAwesome name="bolt" size={14} color={Brand.orange} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Vibe tags */}
        <Text style={styles.sectionTitle}>How others see them</Text>
        <View style={styles.vibeWrap}>
          {person.vibeTagIds.map((vid, i) => {
            const tag = getVibeTag(vid);
            if (!tag) return null;
            const count = 3 + ((person.id.charCodeAt(0) + i) % 9);
            return (
              <View
                key={vid}
                style={[
                  styles.vibeBadge,
                  { backgroundColor: tag.color + '15', borderColor: tag.color + '50' },
                ]}
              >
                <FontAwesome name={tag.emoji as any} size={13} color={tag.color} />
                <Text style={[styles.vibeBadgeLabel, { color: tag.color }]}>
                  {tag.label}
                </Text>
                <Text style={styles.vibeBadgeCount}>{count}</Text>
              </View>
            );
          })}
        </View>

        {/* Photos */}
        <Text style={styles.sectionTitle}>Photos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoRow}
        >
          {person.photos.map((color, i) => (
            <View key={i} style={[styles.photoBig, { backgroundColor: color }]}>
              <Text style={styles.photoBigLabel}>{i + 1}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Recent pins */}
        <Text style={styles.sectionTitle}>Recent pins</Text>
        {RATING_PINS_FOR_ME.slice(0, 2).map((pin) => {
          const tag = getVibeTag(pin.vibeTagId);
          if (!tag) return null;
          return (
            <View key={pin.id} style={styles.pinCard}>
              <View
                style={[
                  styles.pinIcon,
                  { backgroundColor: tag.color + '18' },
                ]}
              >
                <FontAwesome name={tag.emoji as any} size={16} color={tag.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pinLabel}>{tag.label}</Text>
                <Text style={styles.pinMeta}>pinned at a recent night out</Text>
                {pin.note && <Text style={styles.pinNote}>“{pin.note}”</Text>}
              </View>
            </View>
          );
        })}

        {/* Report / block */}
        <View style={styles.dangerRow}>
          <TouchableOpacity style={styles.dangerLink} activeOpacity={0.7}>
            <FontAwesome name="flag" size={11} color={Brand.textSecondary} />
            <Text style={styles.dangerLinkText}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerLink} activeOpacity={0.7}>
            <FontAwesome name="ban" size={11} color={Brand.textSecondary} />
            <Text style={styles.dangerLinkText}>Block</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const HERO_HEIGHT = width * 0.7;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.background },
  scrollContent: { paddingBottom: 32 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: { color: Brand.textSecondary, fontSize: 15 },
  backCta: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: Brand.blue,
    borderRadius: 14,
  },
  backCtaText: { color: '#FFFFFF', fontWeight: '800' },
  hero: {
    height: HERO_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  heroInitials: {
    position: 'absolute',
    top: '32%',
    fontSize: 96,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 4,
  },
  hereBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 18,
  },
  hereBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Brand.success,
  },
  hereBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  identityCard: {
    backgroundColor: Brand.card,
    marginHorizontal: 16,
    marginTop: -28,
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 8,
  },
  identityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: Brand.dark,
  },
  role: {
    fontSize: 14,
    color: Brand.dark,
    marginTop: 2,
    fontWeight: '600',
  },
  metaLine: {
    fontSize: 12,
    color: Brand.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,184,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,184,0,0.4)',
  },
  scoreNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: Brand.warning,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Brand.warning,
    letterSpacing: 1,
  },
  bio: {
    fontSize: 14,
    color: Brand.dark,
    lineHeight: 20,
    marginTop: 14,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  primaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.blue,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    shadowColor: Brand.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryActionDone: {
    backgroundColor: Brand.success,
    shadowColor: Brand.success,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryAction: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Brand.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.dark,
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  vibeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  vibeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  vibeBadgeLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  vibeBadgeCount: {
    fontSize: 11,
    fontWeight: '800',
    color: Brand.textSecondary,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 5,
    borderRadius: 6,
    overflow: 'hidden',
  },
  photoRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 8,
    flexDirection: 'row',
  },
  photoBig: {
    width: 130,
    height: 170,
    borderRadius: 14,
    marginRight: 8,
    justifyContent: 'flex-end',
    padding: 10,
  },
  photoBigLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '800',
  },
  pinCard: {
    flexDirection: 'row',
    backgroundColor: Brand.card,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pinIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinLabel: { fontSize: 14, fontWeight: '800', color: Brand.dark },
  pinMeta: { fontSize: 11, color: Brand.textSecondary, marginTop: 2 },
  pinNote: {
    fontSize: 13,
    color: Brand.dark,
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 18,
  },

  dangerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
  },
  dangerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  dangerLinkText: {
    fontSize: 12,
    color: Brand.textSecondary,
    fontWeight: '700',
  },
});
