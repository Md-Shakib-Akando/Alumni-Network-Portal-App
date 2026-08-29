import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS } from '../../constants/theme';

export const PostJobScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { postJob, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
  const [type, setType] = useState<'Full-Time' | 'Internship' | 'Contract' | 'Remote'>('Full-Time');
  const [experienceLevel, setExperienceLevel] = useState<'Entry-Level' | 'Mid-Level' | 'Senior' | 'Lead'>('Mid-Level');
  const [salaryRange, setSalaryRange] = useState('$130,000 - $175,000');
  const [applyLink, setApplyLink] = useState('https://company.com/careers');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  const isStaff = currentUser.role === 'staff';

  const handlePost = () => {
    if (!title.trim() || !company.trim() || !description.trim()) {
      Alert.alert('Missing Fields', 'Please enter job title, company name, and role description.');
      return;
    }

    const reqsList = requirements
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    postJob({
      title: title.trim(),
      company: company.trim(),
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=120&q=80',
      location: location.trim(),
      type,
      experienceLevel,
      salaryRange: salaryRange.trim(),
      applyLink: applyLink.trim(),
      description: description.trim(),
      requirements: reqsList.length > 0 ? reqsList : ['Relevant degree in STEM or Business', 'Strong communication and problem solving'],
    });

    Alert.alert(
      isStaff ? 'Job Published!' : 'Submitted for Approval',
      isStaff
        ? 'Your job listing is live in the Alumni Career Portal.'
        : 'Your job posting has been submitted to Career Services staff moderation queue.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.navBar, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 24 : 16) + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Post Career Opportunity</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handlePost}>
          <Text style={styles.saveBtnText}>{isStaff ? 'Publish' : 'Submit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {!isStaff && (
          <View style={styles.moderationNotice}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#0369A1" />
            <Text style={styles.moderationText}>
              Alumni job postings require quick staff approval before going live to verify institutional legitimacy.
            </Text>
          </View>
        )}

        <Text style={styles.label}>Job Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Associate Product Marketing Manager"
          placeholderTextColor={COLORS.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Hiring Company *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Stripe, Google, Microsoft"
          placeholderTextColor={COLORS.textMuted}
          value={company}
          onChangeText={setCompany}
        />

        <Text style={styles.label}>Employment Type</Text>
        <View style={styles.chipsRow}>
          {(['Full-Time', 'Internship', 'Contract', 'Remote'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, type === t && styles.chipActive]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Experience Level</Text>
        <View style={styles.chipsRow}>
          {(['Entry-Level', 'Mid-Level', 'Senior', 'Lead'] as const).map(lvl => (
            <TouchableOpacity
              key={lvl}
              style={[styles.chip, experienceLevel === lvl && styles.chipActive]}
              onPress={() => setExperienceLevel(lvl)}
            >
              <Text style={[styles.chipText, experienceLevel === lvl && styles.chipTextActive]}>{lvl}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} />

        <Text style={styles.label}>Estimated Compensation Range</Text>
        <TextInput style={styles.input} value={salaryRange} onChangeText={setSalaryRange} />

        <Text style={styles.label}>Application Link or Email</Text>
        <TextInput style={styles.input} value={applyLink} onChangeText={setApplyLink} />

        <Text style={styles.label}>Role Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Detail the mission, scope of work, and team structure..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Key Requirements (1 per line)</Text>
        <TextInput
          style={[styles.input, styles.textArea, { height: 80 }]}
          placeholder="3+ years React Native&#10;Computer Science degree&#10;Experience with APIs"
          placeholderTextColor={COLORS.textMuted}
          multiline
          value={requirements}
          onChangeText={setRequirements}
        />

        <TouchableOpacity style={styles.submitBottomBtn} onPress={handlePost}>
          <Text style={styles.submitBottomBtnText}>
            {isStaff ? 'Publish Job Listing' : 'Submit for Staff Moderation'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  saveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  moderationNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 8,
    gap: 8,
  },
  moderationText: {
    flex: 1,
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 16,
    marginLeft: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  submitBottomBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitBottomBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
