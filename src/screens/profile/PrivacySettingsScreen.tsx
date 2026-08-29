import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS } from '../../constants/theme';
import { PublicPreviewModal } from '../directory/PublicPreviewModal';
import { FieldVisibility, VisibilityOption } from '../../api/types';

export const PrivacySettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { currentUser, updatePrivacySettings } = useApp();
  const [previewModalVisible, setPreviewModalVisible] = useState(false);

  const vis = currentUser.visibility;

  const renderOptionPill = (
    field: keyof FieldVisibility,
    opt: VisibilityOption,
    label: string,
    icon: any
  ) => {
    const isSelected = vis[field] === opt;
    return (
      <TouchableOpacity
        style={[styles.pill, isSelected && styles.pillSelected]}
        onPress={() => updatePrivacySettings(field, opt)}
      >
        <Ionicons
          name={icon}
          size={14}
          color={isSelected ? '#FFFFFF' : COLORS.textSecondary}
          style={{ marginRight: 4 }}
        />
        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFieldSection = (
    title: string,
    field: keyof FieldVisibility,
    description: string
  ) => (
    <View style={styles.fieldCard}>
      <Text style={styles.fieldTitle}>{title}</Text>
      <Text style={styles.fieldDesc}>{description}</Text>

      <View style={styles.pillsRow}>
        {renderOptionPill(field, 'public', 'Public', 'globe-outline')}
        {renderOptionPill(field, 'alumni-only', 'Alumni Only', 'school-outline')}
        {renderOptionPill(field, 'hidden', 'Hidden', 'lock-closed-outline')}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.navBar, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 24 : 16) + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Field-Level Privacy</Text>
        <TouchableOpacity
          style={styles.previewHeaderBtn}
          onPress={() => setPreviewModalVisible(true)}
        >
          <Ionicons name="eye-outline" size={16} color={COLORS.primary} />
          <Text style={styles.previewHeaderBtnText}>Preview</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.introBanner}>
          <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.introTitle}>Granular Visibility Controls</Text>
            <Text style={styles.introSub}>
              Customize who can view specific fields on your profile. Changes save instantly.
            </Text>
          </View>
        </View>

        {renderFieldSection(
          'Email Address',
          'email',
          'Choose whether your institutional email is shown publicly, to alumni only, or kept confidential.'
        )}

        {renderFieldSection(
          'Phone Number',
          'phone',
          'Protect direct personal phone contact from public web indexing.'
        )}

        {renderFieldSection(
          'Current Location & Proximity',
          'location',
          'Controls discovery in "Alumni Near Me" and search result distance calculation.'
        )}

        {renderFieldSection(
          'Career History & Employers',
          'careerHistory',
          'Determines if your past companies and titles are visible to non-verified visitors.'
        )}

        {renderFieldSection(
          'Resume / CV Document',
          'resume',
          'Allow students or alumni to review your resume for mentorship and referral requests.'
        )}

        {/* Live Preview CTA */}
        <TouchableOpacity
          style={styles.livePreviewBtn}
          onPress={() => setPreviewModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="eye" size={18} color="#FFFFFF" />
          <Text style={styles.livePreviewBtnText}>View Live Public Preview</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <PublicPreviewModal
        visible={previewModalVisible}
        onClose={() => setPreviewModalVisible(false)}
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
  previewHeaderBtn: {
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
  previewHeaderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 4,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  introBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  introSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  fieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  fieldTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  fieldDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 10,
    lineHeight: 16,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  livePreviewBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  livePreviewBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
});
