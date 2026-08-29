import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS } from '../../constants/theme';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { FeedbackSurveyModal } from '../../components/modals/FeedbackSurveyModal';

export const EventDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { events, rsvpEvent, cancelRsvpEvent, submitEventFeedback, isAuthenticated } = useApp();

  const eventId = route.params?.eventId;
  const event = events.find(e => e.id === eventId) || events[0];

  const [surveyVisible, setSurveyVisible] = useState(false);

  const isFull = event.rsvpCount >= event.capacity;
  const capacityPct = Math.round((event.rsvpCount / event.capacity) * 100);

  const handleToggleRsvp = () => {
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

    if (event.isRsvpd || event.isWaitlisted) {
      cancelRsvpEvent(event.id);
      Alert.alert('RSVP Cancelled', 'Your registration has been removed.');
    } else {
      rsvpEvent(event.id);
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description}\nLocation: ${event.location}`);
    const location = encodeURIComponent(event.location);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    Linking.openURL(googleCalUrl).catch(() => {
      Alert.alert('Calendar Sync', `Added "${event.title}" to device calendar.`);
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.navBar, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 24 : 16) + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>Event Details</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={() => Alert.alert('Share Event', `Invitation link copied: https://univ.edu/events/${event.id}`)}>
          <Ionicons name="share-social-outline" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Image source={{ uri: event.image }} style={styles.bannerImage} />

        <View style={styles.mainCard}>
          <View style={styles.badgeRow}>
            <Badge label={event.category.toUpperCase()} variant="purple" size="sm" />
            <Badge
              label={event.type.toUpperCase()}
              variant="info"
              icon={event.type === 'virtual' ? 'videocam-outline' : 'location-outline'}
              size="sm"
              style={{ marginLeft: 6 }}
            />
          </View>

          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.organizer}>Hosted by {event.organizer}</Text>

          {/* Date & Location Info */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.infoTitle}>{event.date}</Text>
                <Text style={styles.infoSub}>{event.time}</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { marginTop: 12 }]}>
              <View style={styles.iconCircle}>
                <Ionicons name="location-outline" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.infoTitle}>{event.location}</Text>
                {event.virtualLink && (
                  <Text style={[styles.infoSub, { color: COLORS.primaryLight }]}>
                    Virtual broadcast link available to attendees
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Capacity & Attendance Tracker */}
          <View style={styles.capacitySection}>
            <ProgressBar
              percentage={capacityPct}
              label={`Capacity (${event.rsvpCount} / ${event.capacity} Confirmed)`}
              subLabel={isFull ? 'Capacity Reached (Waitlist Active)' : `${event.capacity - event.rsvpCount} slots remaining`}
              color={isFull ? COLORS.accentRose : COLORS.accent}
              height={8}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.rsvpBtn,
                event.isRsvpd && styles.rsvpBtnActive,
                event.isWaitlisted && styles.rsvpBtnWaitlist,
              ]}
              onPress={handleToggleRsvp}
              activeOpacity={0.85}
            >
              <Ionicons
                name={
                  event.isRsvpd
                    ? 'checkmark-circle'
                    : event.isWaitlisted
                    ? 'hourglass-outline'
                    : isFull
                    ? 'alert-circle-outline'
                    : 'ticket-outline'
                }
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.rsvpBtnText}>
                {event.isRsvpd
                  ? 'Attending (Cancel RSVP)'
                  : event.isWaitlisted
                  ? 'Waitlisted (Remove)'
                  : isFull
                  ? 'Join Automated Waitlist'
                  : 'Confirm RSVP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.calBtn}
              onPress={handleAddToCalendar}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>About this Event</Text>
          <Text style={styles.descriptionText}>{event.description}</Text>
        </View>

        {/* Photo Gallery (PRD Section 6.5) */}
        {event.gallery && event.gallery.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Past Event Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
              {event.gallery.map((img, idx) => (
                <Image key={idx} source={{ uri: img }} style={styles.galleryThumb} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Feedback Survey Card */}
        <View style={[styles.card, styles.feedbackBanner]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.feedbackTitle}>Event Feedback & Retrospective</Text>
            <Text style={styles.feedbackSub}>
              {event.feedbackGiven ? 'Thank you! Your feedback has been submitted.' : 'Attended a past session? Share your thoughts with organizers.'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.feedbackBtn, event.feedbackGiven && styles.feedbackBtnDone]}
            onPress={() => setSurveyVisible(true)}
            disabled={event.feedbackGiven}
          >
            <Text style={[styles.feedbackBtnText, event.feedbackGiven && { color: COLORS.accent }]}>
              {event.feedbackGiven ? 'Submitted' : 'Give Feedback'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Feedback Survey Modal */}
      <FeedbackSurveyModal
        visible={surveyVisible}
        onClose={() => setSurveyVisible(false)}
        title="Event Feedback"
        subtitle={`Share your experience with ${event.title}`}
        onSubmit={(rating, comments) => submitEventFeedback(event.id, rating, comments)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  backBtn: {
    padding: 4,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  shareBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  bannerImage: {
    width: '100%',
    height: 200,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -24,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.md,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 25,
  },
  organizer: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoTexts: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  infoSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  capacitySection: {
    marginTop: 14,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  rsvpBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  rsvpBtnActive: {
    backgroundColor: COLORS.accent,
  },
  rsvpBtnWaitlist: {
    backgroundColor: COLORS.accentAmber,
  },
  rsvpBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  calBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 16,
    ...SHADOWS.sm,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
  },
  galleryScroll: {
    marginTop: 8,
  },
  galleryThumb: {
    width: 140,
    height: 95,
    borderRadius: 10,
    marginRight: 10,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  feedbackSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  feedbackBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  feedbackBtnDone: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  feedbackBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
