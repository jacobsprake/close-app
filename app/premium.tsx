import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Brand } from '@/constants/Colors';

const PERKS: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  title: string;
  desc: string;
}[] = [
  {
    icon: 'eye',
    title: 'See who waved at you',
    desc: 'Skip the guessing — see every wave you’ve ever received, ranked by mutual proximity.',
  },
  {
    icon: 'eye-slash',
    title: 'Go invisible',
    desc: 'Be there but unseen. Browse the room without showing up on anyone’s radar.',
  },
  {
    icon: 'globe',
    title: 'Unlock other cities',
    desc: 'Going to Berlin? Lisbon? Get full Close access in any city — including a 7-day “arrived” boost.',
  },
  {
    icon: 'history',
    title: 'Replay your nights',
    desc: 'See every encounter, plan, and pin from past nights. Re-discover who you crossed paths with.',
  },
  {
    icon: 'magic',
    title: 'Vibe rewind',
    desc: 'Pin a vibe up to 30 days after a night, instead of 24 hours.',
  },
  {
    icon: 'rocket',
    title: 'Boost your plans',
    desc: 'Pin your plan to the top of the city feed for 1 hour. Once a week, on the house.',
  },
];

const PLANS = [
  {
    id: 'monthly',
    title: 'Monthly',
    price: '€8.99',
    period: '/month',
    cta: 'Try free for 7 days',
    badge: null,
  },
  {
    id: 'annual',
    title: 'Annual',
    price: '€59.99',
    period: '/year',
    cta: 'Best value · save 44%',
    badge: 'POPULAR',
  },
  {
    id: 'lifetime',
    title: 'Founder',
    price: '€199',
    period: 'one time · lifetime',
    cta: 'Limited to first 1,000',
    badge: 'RARE',
  },
];

export default function PremiumScreen() {
  const [selected, setSelected] = useState('annual');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: Brand.dark },
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.logoRow}>
            <Text style={styles.logoText}>CLOSE</Text>
            <View style={styles.plusBadge}>
              <FontAwesome name="bolt" size={11} color="#FFFFFF" />
              <Text style={styles.plusBadgeText}>PLUS</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>
            Close, but more.
          </Text>
          <Text style={styles.heroSub}>
            Everything in Close, with the unfair advantages your social life deserves.
          </Text>
        </View>

        <View style={styles.perksList}>
          {PERKS.map((perk, i) => (
            <View key={i} style={styles.perkRow}>
              <View style={styles.perkIcon}>
                <FontAwesome name={perk.icon} size={16} color={Brand.orange} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.perkTitle}>{perk.title}</Text>
                <Text style={styles.perkDesc}>{perk.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.plansSection}>
          <Text style={styles.plansTitle}>Pick your plan</Text>
          {PLANS.map((p) => {
            const active = selected === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.planCard, active && styles.planCardActive]}
                onPress={() => setSelected(p.id)}
                activeOpacity={0.85}
              >
                <View style={styles.planRadio}>
                  <View
                    style={[
                      styles.planRadioOuter,
                      active && styles.planRadioOuterActive,
                    ]}
                  >
                    {active && <View style={styles.planRadioDot} />}
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.planTitleRow}>
                    <Text style={styles.planTitle}>{p.title}</Text>
                    {p.badge && (
                      <View
                        style={[
                          styles.planBadge,
                          p.badge === 'RARE' && { backgroundColor: '#5856D6' },
                        ]}
                      >
                        <Text style={styles.planBadgeText}>{p.badge}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPrice}>{p.price}</Text>
                    <Text style={styles.planPeriod}>{p.period}</Text>
                  </View>
                  <Text style={styles.planCta}>{p.cta}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Text style={styles.ctaText}>Start free trial</Text>
        </TouchableOpacity>

        <Text style={styles.fineprint}>
          Cancel anytime in Settings · Renews automatically · Privacy-first by design
        </Text>

        {/* Why we charge */}
        <View style={styles.whyCard}>
          <Text style={styles.whyTitle}>Why we charge</Text>
          <Text style={styles.whyText}>
            Close will never run ads. Your location, your pins, your photos — those aren’t a product. Plus subscriptions are how we keep the lights on and the city vibe alive.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.dark },
  scrollContent: { paddingBottom: 32 },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: Brand.dark,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  plusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.orange,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  plusBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 42,
  },
  heroSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 10,
    lineHeight: 22,
  },

  perksList: {
    backgroundColor: Brand.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  perkRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  perkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,107,53,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  perkTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.dark,
  },
  perkDesc: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },

  plansSection: {
    backgroundColor: Brand.background,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  plansTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Brand.dark,
    marginBottom: 12,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Brand.border,
    gap: 12,
  },
  planCardActive: {
    borderColor: Brand.orange,
    backgroundColor: 'rgba(255,107,53,0.05)',
  },
  planRadio: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planRadioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Brand.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planRadioOuterActive: {
    borderColor: Brand.orange,
  },
  planRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Brand.orange,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.dark,
  },
  planBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: Brand.orange,
    borderRadius: 6,
  },
  planBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
    gap: 4,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: Brand.dark,
  },
  planPeriod: {
    fontSize: 12,
    color: Brand.textSecondary,
    fontWeight: '600',
  },
  planCta: {
    fontSize: 12,
    color: Brand.orange,
    fontWeight: '700',
    marginTop: 4,
  },

  cta: {
    backgroundColor: Brand.orange,
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: Brand.orange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  fineprint: {
    textAlign: 'center',
    color: Brand.textSecondary,
    fontSize: 11,
    marginTop: 12,
    paddingHorizontal: 20,
    backgroundColor: Brand.background,
    paddingBottom: 18,
  },
  whyCard: {
    backgroundColor: Brand.background,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  whyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.dark,
    marginBottom: 6,
  },
  whyText: {
    fontSize: 12,
    color: Brand.textSecondary,
    lineHeight: 18,
  },
});
