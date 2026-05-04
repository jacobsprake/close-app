import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Brand } from '@/constants/Colors';
import { NEARBY_PEOPLE, Plan } from '@/constants/data';

const VIBES: { id: Plan['vibe']; label: string; emoji: string; color: string }[] = [
  { id: 'chill', label: 'Chill',  emoji: '🌿', color: Brand.success },
  { id: 'classy', label: 'Classy', emoji: '🍷', color: '#7C5CFF' },
  { id: 'rowdy', label: 'Rowdy',  emoji: '🔥', color: Brand.danger },
  { id: 'random', label: 'Random', emoji: '🎲', color: Brand.warning },
];

const QUICK_TEMPLATES = [
  { emoji: '🍸', title: 'Aperitivo at…' },
  { emoji: '🍝', title: 'Dinner at…' },
  { emoji: '🎧', title: 'Going out to…' },
  { emoji: '🏃', title: 'Run around…' },
  { emoji: '☕', title: 'Coffee at…' },
  { emoji: '🎨', title: 'Walk through…' },
];

export default function NewPlanScreen() {
  const [emoji, setEmoji] = useState('🍸');
  const [title, setTitle] = useState('');
  const [spot, setSpot] = useState('');
  const [time, setTime] = useState('Tonight, 8pm');
  const [capacity, setCapacity] = useState(8);
  const [vibe, setVibe] = useState<Plan['vibe']>('classy');
  const [invited, setInvited] = useState<Set<string>>(new Set());

  const toggleInvite = (id: string) => {
    setInvited((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const canCreate = title.trim().length > 0 && spot.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'New plan',
          headerStyle: { backgroundColor: Brand.background },
          headerTintColor: Brand.dark,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '800' },
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Host something tonight</Text>
        <Text style={styles.subheading}>
          People nearby see your plan first. Be specific — a real time and place wins.
        </Text>

        {/* Quick templates */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.templatesRow}
        >
          {QUICK_TEMPLATES.map((t) => (
            <TouchableOpacity
              key={t.title}
              style={[styles.templateChip, emoji === t.emoji && styles.templateChipActive]}
              onPress={() => {
                setEmoji(t.emoji);
                setTitle(t.title);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.templateEmoji}>{t.emoji}</Text>
              <Text style={styles.templateText}>{t.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>What is it?</Text>
          <View style={styles.titleRow}>
            <Text style={styles.emojiInput}>{emoji}</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Spritz crawl through Brera"
              placeholderTextColor={Brand.textSecondary}
            />
          </View>
        </View>

        {/* Spot */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Where</Text>
          <TextInput
            style={styles.input}
            value={spot}
            onChangeText={setSpot}
            placeholder="Bar Basso, Via Plinio 39"
            placeholderTextColor={Brand.textSecondary}
          />
        </View>

        {/* Time */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>When</Text>
          <View style={styles.timeRow}>
            {['Tonight, 7pm', 'Tonight, 9pm', 'Friday, 8pm', 'Saturday, 11pm'].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.timeChip, time === opt && styles.timeChipActive]}
                onPress={() => setTime(opt)}
                activeOpacity={0.85}
              >
                <Text
                  style={[styles.timeChipText, time === opt && styles.timeChipTextActive]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Vibe */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Vibe</Text>
          <View style={styles.vibeRow}>
            {VIBES.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.vibeCard,
                  vibe === v.id && {
                    backgroundColor: v.color + '15',
                    borderColor: v.color,
                  },
                ]}
                onPress={() => setVibe(v.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.vibeEmoji}>{v.emoji}</Text>
                <Text
                  style={[
                    styles.vibeLabel,
                    vibe === v.id && { color: v.color, fontWeight: '800' },
                  ]}
                >
                  {v.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Capacity */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Capacity · {capacity} people</Text>
          <View style={styles.capacityRow}>
            {[2, 4, 6, 8, 12, 20].map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.capacityChip,
                  capacity === n && styles.capacityChipActive,
                ]}
                onPress={() => setCapacity(n)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.capacityChipText,
                    capacity === n && { color: '#FFFFFF' },
                  ]}
                >
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Invite people */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Invite from your circle · {invited.size} selected
          </Text>
          <View style={styles.inviteList}>
            {NEARBY_PEOPLE.map((p) => {
              const isInvited = invited.has(p.id);
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.inviteRow,
                    isInvited && styles.inviteRowActive,
                  ]}
                  onPress={() => toggleInvite(p.id)}
                  activeOpacity={0.85}
                >
                  <View
                    style={[styles.inviteAvatar, { backgroundColor: p.photoColor }]}
                  >
                    <Text style={styles.inviteAvatarText}>
                      {p.name.split(' ').map((n) => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inviteName}>{p.name}</Text>
                    <Text style={styles.inviteRole}>{p.role}</Text>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      isInvited && styles.checkboxActive,
                    ]}
                  >
                    {isInvited && (
                      <FontAwesome name="check" size={11} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.cta, !canCreate && { opacity: 0.4 }]}
          activeOpacity={0.85}
          disabled={!canCreate}
          onPress={() => router.back()}
        >
          <FontAwesome name="bolt" size={14} color="#FFFFFF" />
          <Text style={styles.ctaText}>Post plan to Milan</Text>
        </TouchableOpacity>

        <Text style={styles.footnote}>
          Plans auto-expire 1 hour after start. People who join unlock the address.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.background },
  scrollContent: { padding: 20, paddingBottom: 32 },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: Brand.dark,
  },
  subheading: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },

  templatesRow: {
    paddingVertical: 16,
    gap: 8,
    flexDirection: 'row',
  },
  templateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Brand.card,
    borderRadius: 16,
    gap: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  templateChipActive: {
    backgroundColor: Brand.blue,
    borderColor: Brand.blue,
  },
  templateEmoji: { fontSize: 16 },
  templateText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.dark,
  },

  field: { marginTop: 8, marginBottom: 14 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Brand.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emojiInput: {
    fontSize: 28,
    width: 44,
    textAlign: 'center',
  },
  input: {
    backgroundColor: Brand.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: Brand.dark,
    borderWidth: 1,
    borderColor: Brand.border,
  },

  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Brand.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  timeChipActive: {
    backgroundColor: Brand.blue,
    borderColor: Brand.blue,
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.dark,
  },
  timeChipTextActive: { color: '#FFFFFF' },

  vibeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  vibeCard: {
    flex: 1,
    backgroundColor: Brand.card,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Brand.border,
    gap: 4,
  },
  vibeEmoji: { fontSize: 22 },
  vibeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.dark,
  },

  capacityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  capacityChip: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: Brand.card,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Brand.border,
  },
  capacityChipActive: {
    backgroundColor: Brand.blue,
    borderColor: Brand.blue,
  },
  capacityChipText: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.dark,
  },

  inviteList: {
    backgroundColor: Brand.card,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Brand.border,
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
    gap: 12,
  },
  inviteRowActive: {
    backgroundColor: 'rgba(74,124,255,0.06)',
  },
  inviteAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  inviteName: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.dark,
  },
  inviteRole: {
    fontSize: 11,
    color: Brand.textSecondary,
    marginTop: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Brand.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Brand.blue,
    borderColor: Brand.blue,
  },

  cta: {
    flexDirection: 'row',
    backgroundColor: Brand.blue,
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: Brand.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  footnote: {
    textAlign: 'center',
    fontSize: 11,
    color: Brand.textSecondary,
    marginTop: 14,
    lineHeight: 16,
  },
});
