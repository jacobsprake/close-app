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
import { Stack, router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Brand } from '@/constants/Colors';
import { ME, getPersonById, VIBE_TAGS } from '@/constants/data';

export default function RateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isMe = id === 'me';
  const target = isMe ? null : getPersonById(id ?? '');

  const [vibeStars, setVibeStars] = useState(0);
  const [pinned, setPinned] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const targetName = isMe ? ME.name : target?.name ?? 'Someone';
  const targetColor = isMe ? Brand.blue : target?.photoColor ?? Brand.blue;
  const targetInitials = isMe
    ? ME.initials
    : target?.name.split(' ').map((n) => n[0]).join('') ?? '?';

  const canSubmit = vibeStars > 0 && pinned !== null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: isMe ? 'Rate yourself' : 'Pin a vibe',
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
        {/* Target */}
        <View style={styles.targetCard}>
          <View style={[styles.avatar, { backgroundColor: targetColor }]}>
            <Text style={styles.avatarText}>{targetInitials}</Text>
          </View>
          <Text style={styles.targetName}>{targetName}</Text>
          <Text style={styles.targetMeta}>
            {isMe ? 'Reflect on tonight' : 'How was the night with them?'}
          </Text>
        </View>

        {/* Star rating */}
        <Text style={styles.sectionTitle}>The night was…</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setVibeStars(n)}
              activeOpacity={0.85}
              style={styles.starButton}
            >
              <FontAwesome
                name={n <= vibeStars ? 'star' : 'star-o'}
                size={36}
                color={n <= vibeStars ? Brand.warning : Brand.border}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.starsCaption}>
          {vibeStars === 0 && 'Tap to rate the vibe'}
          {vibeStars === 1 && 'Survived'}
          {vibeStars === 2 && 'Eh, it was fine'}
          {vibeStars === 3 && 'Good night, would repeat'}
          {vibeStars === 4 && 'Top 10 nights'}
          {vibeStars === 5 && 'Legendary'}
        </Text>

        {/* Vibe tag pin */}
        <Text style={styles.sectionTitle}>Pin a vibe</Text>
        <Text style={styles.sectionSub}>
          The single thing that captured them tonight. Stays on their profile.
        </Text>

        <View style={styles.vibeWrap}>
          {VIBE_TAGS.map((tag) => {
            const selected = pinned === tag.id;
            return (
              <TouchableOpacity
                key={tag.id}
                onPress={() => setPinned(tag.id)}
                activeOpacity={0.85}
                style={[
                  styles.vibeOption,
                  {
                    backgroundColor: selected ? tag.color + '22' : Brand.card,
                    borderColor: selected ? tag.color : Brand.border,
                  },
                ]}
              >
                <FontAwesome
                  name={tag.emoji as any}
                  size={14}
                  color={selected ? tag.color : Brand.textSecondary}
                />
                <Text
                  style={[
                    styles.vibeOptionText,
                    { color: selected ? tag.color : Brand.dark, fontWeight: selected ? '800' : '600' },
                  ]}
                >
                  {tag.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Note */}
        <Text style={styles.sectionTitle}>One-line story (optional)</Text>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="“told the bouncer story 3 times. still funny.”"
          placeholderTextColor={Brand.textSecondary}
          multiline
          maxLength={140}
        />
        <Text style={styles.noteCounter}>{note.length}/140</Text>

        {/* Privacy note */}
        <View style={styles.privacyCard}>
          <FontAwesome name="shield" size={13} color={Brand.textSecondary} />
          <Text style={styles.privacyText}>
            Pins are public on their profile. Stars are aggregated — no one sees your individual rating.
            You can only pin people you’ve been physically near.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.cta, !canSubmit && { opacity: 0.4 }]}
          activeOpacity={0.85}
          disabled={!canSubmit}
          onPress={() => router.back()}
        >
          <FontAwesome name="bolt" size={14} color="#FFFFFF" />
          <Text style={styles.ctaText}>Pin it</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.background },
  scrollContent: { padding: 20, paddingBottom: 32 },
  targetCard: {
    backgroundColor: Brand.card,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  targetName: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.dark,
  },
  targetMeta: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.dark,
    marginTop: 24,
    marginBottom: 6,
  },
  sectionSub: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },

  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
    marginBottom: 6,
  },
  starButton: {
    padding: 4,
  },
  starsCaption: {
    textAlign: 'center',
    color: Brand.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },

  vibeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vibeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  vibeOptionText: {
    fontSize: 13,
  },

  noteInput: {
    backgroundColor: Brand.card,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: Brand.dark,
    minHeight: 80,
    borderWidth: 1,
    borderColor: Brand.border,
    textAlignVertical: 'top',
  },
  noteCounter: {
    textAlign: 'right',
    fontSize: 11,
    color: Brand.textSecondary,
    marginTop: 4,
  },

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 18,
    padding: 14,
    backgroundColor: 'rgba(74,124,255,0.06)',
    borderRadius: 12,
    gap: 10,
  },
  privacyText: {
    fontSize: 12,
    color: Brand.textSecondary,
    flex: 1,
    lineHeight: 17,
  },

  cta: {
    flexDirection: 'row',
    backgroundColor: Brand.orange,
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    shadowColor: Brand.orange,
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
});
