import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Brand } from '@/constants/Colors';
import {
  CITY_CHAT,
  PLANS,
  VIBE_TAGS,
  ME,
  ChatMessage,
  Plan,
  getPersonById,
  getVibeTag,
} from '@/constants/data';

function VibeMiniChip({ vibeId }: { vibeId: string }) {
  const tag = getVibeTag(vibeId);
  if (!tag) return null;
  return (
    <View
      style={[
        styles.miniChip,
        { backgroundColor: tag.color + '1A', borderColor: tag.color + '55' },
      ]}
    >
      <FontAwesome name={tag.emoji as any} size={9} color={tag.color} />
      <Text style={[styles.miniChipText, { color: tag.color }]}>{tag.label}</Text>
    </View>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const host = getPersonById(plan.hostId);
  const goingCount = plan.goingIds.length;
  const pct = Math.min(goingCount / plan.capacity, 1);

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.planCard}>
      <View style={styles.planHeader}>
        <Text style={styles.planEmoji}>{plan.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.planTitle} numberOfLines={1}>
            {plan.title}
          </Text>
          <Text style={styles.planMeta}>
            {plan.startsAt} · {plan.neighborhood}
          </Text>
        </View>
        <View style={[styles.vibePill, vibePillColor(plan.vibe)]}>
          <Text style={[styles.vibePillText, vibePillTextColor(plan.vibe)]}>
            {plan.vibe}
          </Text>
        </View>
      </View>

      <Text style={styles.planSpot} numberOfLines={1}>
        <FontAwesome name="map-pin" size={11} color={Brand.textSecondary} />{'  '}
        {plan.spot}
      </Text>

      <Text style={styles.planDescription} numberOfLines={2}>
        {plan.description}
      </Text>

      <View style={styles.planFooter}>
        <View style={styles.avatarStack}>
          {plan.goingIds.slice(0, 4).map((id, i) => {
            const isMe = id === 'me';
            const p = isMe ? null : getPersonById(id);
            const color = isMe ? Brand.blue : p?.photoColor ?? Brand.blue;
            const initials = isMe
              ? ME.initials
              : p
                ? p.name.split(' ').map((n) => n[0]).join('')
                : '?';
            return (
              <View
                key={id}
                style={[
                  styles.stackAvatar,
                  { backgroundColor: color, marginLeft: i === 0 ? 0 : -10 },
                ]}
              >
                <Text style={styles.stackAvatarText}>{initials}</Text>
              </View>
            );
          })}
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={styles.capacityBarBg}>
            <View
              style={[
                styles.capacityBarFill,
                { width: `${pct * 100}%`, backgroundColor: pct >= 1 ? Brand.danger : Brand.blue },
              ]}
            />
          </View>
          <Text style={styles.capacityText}>
            {goingCount}/{plan.capacity} going · hosted by {host?.name.split(' ')[0]}
          </Text>
        </View>

        <TouchableOpacity style={styles.joinButton} activeOpacity={0.85}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function vibePillColor(vibe: Plan['vibe']) {
  switch (vibe) {
    case 'rowdy': return { backgroundColor: 'rgba(255,59,48,0.1)' };
    case 'classy': return { backgroundColor: 'rgba(124,92,255,0.12)' };
    case 'chill': return { backgroundColor: 'rgba(52,199,89,0.12)' };
    default: return { backgroundColor: 'rgba(255,184,0,0.15)' };
  }
}
function vibePillTextColor(vibe: Plan['vibe']) {
  switch (vibe) {
    case 'rowdy': return { color: Brand.danger };
    case 'classy': return { color: '#7C5CFF' };
    case 'chill': return { color: Brand.success };
    default: return { color: Brand.warning };
  }
}

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const author = getPersonById(msg.authorId);
  return (
    <View style={[styles.chatRow, msg.pinned && styles.chatRowPinned]}>
      <View
        style={[
          styles.chatAvatar,
          { backgroundColor: author?.photoColor ?? Brand.blue },
        ]}
      >
        <Text style={styles.chatAvatarText}>
          {author?.name.split(' ').map((n) => n[0]).join('') ?? '?'}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.chatHeaderRow}>
          <Text style={styles.chatAuthor}>{author?.name ?? 'Someone'}</Text>
          {msg.pinned && (
            <View style={styles.pinnedTag}>
              <FontAwesome name="thumb-tack" size={9} color={Brand.orange} />
              <Text style={styles.pinnedTagText}>Pinned</Text>
            </View>
          )}
          <Text style={styles.chatTime}>{msg.timeAgo}</Text>
        </View>
        <Text style={styles.chatText}>{msg.text}</Text>
        {msg.reactions && (
          <View style={styles.reactionRow}>
            {msg.reactions.map((r, i) => (
              <View key={i} style={styles.reactionPill}>
                <Text style={styles.reactionEmoji}>{r.emoji}</Text>
                <Text style={styles.reactionCount}>{r.count}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addReaction} activeOpacity={0.7}>
              <FontAwesome name="plus" size={9} color={Brand.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

export default function CityScreen() {
  const [draft, setDraft] = useState('');

  const trendingVibes = useMemo(() => {
    return VIBE_TAGS.slice(0, 5);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Milano</Text>
            <View style={styles.headerSubtitleRow}>
              <View style={styles.liveDot} />
              <Text style={styles.headerSubtitle}>
                234 active · 12 plans tonight
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.newPlanButton}
            onPress={() => router.push('/plan/new' as any)}
            activeOpacity={0.85}
          >
            <FontAwesome name="plus" size={12} color="#FFFFFF" />
            <Text style={styles.newPlanText}>Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Trending vibes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending vibes</Text>
          <Text style={styles.sectionMeta}>this week in Milan</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingRow}
        >
          {trendingVibes.map((tag) => (
            <View
              key={tag.id}
              style={[
                styles.trendingChip,
                { backgroundColor: tag.color + '15', borderColor: tag.color + '50' },
              ]}
            >
              <FontAwesome name={tag.emoji as any} size={14} color={tag.color} />
              <Text style={[styles.trendingChipText, { color: tag.color }]}>
                {tag.label}
              </Text>
              <Text style={styles.trendingChipCount}>
                {Math.floor(Math.random() * 80) + 20}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Plans tonight */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Plans tonight</Text>
          <TouchableOpacity onPress={() => router.push('/plan/new' as any)}>
            <Text style={styles.sectionLink}>+ Host one</Text>
          </TouchableOpacity>
        </View>
        {PLANS.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}

        {/* City chat */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>City chat</Text>
          <Text style={styles.sectionMeta}>fades in 24h</Text>
        </View>

        <View style={styles.chatCard}>
          {CITY_CHAT.map((m) => (
            <ChatBubble key={m.id} msg={m} />
          ))}

          <View style={styles.composerRow}>
            <TextInput
              style={styles.composer}
              placeholder="Say something to Milan…"
              placeholderTextColor={Brand.textSecondary}
              value={draft}
              onChangeText={setDraft}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                draft.trim().length === 0 && { opacity: 0.4 },
              ]}
              activeOpacity={0.8}
              disabled={draft.trim().length === 0}
              onPress={() => setDraft('')}
            >
              <FontAwesome name="paper-plane" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.background },
  scrollContent: { paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Brand.success,
  },
  newPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Brand.blue,
    borderRadius: 22,
    gap: 6,
    shadowColor: Brand.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newPlanText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Brand.dark,
  },
  sectionMeta: {
    fontSize: 12,
    color: Brand.textSecondary,
    fontWeight: '600',
  },
  sectionLink: {
    fontSize: 13,
    color: Brand.blue,
    fontWeight: '700',
  },
  trendingRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    flexDirection: 'row',
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    marginRight: 8,
  },
  trendingChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  trendingChipCount: {
    fontSize: 11,
    fontWeight: '800',
    color: Brand.textSecondary,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    marginLeft: 4,
    overflow: 'hidden',
  },

  // plan card
  planCard: {
    backgroundColor: Brand.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planEmoji: {
    fontSize: 28,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.dark,
  },
  planMeta: {
    fontSize: 12,
    color: Brand.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  vibePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  vibePillText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planSpot: {
    fontSize: 13,
    color: Brand.dark,
    fontWeight: '600',
    marginTop: 12,
  },
  planDescription: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginTop: 6,
    lineHeight: 18,
  },
  planFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  stackAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackAvatarText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  capacityBarBg: {
    height: 4,
    backgroundColor: Brand.border,
    borderRadius: 2,
  },
  capacityBarFill: {
    height: 4,
    borderRadius: 2,
  },
  capacityText: {
    fontSize: 11,
    color: Brand.textSecondary,
    fontWeight: '600',
    marginTop: 4,
  },
  joinButton: {
    backgroundColor: Brand.blue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 10,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },

  // chat
  chatCard: {
    backgroundColor: Brand.card,
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  chatRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
    paddingHorizontal: 4,
  },
  chatRowPinned: {
    backgroundColor: 'rgba(255,107,53,0.05)',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginVertical: 4,
    borderBottomWidth: 0,
  },
  chatAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  chatAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 8,
  },
  chatAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.dark,
  },
  chatTime: {
    fontSize: 11,
    color: Brand.textSecondary,
    marginLeft: 'auto',
  },
  pinnedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,53,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    gap: 3,
  },
  pinnedTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: Brand.orange,
  },
  chatText: {
    fontSize: 14,
    color: Brand.dark,
    lineHeight: 19,
  },
  reactionRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 6,
    flexWrap: 'wrap',
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  reactionEmoji: {
    fontSize: 12,
  },
  reactionCount: {
    fontSize: 11,
    fontWeight: '700',
    color: Brand.dark,
  },
  addReaction: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: Brand.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  composer: {
    flex: 1,
    backgroundColor: Brand.background,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Brand.dark,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Brand.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },

  miniChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  miniChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
