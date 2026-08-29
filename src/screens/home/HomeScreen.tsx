import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS, UNIVERSITY } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { MOCK_ANNOUNCEMENTS } from '../../api/mockData';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { currentUser, allUsers, events } = useApp();

  const featuredMentors = allUsers.filter(u => u.isMentor && u.id !== currentUser.id).slice(0, 4);
  const nextEvent = events[0];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'alumni':
        return <Badge label="ALUMNI" variant="primary" size="sm" />;
      case 'student':
        return <Badge label="STUDENT" variant="warning" size="sm" />;
      case 'staff':
        return <Badge label="STAFF" variant="purple" size="sm" />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={UNIVERSITY.shortName + ' Network'}
        subtitle={UNIVERSITY.motto}
        onNotificationPress={() => navigation.navigate('NotificationCenterScreen')}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* University Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.crestBadge}>
              <Ionicons name="school" size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.heroUniTitle}>{UNIVERSITY.name}</Text>
              <Text style={styles.heroUniMotto}>{UNIVERSITY.networkTitle}</Text>
            </View>
          </View>

          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeGreeting}>
              Welcome to <Text style={{ fontWeight: '800' }}>{UNIVERSITY.name}</Text>
            </Text>
            <Text style={styles.welcomeSub}>
              Fostering lifelong networking between alumni, faculty, and current students
            </Text>
          </View>
        </View>

        {/* Live Network Statistics Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12.5k+</Text>
            <Text style={styles.statLabel}>Alumni</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>320+</Text>
            <Text style={styles.statLabel}>Mentors</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{events.length}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Chapters</Text>
          </View>
        </View>

        {/* Quick Access Grid */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Explore Network Portals</Text>
          <View style={styles.gridContainer}>
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('DirectoryTab')}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="people" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.gridTitle}>Alumni Directory</Text>
              <Text style={styles.gridSub}>Search graduates & filter by major</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('MentorshipTab')}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="school" size={22} color={COLORS.accent} />
              </View>
              <Text style={styles.gridTitle}>1:1 Mentorship</Text>
              <Text style={styles.gridSub}>Connect with senior alumni</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('MessagesTab')}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconBox, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="chatbubbles" size={22} color={COLORS.accentPurple} />
              </View>
              <Text style={styles.gridTitle}>Messages & Clubs</Text>
              <Text style={styles.gridSub}>1:1 chats & department clubs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('EventsTab')}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="calendar" size={22} color={COLORS.accentAmber} />
              </View>
              <Text style={styles.gridTitle}>Reunions & Events</Text>
              <Text style={styles.gridSub}>RSVP to campus gatherings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('GroupsScreen')}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconBox, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="people-circle" size={22} color={COLORS.accentRose} />
              </View>
              <Text style={styles.gridTitle}>Alumni Chapters</Text>
              <Text style={styles.gridSub}>Department & regional groups</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('PrivacySettingsScreen')}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconBox, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="shield-checkmark" size={22} color="#475569" />
              </View>
              <Text style={styles.gridTitle}>Privacy Controls</Text>
              <Text style={styles.gridSub}>Field visibility & public preview</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* University News & Announcements */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Campus Announcements</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EventsTab')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.announcementScroll}>
            {MOCK_ANNOUNCEMENTS.map(ann => (
              <View key={ann.id} style={styles.announcementCard}>
                <Image source={{ uri: ann.imageUrl }} style={styles.announcementImg} />
                <View style={styles.announcementBody}>
                  <View style={styles.announcementBadgeRow}>
                    <Badge label={ann.category.toUpperCase()} variant="primary" size="sm" />
                    <Text style={styles.announcementDate}>{ann.date}</Text>
                  </View>
                  <Text style={styles.announcementTitle} numberOfLines={2}>{ann.title}</Text>
                  <Text style={styles.announcementSummary} numberOfLines={2}>{ann.summary}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Featured Alumni Mentors of the Week */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Featured Alumni Mentors</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MentorshipTab')}>
              <Text style={styles.seeAllText}>All Mentors</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mentorsScroll}>
            {featuredMentors.map(mentor => (
              <TouchableOpacity
                key={mentor.id}
                style={styles.featuredMentorCard}
                onPress={() => navigation.navigate('ProfileDetailScreen', { userId: mentor.id })}
                activeOpacity={0.85}
              >
                <Image source={{ uri: mentor.avatar }} style={styles.mentorAvatarLarge} />
                <Text style={styles.mentorName} numberOfLines={1}>{mentor.name}</Text>
                <Text style={styles.mentorCompany} numberOfLines={1}>
                  {mentor.currentRole || 'Alumni'} @ {mentor.currentCompany || 'Tech'}
                </Text>
                <Badge
                  label={mentor.industry}
                  variant="neutral"
                  size="sm"
                  style={{ marginTop: 6, marginBottom: 8 }}
                />
                <View style={styles.mentorConnectBtn}>
                  <Text style={styles.mentorConnectText}>View Bio & Connect</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Highlight Event */}
        {nextEvent && (
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>Next Campus Gathering</Text>
            <TouchableOpacity
              style={styles.eventHighlightCard}
              onPress={() => navigation.navigate('EventDetailScreen', { eventId: nextEvent.id })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: nextEvent.image }} style={styles.eventHighlightImg} />
              <View style={styles.eventHighlightBody}>
                <Badge label={nextEvent.category.toUpperCase()} variant="purple" size="sm" />
                <Text style={styles.eventHighlightTitle} numberOfLines={2}>{nextEvent.title}</Text>
                <View style={styles.eventHighlightMeta}>
                  <Ionicons name="calendar-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.eventHighlightMetaText}>{nextEvent.date} • {nextEvent.time}</Text>
                </View>
                <View style={styles.eventHighlightMeta}>
                  <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.eventHighlightMetaText} numberOfLines={1}>{nextEvent.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: COLORS.primaryDark,
    margin: 16,
    borderRadius: 18,
    padding: 18,
    ...SHADOWS.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  crestBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroUniTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroUniMotto: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  welcomeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
  },
  welcomeGreeting: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  welcomeSub: {
    fontSize: 12,
    color: '#93C5FD',
    marginTop: 2,
  },
  authBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  loginModalBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  loginModalBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  registerNavBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  registerNavBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    paddingVertical: 14,
    justifyContent: 'space-around',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  sectionWrap: {
    marginHorizontal: 16,
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    ...SHADOWS.sm,
  },
  gridIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  gridSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  announcementScroll: {
    marginTop: 2,
  },
  announcementCard: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
    ...SHADOWS.sm,
  },
  announcementImg: {
    width: '100%',
    height: 110,
  },
  announcementBody: {
    padding: 12,
  },
  announcementBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  announcementDate: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  announcementTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  announcementSummary: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 15,
  },
  mentorsScroll: {
    marginTop: 2,
  },
  featuredMentorCard: {
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    ...SHADOWS.sm,
  },
  mentorAvatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  mentorName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  mentorCompany: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  mentorConnectBtn: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  mentorConnectText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  eventHighlightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  eventHighlightImg: {
    width: '100%',
    height: 120,
  },
  eventHighlightBody: {
    padding: 14,
  },
  eventHighlightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 6,
    marginBottom: 6,
  },
  eventHighlightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventHighlightMetaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  personaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  personaItemSelected: {
    borderColor: COLORS.primaryLight,
    backgroundColor: '#EFF6FF',
  },
  modalAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  personaDetails: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personaName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  personaHeadline: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  personaEmail: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  customLoginBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
    gap: 6,
  },
  customLoginBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
