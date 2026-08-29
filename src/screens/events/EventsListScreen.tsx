import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { EventItem } from '../../api/types';

export const EventsListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { events, rsvpEvent, cancelRsvpEvent, isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'my_events'>('upcoming');

  const filteredEvents = events.filter(e => {
    if (activeTab === 'my_events') {
      return e.isRsvpd || e.isWaitlisted;
    }
    return true;
  });

  const renderEventCard = ({ item }: { item: EventItem }) => {
    const isFull = item.rsvpCount >= item.capacity;
    const capacityPct = Math.round((item.rsvpCount / item.capacity) * 100);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('EventDetailScreen', { eventId: item.id })}
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.image }} style={styles.cardBanner} />

        <View style={styles.cardBody}>
          <View style={styles.categoryRow}>
            <Badge label={item.category.toUpperCase()} variant="purple" size="sm" />
            <Badge
              label={item.type.toUpperCase()}
              variant="neutral"
              icon={item.type === 'virtual' ? 'videocam-outline' : 'location-outline'}
              size="sm"
              style={{ marginLeft: 6 }}
            />
            {item.isRsvpd && (
              <Badge label="RSVP CONFIRMED" variant="success" size="sm" style={{ marginLeft: 'auto' }} />
            )}
            {item.isWaitlisted && (
              <Badge label="WAITLISTED" variant="warning" size="sm" style={{ marginLeft: 'auto' }} />
            )}
          </View>

          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.primary} />
            <Text style={styles.infoText}>{item.date} • {item.time}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>{item.location}</Text>
          </View>

          {/* Capacity Progress Indicator */}
          <View style={styles.progressWrap}>
            <ProgressBar
              percentage={capacityPct}
              label={`Attendance (${item.rsvpCount}/${item.capacity})`}
              subLabel={isFull ? 'Waitlist' : `${item.capacity - item.rsvpCount} spots left`}
              color={isFull ? COLORS.accentRose : COLORS.accent}
              height={6}
            />
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.viewDetailsBtn}
              onPress={() => navigation.navigate('EventDetailScreen', { eventId: item.id })}
            >
              <Text style={styles.viewDetailsText}>View Details & Agenda</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickRsvpBtn,
                item.isRsvpd && styles.quickRsvpBtnActive,
                item.isWaitlisted && styles.quickRsvpBtnWaitlist,
              ]}
              onPress={() => {
                if (!isAuthenticated) {
                  Alert.alert(
                    'Login Required',
                    'Please sign in with your university account to RSVP for campus events.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Login', onPress: () => navigation.navigate('ProfileTab') },
                    ]
                  );
                  return;
                }
                item.isRsvpd || item.isWaitlisted ? cancelRsvpEvent(item.id) : rsvpEvent(item.id);
              }}
            >
              <Text style={styles.quickRsvpBtnText}>
                {item.isRsvpd ? 'Cancel' : item.isWaitlisted ? 'Waitlisted' : isFull ? 'Waitlist' : 'RSVP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header onNotificationPress={() => navigation.navigate('NotificationCenterScreen')} />

      <View style={styles.content}>
        {/* Filter Tabs & Host Button */}
        <View style={styles.tabRowWithHost}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
              onPress={() => setActiveTab('upcoming')}
            >
              <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
                All ({events.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'my_events' && styles.activeTab]}
              onPress={() => setActiveTab('my_events')}
            >
              <Text style={[styles.tabText, activeTab === 'my_events' && styles.activeTabText]}>
                My RSVPs ({events.filter(e => e.isRsvpd || e.isWaitlisted).length})
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.hostBtnInline}
            onPress={() => {
              if (!isAuthenticated) {
                Alert.alert(
                  'Login Required',
                  'Please sign in with your university account to host or organize events.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Login', onPress: () => navigation.navigate('ProfileTab') },
                  ]
                );
                return;
              }
              navigation.navigate('CreateEventScreen');
            }}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.hostBtnInlineText}>Host</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredEvents}
          keyExtractor={item => item.id}
          renderItem={renderEventCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Events Listed</Text>
              <Text style={styles.emptySub}>
                {activeTab === 'my_events'
                  ? 'You have not RSVP’d to any upcoming events yet.'
                  : 'Check back soon for upcoming campus gatherings and webinars.'}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  createEventBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  createEventBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 2,
  },
  tabRowWithHost: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
  },
  hostBtnInline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 4,
    ...SHADOWS.sm,
  },
  hostBtnInlineText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    ...SHADOWS.sm,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    ...SHADOWS.sm,
  },
  cardBanner: {
    width: '100%',
    height: 140,
  },
  cardBody: {
    padding: 14,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  progressWrap: {
    marginTop: 10,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
  },
  viewDetailsBtn: {
    flex: 2,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  quickRsvpBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  quickRsvpBtnActive: {
    backgroundColor: COLORS.accent,
  },
  quickRsvpBtnWaitlist: {
    backgroundColor: COLORS.accentAmber,
  },
  quickRsvpBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 24,
  },
});
