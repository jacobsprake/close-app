import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Brand } from '@/constants/Colors';
import { ME, RATING_PINS_FOR_ME, getPersonById, getVibeTag } from '@/constants/data';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 16 * 2 - 8 * 2) / 3;

function ProfileStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, color ? { color } : null]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingsItem({
  icon,
  label,
  trailing,
  onPress,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  trailing?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingsLeft}>
        <FontAwesome name={icon} size={15} color={Brand.textSecondary} />
        <Text style={styles.settingsLabel}>{label}</Text>
      </View>
      <View style={styles.settingsRight}>
        {trailing && <Text style={styles.settingsTrailing}>{trailing}</Text>}
        <FontAwesome name="chevron-right" size={11} color={Brand.border} />
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>You</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/rate/me' as any)}
            >
              <FontAwesome name="bolt" size={16} color={Brand.orange} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="cog" size={18} color={Brand.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{ME.initials}</Text>
            <View style={styles.profileLiveDot} />
          </View>
          <Text style={styles.profileName}>{ME.name}</Text>
          <Text style={styles.profileMeta}>
            {ME.age} · {ME.starSign} · {ME.city}
          </Text>
          <Text style={styles.profileBio}>{ME.bio}</Text>

          <View style={styles.statsRow}>
            <ProfileStat label="People met" value={String(ME.stats.peopleMet)} />
            <View style={styles.statDivider} />
            <ProfileStat label="Connections" value={String(ME.stats.activeConnections)} color={Brand.success} />
            <View style={styles.statDivider} />
            <ProfileStat label="Nights out" value={String(ME.stats.nightsOut)} color={Brand.orange} />
            <View style={styles.statDivider} />
            <ProfileStat label="Vibe" value={ME.stats.avgVibe.toFixed(1)} color={Brand.warning} />
          </View>

          <TouchableOpacity style={styles.editButton} activeOpacity={0.85}>
            <FontAwesome name="pencil" size={12} color={Brand.dark} />
            <Text style={styles.editButtonText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* Premium CTA */}
        <TouchableOpacity
          style={styles.premiumCard}
          activeOpacity={0.9}
          onPress={() => router.push('/premium' as any)}
        >
          <View style={styles.premiumIconWrap}>
            <FontAwesome name="bolt" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.premiumTitle}>Close Plus</Text>
            <Text style={styles.premiumSubtitle}>
              See who waved · go invisible · unlock other cities
            </Text>
          </View>
          <FontAwesome name="chevron-right" size={14} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* Photo grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>+ Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.photoGrid}>
          {ME.photoColors.map((color, i) => (
            <View
              key={i}
              style={[
                styles.photoTile,
                { backgroundColor: color, marginRight: (i + 1) % 3 === 0 ? 0 : 8 },
              ]}
            >
              <Text style={styles.photoLabel}>{i + 1}</Text>
            </View>
          ))}
        </View>

        {/* Vibe pins others gave you */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pinned by others</Text>
          <Text style={styles.sectionMeta}>{RATING_PINS_FOR_ME.length} this month</Text>
        </View>

        {RATING_PINS_FOR_ME.map((pin) => {
          const author = getPersonById(pin.authorId);
          const tag = getVibeTag(pin.vibeTagId);
          if (!tag) return null;
          return (
            <View key={pin.id} style={styles.pinCard}>
              <View
                style={[
                  styles.pinIcon,
                  { backgroundColor: tag.color + '15' },
                ]}
              >
                <FontAwesome name={tag.emoji as any} size={18} color={tag.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pinTagLabel}>{tag.label}</Text>
                <Text style={styles.pinAuthor}>
                  by {author?.name ?? 'Someone'} · {pin.date}
                </Text>
                {pin.note && <Text style={styles.pinNote}>“{pin.note}”</Text>}
              </View>
            </View>
          );
        })}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your top vibes</Text>
        </View>
        <View style={styles.topVibesRow}>
          {ME.topVibeIds.map((vid) => {
            const tag = getVibeTag(vid);
            if (!tag) return null;
            return (
              <View
                key={vid}
                style={[
                  styles.topVibeCard,
                  { backgroundColor: tag.color + '12', borderColor: tag.color + '40' },
                ]}
              >
                <FontAwesome name={tag.emoji as any} size={20} color={tag.color} />
                <Text style={[styles.topVibeText, { color: tag.color }]}>{tag.label}</Text>
                <Text style={styles.topVibeCount}>
                  {Math.floor(Math.random() * 8) + 3} pins
                </Text>
              </View>
            );
          })}
        </View>

        {/* Settings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Settings</Text>
        </View>
        <View style={styles.settingsCard}>
          <SettingsItem icon="bluetooth-b" label="Bluetooth discovery" trailing="On" />
          <SettingsItem icon="wifi" label="Nearby Interaction" trailing="On" />
          <SettingsItem icon="eye-slash" label="Go invisible" trailing="Plus" />
          <SettingsItem icon="bell" label="Notifications" />
          <SettingsItem icon="shield" label="Who can see you" trailing="Connections" />
          <SettingsItem icon="ban" label="Blocked profiles" />
          <SettingsItem icon="question-circle" label="Help & support" />
          <SettingsItem icon="info-circle" label="About Close" />
        </View>

        <Text style={styles.versionText}>CLOSE v1.0 · made with espresso in Milan</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.background },
  scrollContent: { paddingBottom: 32 },
  headerRow: {
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Brand.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  profileCard: {
    backgroundColor: Brand.card,
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 16,
  },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Brand.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: Brand.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  avatarLargeText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileLiveDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Brand.success,
    borderWidth: 3,
    borderColor: Brand.card,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: Brand.dark,
  },
  profileMeta: {
    fontSize: 13,
    color: Brand.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  profileBio: {
    fontSize: 14,
    color: Brand.dark,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Brand.blue,
  },
  statLabel: {
    fontSize: 10,
    color: Brand.textSecondary,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Brand.border,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Brand.background,
    borderRadius: 18,
    marginTop: 18,
    gap: 6,
  },
  editButtonText: {
    color: Brand.dark,
    fontWeight: '800',
    fontSize: 13,
  },

  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: Brand.orange,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    marginBottom: 22,
    shadowColor: Brand.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  premiumIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  premiumSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 4,
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

  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  photoTile: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 14,
    marginBottom: 8,
    justifyContent: 'flex-end',
    padding: 10,
  },
  photoLabel: {
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinTagLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.dark,
  },
  pinAuthor: {
    fontSize: 11,
    color: Brand.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  pinNote: {
    fontSize: 13,
    color: Brand.dark,
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 18,
  },

  topVibesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 22,
    gap: 8,
  },
  topVibeCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  topVibeText: {
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  topVibeCount: {
    fontSize: 10,
    color: Brand.textSecondary,
    fontWeight: '600',
  },

  settingsCard: {
    backgroundColor: Brand.card,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsLabel: {
    fontSize: 14,
    color: Brand.dark,
    fontWeight: '600',
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsTrailing: {
    fontSize: 12,
    color: Brand.textSecondary,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: Brand.textSecondary,
    marginTop: 8,
  },
});
