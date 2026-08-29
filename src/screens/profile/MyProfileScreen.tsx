import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS, UNIVERSITY } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { PublicPreviewModal } from '../directory/PublicPreviewModal';

export const MyProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    currentUser,
    allUsers,
    isAuthenticated,
    login,
    logout,
    switchPersona,
    updateCurrentUserProfile,
  } = useApp();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const demoPersonas = allUsers.filter(u => ['user-sarah', 'user-alex', 'user-dean'].includes(u.id));

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

  const handleSimulateResumeUpload = () => {
    Alert.alert(
      'Upload Resume / CV (PDF)',
      'Select simulated PDF document to attach to your alumni profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upload resume_2026.pdf',
          onPress: () => {
            updateCurrentUserProfile({
              resumeUrl: 'https://alumni.univ.edu/resumes/my_resume_cv.pdf',
              profileCompletionPercentage: 100,
            });
            Alert.alert('Resume Uploaded', 'Your CV is now securely attached to your profile.');
          },
        },
      ]
    );
  };

  const handleSignout = () => {
    logout();
    Alert.alert('Signed Out', 'You have successfully signed out of your university profile.');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Me"
        subtitle={isAuthenticated ? currentUser.name : 'University Profile'}
        onNotificationPress={() => navigation.navigate('NotificationCenterScreen')}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {!isAuthenticated ? (
          /* Unauthenticated Guest State on "Me" Page */
          <View style={styles.guestCard}>
            <View style={styles.crestWrap}>
              <Ionicons name="school" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.guestUniTitle}>{UNIVERSITY.name}</Text>
            <Text style={styles.guestPortalTitle}>{UNIVERSITY.networkTitle}</Text>
            <Text style={styles.guestDescription}>
              Sign in with your verified institutional identity to connect with fellow graduates, explore 1:1 mentorship opportunities, participate in campus discussions, and manage your public privacy.
            </Text>

            {/* Login & Register Buttons */}
            <View style={styles.guestBtnGroup}>
              <TouchableOpacity
                style={styles.mainLoginBtn}
                onPress={() => setLoginModalVisible(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
                <Text style={styles.mainLoginBtnText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mainRegisterBtn}
                onPress={() => navigation.navigate('RegisterScreen')}
                activeOpacity={0.85}
              >
                <Ionicons name="person-add-outline" size={19} color={COLORS.primary} />
                <Text style={styles.mainRegisterBtnText}>Register</Text>
              </TouchableOpacity>
            </View>

            {/* Verification Notice */}
            <View style={styles.verificationNote}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#059669" />
              <Text style={styles.verificationNoteText}>
                Open to all verified students, alumni graduates, and university faculty.
              </Text>
            </View>
          </View>
        ) : (
          /* Authenticated State on "Me" Page */
          <>
            {/* Profile Card Header */}
            <View style={styles.headerCard}>
              <View style={styles.avatarRow}>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                </View>

                <View style={styles.headerBtns}>
                  <TouchableOpacity
                    style={styles.actionPill}
                    onPress={() => setPreviewVisible(true)}
                  >
                    <Ionicons name="eye-outline" size={15} color={COLORS.primary} />
                    <Text style={styles.actionPillText}>Public View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionPill, { marginLeft: 8, backgroundColor: '#EFF6FF' }]}
                    onPress={() => navigation.navigate('PrivacySettingsScreen')}
                  >
                    <Ionicons name="lock-closed-outline" size={15} color={COLORS.primary} />
                    <Text style={styles.actionPillText}>Privacy</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.headline}>{currentUser.headline}</Text>

              <View style={styles.badgeRow}>
                <Badge label={currentUser.role.toUpperCase()} variant="primary" size="sm" />
                <Badge
                  label={`${currentUser.education.major} '${currentUser.education.gradYear.toString().slice(-2)}`}
                  variant="neutral"
                  size="sm"
                  style={{ marginLeft: 6 }}
                />
                {currentUser.isMentor && (
                  <Badge label="MENTOR ACTIVE" variant="success" size="sm" style={{ marginLeft: 6 }} />
                )}
              </View>
            </View>

            {/* PRD Section 6.1: Profile Completion % Meter */}
            <View style={styles.completionCard}>
              <View style={styles.completionHeader}>
                <Text style={styles.completionTitle}>Profile Strength</Text>
                <Text style={styles.completionPct}>{currentUser.profileCompletionPercentage}% Complete</Text>
              </View>

              <ProgressBar
                percentage={currentUser.profileCompletionPercentage}
                color={currentUser.profileCompletionPercentage === 100 ? COLORS.accent : COLORS.primaryLight}
                height={8}
              />

              <View style={styles.checklist}>
                <View style={styles.checkItem}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.accent} />
                  <Text style={styles.checkText}>Basic contact & verified institutional email</Text>
                </View>
                <View style={styles.checkItem}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.accent} />
                  <Text style={styles.checkText}>Graduation year & program verified</Text>
                </View>
                <View style={styles.checkItem}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.accent} />
                  <Text style={styles.checkText}>Career history & current title added</Text>
                </View>
                <View style={styles.checkItem}>
                  <Ionicons
                    name={currentUser.resumeUrl ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={currentUser.resumeUrl ? COLORS.accent : COLORS.textMuted}
                  />
                  <Text style={[styles.checkText, !currentUser.resumeUrl && { color: COLORS.textMuted }]}>
                    Resume / CV document uploaded ({currentUser.resumeUrl ? 'Attached' : 'Pending'})
                  </Text>
                </View>
              </View>
            </View>

            {/* Resume / CV Section */}
            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="document-text-outline" size={18} color={COLORS.primary} />
                <Text style={[styles.cardTitle, { marginLeft: 8 }]}>Resume / CV Document</Text>
              </View>

              {currentUser.resumeUrl ? (
                <View style={styles.resumeBox}>
                  <View style={styles.resumeIconBox}>
                    <Ionicons name="document-text" size={24} color={COLORS.accent} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.resumeName}>alumni_cv_verified.pdf</Text>
                    <Text style={styles.resumeSub}>Attached to profile • Visibility: {currentUser.visibility.resume}</Text>
                  </View>
                  <TouchableOpacity onPress={handleSimulateResumeUpload}>
                    <Text style={styles.replaceText}>Replace</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadBox} onPress={handleSimulateResumeUpload}>
                  <Ionicons name="cloud-upload-outline" size={28} color={COLORS.primary} />
                  <Text style={styles.uploadTitle}>Attach Resume (PDF)</Text>
                  <Text style={styles.uploadSub}>Share with alumni mentors or connections</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* About / Bio */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Bio</Text>
              <Text style={styles.bodyText}>{currentUser.bio}</Text>
            </View>

            {/* Education & Major */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Academic Background</Text>
              <View style={styles.eduItem}>
                <Ionicons name="school" size={20} color={COLORS.primary} style={{ marginTop: 2 }} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.eduDegree}>{currentUser.education.degree} in {currentUser.education.major}</Text>
                  <Text style={styles.eduInst}>{currentUser.education.institution}</Text>
                  <Text style={styles.eduYear}>Graduation Class of {currentUser.education.gradYear}</Text>
                </View>
              </View>
            </View>

            {/* Skills */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Skills & Competencies</Text>
              <View style={styles.skillsRow}>
                {currentUser.skills.map((skill, idx) => (
                  <Badge key={idx} label={skill} variant="neutral" size="md" style={{ margin: 4 }} />
                ))}
              </View>
            </View>

            {/* Signout Button */}
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.signoutBtn}
                onPress={handleSignout}
                activeOpacity={0.85}
              >
                <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
                <Text style={styles.signoutBtnText}>Signout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Login / Persona Selection Modal */}
      <Modal
        visible={loginModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLoginModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLoginModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Login to University Account</Text>
                <Text style={styles.modalSub}>
                  Select your institutional persona to continue
                </Text>
              </View>
              <TouchableOpacity onPress={() => setLoginModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={26} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={demoPersonas}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.personaItem}
                  onPress={() => {
                    login(item.id);
                    setLoginModalVisible(false);
                  }}
                  activeOpacity={0.75}
                >
                  <Image source={{ uri: item.avatar }} style={styles.modalAvatar} />
                  <View style={styles.personaDetails}>
                    <View style={styles.row}>
                      <Text style={styles.personaName}>{item.name}</Text>
                      <View style={{ marginLeft: 6 }}>{getRoleBadge(item.role)}</View>
                    </View>
                    <Text style={styles.personaHeadline} numberOfLines={1}>{item.headline}</Text>
                    <Text style={styles.personaEmail}>{item.email}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.primaryLight} />
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.customLoginBtn}
              onPress={() => {
                setLoginModalVisible(false);
                navigation.navigate('LoginScreen');
              }}
            >
              <Text style={styles.customLoginBtnText}>Enter Email / Password / SSO</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <PublicPreviewModal
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        user={currentUser}
      />
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
    padding: 16,
  },
  guestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    ...SHADOWS.md,
  },
  crestWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    ...SHADOWS.sm,
  },
  guestUniTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  guestPortalTitle: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 12,
    textAlign: 'center',
  },
  guestDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  guestBtnGroup: {
    width: '100%',
    gap: 12,
  },
  mainLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    ...SHADOWS.md,
  },
  mainLoginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
  mainRegisterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 12,
  },
  mainRegisterBtnText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8,
  },
  verificationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    gap: 8,
  },
  verificationNoteText: {
    flex: 1,
    fontSize: 11,
    color: '#065F46',
    lineHeight: 15,
    marginLeft: 4,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0284C7',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerBtns: {
    flexDirection: 'row',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headline: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  completionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  completionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  completionPct: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  checklist: {
    marginTop: 12,
    gap: 6,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  resumeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resumeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  resumeSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  replaceText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  uploadBox: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 6,
  },
  uploadSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  eduItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eduDegree: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  eduInst: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  eduYear: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '600',
    marginTop: 2,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  signoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    paddingVertical: 13,
    borderRadius: 12,
    ...SHADOWS.sm,
  },
  signoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
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
