import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/theme';

interface FeedbackSurveyModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  onSubmit: (rating: number, comments: string) => void;
}

export const FeedbackSurveyModal: React.FC<FeedbackSurveyModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  onSubmit,
}) => {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    onSubmit(rating, comments);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComments('');
      onClose();
    }, 1200);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {submitted ? (
            <View style={styles.centerBox}>
              <Ionicons name="checkmark-circle" size={48} color={COLORS.accent} />
              <Text style={styles.successText}>Feedback Recorded!</Text>
              <Text style={styles.subText}>Thank you for helping strengthen our alumni community.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subText}>{subtitle}</Text>

              <Text style={styles.ratingLabel}>Rate your experience</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    style={styles.starTouch}
                  >
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={32}
                      color={star <= rating ? '#F59E0B' : '#CBD5E1'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.ratingLabel}>Share thoughts or suggestions</Text>
              <TextInput
                style={styles.textArea}
                value={comments}
                onChangeText={setComments}
                placeholder="What went well? Any areas to improve?"
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitBtnText}>Submit Feedback</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    ...SHADOWS.lg,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  starTouch: {
    padding: 4,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    height: 75,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  centerBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  successText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 4,
  },
});
