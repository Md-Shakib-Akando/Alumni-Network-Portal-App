import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../../constants/theme';
import { useApp } from '../../store/AppContext';
import { Badge } from '../../components/common/Badge';
import { PublicPreviewModal } from './PublicPreviewModal';
import { ReportUserModal } from '../../components/modals/ReportUserModal';
import { UserProfile } from '../../api/types';

export const ProfileDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { allUsers, currentUser, sendMentorshipRequest, isAuthenticated } = useApp();

  const userId = route.params?.userId || currentUser.id;
  const user = allUsers.find(u => u.id === userId) || currentUser;

  const [previewVisible, setPreviewVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [mentorshipModalVisible, setMentorshipModalVisible] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const isSelf = user.id === currentUser.id;

  const handleQuickMentorshipRequest = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please sign in with your university account to request 1:1 mentorship.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('ProfileTab') },
        ]
      );
      return;
    }

    const res = sendMentorshipRequest(
      user.id,
      user.mentorshipGoals?.[0] || 'Career Strategy & Advice',
      `Hi ${user.name}, I would love your guidance on breaking into ${user.industry}.`
    );
    if (!res.success) {
      Alert.alert('Request Limit Reached', res.error);
    } else {
      setRequestSent(true);
      Alert.alert('Request Sent!', `Your mentorship inquiry was sent to ${user.name}.`);
    }
  };

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please sign in with your university account to send messages.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('ProfileTab') },
        ]
      );
      return;
    }

    navigation.navigate('ChatScreen', {
      participantId: user.id,
      participantName: user.name,
      participantAvatar: user.avatar,
    });
  };

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 24 : 16);

  return (
    <View style={styles.container}>
      <View style={[styles.navBar, { paddingTop: topInset + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>{user.name}</Text>
        <TouchableOpacity style={styles.moreBtn} onPress={() => setReportVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Banner Cover */}
        <View style={styles.banner}>
          <View style={styles.bannerPattern} />
        </View>

        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              {user.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
              )}
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.previewBtn}
                onPress={() => setPreviewVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="eye-outline" size={16} color={COLORS.primary} />
                <Text style={styles.previewBtnText}>Public Preview</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.headline}>{user.headline}</Text>

          <View style={styles.tagRow}>
            <Badge
              label={user.role.toUpperCase()}
              variant={user.role === 'alumni' ? 'primary' : user.role === 'student' ? 'warning' : 'purple'}
              size="sm"
            />
            {user.isMentor && (
              <Badge
                label={`MENTOR (${user.activeMenteesCount}/${user.mentorshipCapacity})`}
                variant="success"
                icon="school"
                size="sm"
                style={{ marginLeft: 6 }}
              />
            )}
            <Badge
              label={user.location}
              variant="neutral"
              icon="location-outline"
              size="sm"
              style={{ marginLeft: 6 }}
            />
          </View>

          {/* Quick CTA Actions */}
          {!isSelf && (
            <View style={styles.ctaRow}>
              <TouchableOpacity
                style={styles.primaryCta}
                onPress={handleSendMessage}
                activeOpacity={0.85}
              >
                <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />
                <Text style={styles.primaryCtaText}>Message</Text>
              </TouchableOpacity>

              {user.isMentor && (
                <TouchableOpacity
                  style={[styles.secondaryCta, requestSent && styles.secondaryCtaDisabled]}
                  onPress={handleQuickMentorshipRequest}
                  disabled={requestSent}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={requestSent ? 'checkmark-circle' : 'person-add'}
                    size={18}
                    color={requestSent ? COLORS.accent : COLORS.primary}
                  />
                  <Text style={[styles.secondaryCtaText, requestSent && { color: COLORS.accent }]}>
                    {requestSent ? 'Requested' : 'Ask Mentorship'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Bio Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>

        {/* Mentorship Focus Box */}
        {user.isMentor && (
          <View style={[styles.card, styles.mentorCard]}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="ribbon" size={20} color={COLORS.accent} />
              <Text style={[styles.cardTitle, { marginLeft: 8, color: '#065F46' }]}>
                Mentorship Offerings
              </Text>
            </View>
            <Text style={styles.mentorBio}>{user.mentorshipBio}</Text>
            
            {user.mentorshipGoals && (
              <View style={styles.goalsWrap}>
                <Text style={styles.goalsLabel}>Open for guidance in:</Text>
                <View style={styles.skillsRow}>
                  {user.mentorshipGoals.map((g, idx) => (
                    <Badge key={idx} label={g} variant="success" size="sm" style={{ margin: 3 }} />
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Career Experience */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Experience & Current Role</Text>
          <View style={styles.expItem}>
            <View style={styles.expIconBox}>
              <Ionicons name="briefcase" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.expDetails}>
              <Text style={styles.expTitle}>{user.currentRole || 'Professional'}</Text>
              <Text style={styles.expCompany}>{user.currentCompany || 'Independent'}</Text>
              <Text style={styles.expTime}>{user.industry} • Current</Text>
            </View>
          </View>
        </View>

        {/* Education */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Education</Text>
          <View style={styles.expItem}>
            <View style={[styles.expIconBox, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="school" size={20} color="#4F46E5" />
            </View>
            <View style={styles.expDetails}>
              <Text style={styles.expTitle}>
                {user.education.degree} in {user.education.major}
              </Text>
              <Text style={styles.expCompany}>{user.education.institution}</Text>
              <Text style={styles.expTime}>Class of {user.education.gradYear}</Text>
            </View>
          </View>
        </View>

        {/* Skills & Expertise */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Skills & Expertise</Text>
          <View style={styles.skillsRow}>
            {user.skills.map((skill, index) => (
              <Badge key={index} label={skill} variant="neutral" size="md" style={{ margin: 4 }} />
            ))}
          </View>
        </View>

        {/* Privacy Controlled Contact Info */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} />
            <Text style={[styles.cardTitle, { marginLeft: 6 }]}>Verified Contact Info</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.contactText}>
              {user.visibility.email !== 'hidden' ? user.email : 'Protected by user privacy settings'}
            </Text>
          </View>
          {user.linkedinUrl && (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL(user.linkedinUrl!)}
            >
              <Ionicons name="logo-linkedin" size={18} color="#0A66C2" />
              <Text style={[styles.contactText, { color: '#0A66C2', textDecorationLine: 'underline' }]}>
                LinkedIn Profile
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modals */}
      <PublicPreviewModal
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        user={user}
      />
      <ReportUserModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        targetUserId={user.id}
        targetUserName={user.name}
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
    marginHorizontal: 12,
  },
  moreBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  banner: {
    height: 100,
    backgroundColor: COLORS.primaryDark,
    position: 'relative',
  },
  bannerPattern: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E3A8A',
    opacity: 0.8,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.md,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#0284C7',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 4,
  },
  previewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headline: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 6,
  },
  ctaRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  primaryCta: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  secondaryCta: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  secondaryCtaDisabled: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  secondaryCtaText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 16,
    ...SHADOWS.sm,
  },
  mentorCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
  },
  mentorBio: {
    fontSize: 13,
    color: '#065F46',
    lineHeight: 19,
  },
  goalsWrap: {
    marginTop: 10,
  },
  goalsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
    marginBottom: 4,
  },
  expItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  expIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expDetails: {
    flex: 1,
  },
  expTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  expCompany: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  expTime: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  contactText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
});
