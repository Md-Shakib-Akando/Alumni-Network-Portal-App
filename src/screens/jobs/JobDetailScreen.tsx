import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS } from '../../constants/theme';
import { Badge } from '../../components/common/Badge';

export const JobDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { jobs, allUsers, requestReferral, currentUser } = useApp();

  const jobId = route.params?.jobId;
  const job = jobs.find(j => j.id === jobId) || jobs[0];

  // Find alumni working at this company
  const alumniAtCompany = allUsers.filter(
    u => u.currentCompany?.toLowerCase() === job.company.toLowerCase()
  );

  const [referralModalVisible, setReferralModalVisible] = useState(false);
  const [selectedAlumniId, setSelectedAlumniId] = useState<string>(
    alumniAtCompany[0]?.id || ''
  );
  const [referralNote, setReferralNote] = useState(
    `Hi! I applied for the ${job.title} role and would be honored if you could review my background and submit an internal alumni referral.`
  );
  const [referralSubmitted, setReferralSubmitted] = useState(false);

  const handleSendReferral = () => {
    if (!selectedAlumniId) {
      Alert.alert('Select Alumni', 'Please select an alumni working at this company.');
      return;
    }

    requestReferral(job.id, selectedAlumniId, referralNote);
    setReferralSubmitted(true);
    setTimeout(() => {
      setReferralSubmitted(false);
      setReferralModalVisible(false);
      Alert.alert(
        'Referral Request Sent!',
        `Your request and attached CV were delivered to your alumni contact.`
      );
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.navBar, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 24 : 16) + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>{job.company}</Text>
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={() => Alert.alert('Share Job', `Copied link: ${job.applyLink}`)}
        >
          <Ionicons name="share-outline" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Main Job Card */}
        <View style={styles.headerCard}>
          <View style={styles.companyRow}>
            <View style={styles.companyIconBox}>
              <Ionicons name="business" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.companyTextCol}>
              <Text style={styles.title}>{job.title}</Text>
              <Text style={styles.companyName}>{job.company} • {job.location}</Text>
            </View>
          </View>

          <View style={styles.tagsRow}>
            <Badge label={job.type} variant="primary" size="sm" />
            <Badge label={job.experienceLevel} variant="neutral" size="sm" style={{ marginLeft: 6 }} />
            <Badge label={job.salaryRange} variant="success" size="sm" style={{ marginLeft: 6 }} />
          </View>
        </View>

        {/* Alumni Connection & Referral Callout (PRD Section 6.6) */}
        <View style={styles.referralBanner}>
          <View style={styles.bannerLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="people" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.referralBannerTitle}>
                {job.alumniEmployeesCount} Alumni work at {job.company}
              </Text>
              <Text style={styles.referralBannerSub}>
                Boost your application interview chances by requesting a warm alumni referral.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.requestReferralBtn}
            onPress={() => setReferralModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="paper-plane" size={15} color="#FFFFFF" />
            <Text style={styles.requestReferralBtnText}>Request Referral</Text>
          </TouchableOpacity>
        </View>

        {/* Role Overview */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Role Overview</Text>
          <Text style={styles.bodyText}>{job.description}</Text>
        </View>

        {/* Requirements */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Key Requirements</Text>
          {job.requirements.map((req, idx) => (
            <View key={idx} style={styles.reqItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.accent} style={{ marginTop: 2 }} />
              <Text style={styles.reqText}>{req}</Text>
            </View>
          ))}
        </View>

        {/* Posted By */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Posted in Alumni Network By</Text>
          <TouchableOpacity
            style={styles.posterRow}
            onPress={() => navigation.navigate('ProfileDetailScreen', { userId: job.postedBy.id })}
          >
            <Image source={{ uri: job.postedBy.avatar }} style={styles.posterAvatar} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.posterName}>{job.postedBy.name}</Text>
              <Text style={styles.posterHeadline}>{job.postedBy.headline}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Bottom Apply Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.salaryCol}>
          <Text style={styles.bottomSalaryLabel}>Compensation</Text>
          <Text style={styles.bottomSalaryVal}>{job.salaryRange}</Text>
        </View>

        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => Linking.openURL(job.applyLink).catch(() => Alert.alert('Apply', `Application URL: ${job.applyLink}`))}
        >
          <Text style={styles.applyBtnText}>Apply Directly</Text>
          <Ionicons name="open-outline" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      {/* Request Referral Modal */}
      <Modal visible={referralModalVisible} transparent animationType="slide" onRequestClose={() => setReferralModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.referralModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Alumni Referral</Text>
              <TouchableOpacity onPress={() => setReferralModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Select an alumni working at {job.company} to review your profile and submit an internal referral on your behalf.
            </Text>

            <Text style={styles.fieldLabel}>Select Alumni at {job.company}</Text>
            {alumniAtCompany.length > 0 ? (
              alumniAtCompany.map(alumni => (
                <TouchableOpacity
                  key={alumni.id}
                  style={[
                    styles.alumniOption,
                    selectedAlumniId === alumni.id && styles.alumniOptionActive,
                  ]}
                  onPress={() => setSelectedAlumniId(alumni.id)}
                >
                  <Image source={{ uri: alumni.avatar }} style={styles.alumniAvatar} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.alumniName}>{alumni.name}</Text>
                    <Text style={styles.alumniHeadline}>{alumni.currentRole}</Text>
                  </View>
                  <Ionicons
                    name={selectedAlumniId === alumni.id ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={selectedAlumniId === alumni.id ? COLORS.primary : COLORS.textMuted}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noAlumniBox}>
                <Text style={styles.noAlumniText}>
                  No active alumni profile directly linked to {job.company}. You can still dispatch an inquiry to Career Services.
                </Text>
              </View>
            )}

            <Text style={styles.fieldLabel}>Introduction Pitch</Text>
            <TextInput
              style={styles.referralTextArea}
              value={referralNote}
              onChangeText={setReferralNote}
              multiline
              numberOfLines={4}
            />

            <View style={styles.resumeNotice}>
              <Ionicons name="document-attach-outline" size={16} color={COLORS.accent} />
              <Text style={styles.resumeNoticeText}>
                Your attached profile resume (PDF) will be automatically included.
              </Text>
            </View>

            <TouchableOpacity style={styles.sendReferralBtn} onPress={handleSendReferral}>
              <Text style={styles.sendReferralBtnText}>Submit Referral Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  shareBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  companyName: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  referralBanner: {
    backgroundColor: '#1E3A8A',
    margin: 16,
    borderRadius: 14,
    padding: 16,
    ...SHADOWS.md,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  referralBannerSub: {
    fontSize: 12,
    color: '#93C5FD',
    marginTop: 2,
    lineHeight: 16,
  },
  requestReferralBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  requestReferralBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  reqText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
    marginLeft: 6,
    lineHeight: 19,
  },
  posterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  posterAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  posterName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  posterHeadline: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.md,
  },
  salaryCol: {
    flex: 1,
  },
  bottomSalaryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  bottomSalaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  referralModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 6,
  },
  alumniOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  alumniOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#EFF6FF',
  },
  alumniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  alumniName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  alumniHeadline: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  noAlumniBox: {
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 8,
  },
  noAlumniText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  referralTextArea: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    height: 80,
    textAlignVertical: 'top',
  },
  resumeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  resumeNoticeText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 4,
  },
  sendReferralBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  sendReferralBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
