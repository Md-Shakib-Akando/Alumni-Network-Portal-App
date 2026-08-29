import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { FeedbackSurveyModal } from '../../components/modals/FeedbackSurveyModal';
import { AuthGate } from '../../components/common/AuthGate';
import { UserProfile } from '../../api/types';

export const MentorshipHubScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    currentUser,
    allUsers,
    mentorshipRequests,
    sendMentorshipRequest,
    respondToMentorshipRequest,
    endMentorship,
    updateCurrentUserProfile,
    isAuthenticated,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'browse' | 'active' | 'requests'>('browse');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<UserProfile | null>(null);
  const [requestGoal, setRequestGoal] = useState('Career Strategy & Interview Prep');
  const [requestPitch, setRequestPitch] = useState('');

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header
          title="Mentorship Hub"
          subtitle="1:1 Alumni Coaching & Guidance"
          onNotificationPress={() => navigation.navigate('NotificationCenterScreen')}
        />
        <AuthGate
          title="Login to Access Mentorship"
          description="Connect 1-on-1 with verified alumni mentors, schedule guidance sessions, or offer guidance as a mentor."
          icon="school-outline"
        />
      </View>
    );
  }
  
  // Feedback survey modal for ending mentorship
  const [surveyModalVisible, setSurveyModalVisible] = useState(false);
  const [targetEndingRequestId, setTargetEndingRequestId] = useState<string | null>(null);

  // Mentors list (excluding self)
  const availableMentors = allUsers.filter(u => u.isMentor && u.id !== currentUser.id && (selectedIndustry === 'All' || u.industry === selectedIndustry));

  // Active mentorship pairs for current user
  const activePairs = mentorshipRequests.filter(
    r => (r.mentorId === currentUser.id || r.menteeId === currentUser.id) && r.status === 'accepted'
  );

  // Pending incoming or outgoing requests
  const pendingRequests = mentorshipRequests.filter(
    r => (r.mentorId === currentUser.id || r.menteeId === currentUser.id) && r.status === 'pending'
  );

  const pendingOutgoingCount = mentorshipRequests.filter(
    r => r.menteeId === currentUser.id && r.status === 'pending'
  ).length;

  const handleOpenRequestModal = (mentor: UserProfile) => {
    setSelectedMentor(mentor);
    setRequestPitch(`Hi ${mentor.name}, I would love your mentorship on building technical depth and career navigation.`);
    setRequestModalVisible(true);
  };

  const handleConfirmSendRequest = () => {
    if (!selectedMentor) return;
    const res = sendMentorshipRequest(selectedMentor.id, requestGoal, requestPitch);
    if (!res.success) {
      Alert.alert('Request Limit Reached', res.error);
    } else {
      Alert.alert('Request Sent!', `Your mentorship inquiry was sent to ${selectedMentor.name}.`);
      setRequestModalVisible(false);
      setActiveTab('requests');
    }
  };

  const handleCalendarSchedule = (sessionDate?: string) => {
    const title = encodeURIComponent('Alumni 1:1 Mentorship Session');
    const details = encodeURIComponent('Scheduled 1:1 Mentorship Coaching via Alumni Network Portal.');
    // Simulated deep link to Google Calendar
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
    Linking.openURL(googleCalUrl).catch(() => {
      Alert.alert('Calendar Booking', 'Opened Google / Outlook Calendar deep link for scheduling session.');
    });
  };

  const handleTriggerEndMentorship = (requestId: string) => {
    setTargetEndingRequestId(requestId);
    setSurveyModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Mentorship Program"
        subtitle="Structured alumni-to-student coaching"
        onNotificationPress={() => navigation.navigate('NotificationCenterScreen')}
      />

      <View style={styles.content}>
        {/* Role & Capacity Settings Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Your Mentorship Status</Text>
              <Text style={styles.statusSub}>
                {currentUser.isMentor
                  ? `Mentor • Active Mentees: ${currentUser.activeMenteesCount}/${currentUser.mentorshipCapacity}`
                  : 'Mentee • Looking for career coaching'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.toggleRoleBtn}
              onPress={() => {
                const nextState = !currentUser.isMentor;
                updateCurrentUserProfile({
                  isMentor: nextState,
                  isMentee: !nextState,
                });
              }}
            >
              <Ionicons name="swap-vertical" size={14} color="#FFFFFF" />
              <Text style={styles.toggleRoleText}>
                {currentUser.isMentor ? 'Switch to Mentee' : 'Become a Mentor'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pending request quota indicator (PRD Section 6.4: Max 3) */}
          <View style={styles.quotaRow}>
            <Text style={styles.quotaLabel}>Pending Outgoing Requests:</Text>
            <Text style={[styles.quotaVal, pendingOutgoingCount >= 3 && { color: COLORS.accentRose }]}>
              {pendingOutgoingCount}/3 active
            </Text>
          </View>
        </View>

        {/* Tab Controls */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
            onPress={() => setActiveTab('browse')}
          >
            <Text style={[styles.tabText, activeTab === 'browse' && styles.activeTabText]}>
              Find Mentors ({availableMentors.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
              Active Pairs ({activePairs.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
            onPress={() => setActiveTab('requests')}
          >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
              Requests ({pendingRequests.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          {/* TAB 1: BROWSE MENTORS */}
          {activeTab === 'browse' && (
            <View>
              {/* Industry Filter Pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.industryScroll}>
                {['All', 'Technology & AI', 'FinTech & Payments', 'Venture Capital & Private Equity', 'Healthcare & Biotech'].map(ind => (
                  <TouchableOpacity
                    key={ind}
                    style={[styles.industryPill, selectedIndustry === ind && styles.industryPillActive]}
                    onPress={() => setSelectedIndustry(ind)}
                  >
                    <Text style={[styles.industryPillText, selectedIndustry === ind && styles.industryPillTextActive]}>
                      {ind}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {availableMentors.map(mentor => (
                <View key={mentor.id} style={styles.mentorCard}>
                  <View style={styles.mentorHeader}>
                    <Image source={{ uri: mentor.avatar }} style={styles.mentorAvatar} />
                    <View style={styles.mentorInfo}>
                      <Text style={styles.mentorName}>{mentor.name}</Text>
                      <Text style={styles.mentorHeadline} numberOfLines={1}>{mentor.headline}</Text>
                      <View style={styles.mentorMetaRow}>
                        <Badge label={mentor.industry} variant="neutral" size="sm" />
                        <Text style={styles.capacityText}>
                          Capacity: {mentor.activeMenteesCount}/{mentor.mentorshipCapacity}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.mentorBio} numberOfLines={2}>
                    {mentor.mentorshipBio || mentor.bio}
                  </Text>

                  {mentor.mentorshipGoals && (
                    <View style={styles.goalsRow}>
                      {mentor.mentorshipGoals.map((g, idx) => (
                        <Badge key={idx} label={g} variant="success" size="sm" style={{ marginRight: 4, marginBottom: 4 }} />
                      ))}
                    </View>
                  )}

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.profileBtn}
                      onPress={() => navigation.navigate('ProfileDetailScreen', { userId: mentor.id })}
                    >
                      <Text style={styles.profileBtnText}>View Bio</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.requestBtn,
                        pendingOutgoingCount >= 3 && styles.requestBtnDisabled,
                      ]}
                      onPress={() => handleOpenRequestModal(mentor)}
                      disabled={pendingOutgoingCount >= 3}
                    >
                      <Ionicons name="paper-plane-outline" size={15} color="#FFFFFF" />
                      <Text style={styles.requestBtnText}>Request 1:1</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* TAB 2: ACTIVE MENTORSHIP PAIRS */}
          {activeTab === 'active' && (
            <View>
              {activePairs.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <Ionicons name="people-outline" size={48} color={COLORS.textMuted} />
                  <Text style={styles.emptyTitle}>No Active Mentorship Pairs</Text>
                  <Text style={styles.emptySub}>
                    Browse the directory to connect with mentors or check pending requests.
                  </Text>
                </View>
              ) : (
                activePairs.map(req => {
                  const partner = req.mentorId === currentUser.id ? req.mentee : req.mentor;
                  const isMentorRole = req.mentorId === currentUser.id;

                  return (
                    <View key={req.id} style={styles.activePairCard}>
                      <View style={styles.pairHeader}>
                        <Image source={{ uri: partner.avatar }} style={styles.pairAvatar} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.partnerName}>{partner.name}</Text>
                          <Text style={styles.partnerRole}>
                            {isMentorRole ? 'Your Mentee' : 'Your Mentor'} • {partner.education.major}
                          </Text>
                          <Badge label="ACTIVE PARTNERSHIP" variant="success" size="sm" style={{ marginTop: 4 }} />
                        </View>
                      </View>

                      <View style={styles.goalBox}>
                        <Text style={styles.goalLabel}>Focus Goal:</Text>
                        <Text style={styles.goalContent}>{req.goal}</Text>
                      </View>

                      {/* Scheduling & Session Hub */}
                      <View style={styles.sessionBox}>
                        <View style={styles.sessionRow}>
                          <Ionicons name="calendar" size={18} color={COLORS.primary} />
                          <View style={{ marginLeft: 8, flex: 1 }}>
                            <Text style={styles.sessionTitle}>Next Session</Text>
                            <Text style={styles.sessionTime}>Thursday, 5:00 PM - 5:45 PM PST</Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={styles.calLinkBtn}
                          onPress={() => handleCalendarSchedule(req.scheduledSession)}
                        >
                          <Ionicons name="open-outline" size={14} color={COLORS.primary} />
                          <Text style={styles.calLinkText}>Open Calendar (Google / Outlook)</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Action buttons */}
                      <View style={styles.pairActionsRow}>
                        <TouchableOpacity
                          style={styles.pairChatBtn}
                          onPress={() =>
                            navigation.navigate('ChatScreen', {
                              participantId: partner.id,
                              participantName: partner.name,
                              participantAvatar: partner.avatar,
                            })
                          }
                        >
                          <Ionicons name="chatbubbles" size={16} color="#FFFFFF" />
                          <Text style={styles.pairChatBtnText}>Chat with {partner.name.split(' ')[0]}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.endPairBtn}
                          onPress={() => handleTriggerEndMentorship(req.id)}
                        >
                          <Text style={styles.endPairBtnText}>End & Review</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* TAB 3: REQUESTS WORKFLOW */}
          {activeTab === 'requests' && (
            <View>
              {pendingRequests.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <Ionicons name="mail-unread-outline" size={48} color={COLORS.textMuted} />
                  <Text style={styles.emptyTitle}>No Pending Requests</Text>
                  <Text style={styles.emptySub}>
                    Incoming requests from students and mentors will appear here.
                  </Text>
                </View>
              ) : (
                pendingRequests.map(req => {
                  const isIncoming = req.mentorId === currentUser.id;
                  const otherParty = isIncoming ? req.mentee : req.mentor;

                  return (
                    <View key={req.id} style={styles.requestCard}>
                      <View style={styles.reqHeader}>
                        <Image source={{ uri: otherParty.avatar }} style={styles.reqAvatar} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.reqName}>{otherParty.name}</Text>
                          <Text style={styles.reqSub}>{isIncoming ? 'Incoming Mentee Request' : 'Outgoing Request to Mentor'}</Text>
                        </View>
                        <Badge label="PENDING" variant="warning" size="sm" />
                      </View>

                      <View style={styles.reqDetailBox}>
                        <Text style={styles.reqGoalLabel}>Goal: <Text style={{ fontWeight: '700' }}>{req.goal}</Text></Text>
                        <Text style={styles.reqMsg}>"{req.message}"</Text>
                      </View>

                      {isIncoming ? (
                        <View style={styles.responseBtnRow}>
                          <TouchableOpacity
                            style={styles.declineBtn}
                            onPress={() => respondToMentorshipRequest(req.id, 'declined')}
                          >
                            <Text style={styles.declineBtnText}>Decline</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.acceptBtn}
                            onPress={() => respondToMentorshipRequest(req.id, 'accepted')}
                          >
                            <Text style={styles.acceptBtnText}>Accept Mentee</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.outgoingWaitingBox}>
                          <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                          <Text style={styles.waitingText}>Awaiting {otherParty.name}'s review</Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

      {/* Request Modal */}
      <Modal visible={requestModalVisible} transparent animationType="slide" onRequestClose={() => setRequestModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.requestModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Mentorship</Text>
              <TouchableOpacity onPress={() => setRequestModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {selectedMentor && (
              <>
                <View style={styles.mentorTargetRow}>
                  <Image source={{ uri: selectedMentor.avatar }} style={styles.targetAvatar} />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.targetName}>{selectedMentor.name}</Text>
                    <Text style={styles.targetSub}>{selectedMentor.headline}</Text>
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Select Guidance Topic</Text>
                <TextInput
                  style={styles.inputField}
                  value={requestGoal}
                  onChangeText={setRequestGoal}
                  placeholder="e.g. Big Tech PM, Systems Eng, Resume Critiques"
                />

                <Text style={styles.fieldLabel}>Personal Message & Introduction</Text>
                <TextInput
                  style={[styles.inputField, { height: 90, textAlignVertical: 'top' }]}
                  value={requestPitch}
                  onChangeText={setRequestPitch}
                  multiline
                  placeholder="Introduce yourself and what you'd like to achieve..."
                />

                <TouchableOpacity style={styles.confirmSendBtn} onPress={handleConfirmSendRequest}>
                  <Text style={styles.confirmSendText}>Send Mentorship Inquiry</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Feedback Survey Modal (End of Mentorship) */}
      <FeedbackSurveyModal
        visible={surveyModalVisible}
        onClose={() => setSurveyModalVisible(false)}
        title="Complete Mentorship Relationship"
        subtitle="Please leave optional feedback and rating to help improve future pairings."
        onSubmit={(rating, comments) => {
          if (targetEndingRequestId) {
            endMentorship(targetEndingRequestId, rating, comments);
          }
        }}
      />
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
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusInfo: {
    flex: 1,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statusSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  toggleRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  toggleRoleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  quotaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  quotaLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  quotaVal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
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
  scroll: {
    flex: 1,
  },
  industryScroll: {
    marginBottom: 10,
  },
  industryPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  industryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  industryPillText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  industryPillTextActive: {
    color: '#FFFFFF',
  },
  mentorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  mentorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mentorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  mentorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mentorName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  mentorHeadline: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  mentorMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  capacityText: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  mentorBio: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 8,
  },
  goalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
  },
  profileBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  profileBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  requestBtn: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  requestBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  requestBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  activePairCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderColor: COLORS.accent,
    ...SHADOWS.sm,
  },
  pairHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pairAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  partnerRole: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  goalBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  goalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  goalContent: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  sessionBox: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sessionTime: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  calLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  calLinkText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
    marginLeft: 4,
  },
  pairActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pairChatBtn: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
  },
  pairChatBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  endPairBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accentRose,
  },
  endPairBtnText: {
    color: COLORS.accentRose,
    fontSize: 12,
    fontWeight: '600',
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  reqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reqAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  reqName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reqSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  reqDetailBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
  },
  reqGoalLabel: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  reqMsg: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  responseBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  declineBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: COLORS.accent,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  outgoingWaitingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  waitingText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  requestModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  mentorTargetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  targetAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  targetName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  targetSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  confirmSendBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmSendText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
