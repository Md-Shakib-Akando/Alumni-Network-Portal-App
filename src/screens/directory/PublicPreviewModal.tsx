import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../../api/types';
import { COLORS, SHADOWS } from '../../constants/theme';
import { Badge } from '../../components/common/Badge';

interface PublicPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const PublicPreviewModal: React.FC<PublicPreviewModalProps> = ({
  visible,
  onClose,
  user,
}) => {
  const vis = user.visibility;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <Ionicons name="eye-outline" size={20} color={COLORS.primaryLight} />
              <Text style={styles.headerTitle}>Public Profile Preview</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.noticeBox}>
            <Ionicons name="information-circle-outline" size={16} color="#1E40AF" />
            <Text style={styles.noticeText}>
              This is how non-verified or external visitors see your profile based on your field visibility settings.
            </Text>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.profileTop}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.headline}>{user.headline}</Text>

              <View style={styles.badgesRow}>
                <Badge label={user.role.toUpperCase()} variant="primary" size="sm" />
                {user.isMentor && <Badge label="MENTOR" variant="success" size="sm" style={{ marginLeft: 6 }} />}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact & Location</Text>
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Email:</Text>
                <Text style={styles.fieldValue}>
                  {vis.email === 'public' ? user.email : '🔒 [Hidden in Public View]'}
                </Text>
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Location:</Text>
                <Text style={styles.fieldValue}>
                  {vis.location === 'public' ? user.location : '🔒 [Hidden in Public View]'}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Career & Resume</Text>
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Career History:</Text>
                <Text style={styles.fieldValue}>
                  {vis.careerHistory === 'public'
                    ? `${user.currentRole} at ${user.currentCompany}`
                    : '🔒 [Alumni Only]'}
                </Text>
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Resume / CV:</Text>
                <Text style={styles.fieldValue}>
                  {vis.resume === 'public' ? '📄 Attached CV available' : '🔒 [Protected - Requires Connection]'}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              <Text style={styles.eduText}>
                {user.education.institution} • {user.education.degree} in {user.education.major} (Class of {user.education.gradYear})
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Close Preview</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    maxHeight: '85%',
    padding: 20,
    ...SHADOWS.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 14,
    gap: 8,
  },
  noticeText: {
    fontSize: 12,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 16,
  },
  body: {
    marginVertical: 4,
  },
  profileTop: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headline: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  section: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  eduText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  doneBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
