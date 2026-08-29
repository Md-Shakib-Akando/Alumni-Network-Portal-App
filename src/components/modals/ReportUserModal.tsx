import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/theme';
import { useApp } from '../../store/AppContext';

interface ReportUserModalProps {
  visible: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
}

const REPORT_REASONS = [
  'Inappropriate or Harassing Content',
  'Spam or Unsolicited Commercial Messaging',
  'Misleading University/Career Credentials',
  'Impersonation or False Identity',
  'Other Safety or FERPA Violation',
];

export const ReportUserModal: React.FC<ReportUserModalProps> = ({
  visible,
  onClose,
  targetUserId,
  targetUserName,
}) => {
  const { reportUser, blockUser } = useApp();
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    reportUser(targetUserId, selectedReason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 1400);
  };

  const handleBlock = () => {
    blockUser(targetUserId);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="alert-circle-outline" size={22} color={COLORS.accentRose} />
              <Text style={styles.title}>Safety & Moderation Report</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {submitted ? (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={44} color={COLORS.accent} />
              <Text style={styles.successTitle}>Report Logged</Text>
              <Text style={styles.successSub}>
                Logged in Alumni Relations staff moderation queue for review within 1 minute.
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.subtext}>
                Reporting <Text style={{ fontWeight: '700' }}>{targetUserName}</Text>. Help keep the alumni community trusted and respectful.
              </Text>

              <Text style={styles.sectionLabel}>Select Reason</Text>
              {REPORT_REASONS.map(reason => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonOption,
                    selectedReason === reason && styles.reasonOptionSelected,
                  ]}
                  onPress={() => setSelectedReason(reason)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={selectedReason === reason ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={selectedReason === reason ? COLORS.primary : COLORS.textMuted}
                  />
                  <Text style={styles.reasonText}>{reason}</Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.sectionLabel}>Additional Details (Optional)</Text>
              <TextInput
                style={styles.textArea}
                value={details}
                onChangeText={setDetails}
                placeholder="Describe what occurred..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
              />

              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.blockBtn}
                  onPress={handleBlock}
                  activeOpacity={0.8}
                >
                  <Text style={styles.blockBtnText}>Block User</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitBtnText}>Submit Report</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
    ...SHADOWS.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  subtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 6,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 6,
  },
  reasonOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#EEF2FF',
  },
  reasonText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginLeft: 8,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    height: 70,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  blockBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.accentRose,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  blockBtnText: {
    color: COLORS.accentRose,
    fontWeight: '700',
    fontSize: 14,
  },
  submitBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  successSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
});
