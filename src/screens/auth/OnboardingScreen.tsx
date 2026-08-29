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
import { ProgressBar } from '../../components/common/ProgressBar';

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { updateCurrentUserProfile } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Basics
  const [headline, setHeadline] = useState('Senior Software Engineer | Systems & Cloud');
  const [bio, setBio] = useState('Passionate about open-source architecture and student mentorship.');

  // Step 2: Grad Year & Program
  const [degree, setDegree] = useState('B.S.');
  const [major, setMajor] = useState('Computer Science');
  const [gradYear, setGradYear] = useState('2019');

  // Step 3: Privacy
  const [emailVis, setEmailVis] = useState<'public' | 'alumni-only' | 'hidden'>('alumni-only');
  const [careerVis, setCareerVis] = useState<'public' | 'alumni-only' | 'hidden'>('public');

  // Step 4: Interests & Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Artificial Intelligence',
    'Distributed Systems',
    'Mentorship',
  ]);

  const allTags = [
    'Artificial Intelligence',
    'Distributed Systems',
    'FinTech',
    'Biotech & Health',
    'Startup Founders',
    'Venture Capital',
    'Product Management',
    'Mentorship',
    'Alumni Reunions',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const completionPct = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;

  const handleFinish = () => {
    updateCurrentUserProfile({
      headline,
      bio,
      education: {
        institution: 'State University of Technology',
        degree,
        major,
        gradYear: parseInt(gradYear, 10) || 2019,
      },
      visibility: {
        email: emailVis,
        phone: 'hidden',
        location: 'public',
        careerHistory: careerVis,
        resume: 'alumni-only',
      },
      interests: selectedTags,
      profileCompletionPercentage: 100,
    });

    Alert.alert('Onboarding Complete!', 'Your alumni profile is verified and active.', [
      { text: 'Enter Network', onPress: () => navigation.replace('MainTabs') }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 24 : 16) + 8 }]}>
        <Text style={styles.headerStep}>Step {step} of 4</Text>
        <Text style={styles.headerTitle}>
          {step === 1 && 'Profile Basics'}
          {step === 2 && 'Academic Credentials'}
          {step === 3 && 'Privacy Preferences'}
          {step === 4 && 'Interests & Industry'}
        </Text>
        <ProgressBar percentage={completionPct} height={6} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.label}>Professional Headline</Text>
            <TextInput
              style={styles.input}
              value={headline}
              onChangeText={setHeadline}
              placeholder="e.g. Lead Engineer @ Startup | Tech Mentor"
            />

            <Text style={styles.label}>Bio & Self Introduction</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              placeholder="Share what you do, your campus memories, and how you want to connect..."
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.label}>Degree</Text>
            <TextInput style={styles.input} value={degree} onChangeText={setDegree} />

            <Text style={styles.label}>Major / Academic Program</Text>
            <TextInput style={styles.input} value={major} onChangeText={setMajor} />

            <Text style={styles.label}>Graduation Year</Text>
            <TextInput
              style={styles.input}
              value={gradYear}
              onChangeText={setGradYear}
              keyboardType="numeric"
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.card}>
            <Text style={styles.label}>Email Visibility Default</Text>
            <View style={styles.radioRow}>
              {(['public', 'alumni-only', 'hidden'] as const).map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.radioBtn, emailVis === opt && styles.radioBtnActive]}
                  onPress={() => setEmailVis(opt)}
                >
                  <Text style={[styles.radioText, emailVis === opt && styles.radioTextActive]}>
                    {opt.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Career History Visibility</Text>
            <View style={styles.radioRow}>
              {(['public', 'alumni-only', 'hidden'] as const).map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.radioBtn, careerVis === opt && styles.radioBtnActive]}
                  onPress={() => setCareerVis(opt)}
                >
                  <Text style={[styles.radioText, careerVis === opt && styles.radioTextActive]}>
                    {opt.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.card}>
            <Text style={styles.label}>Select Industry Topics & Interests</Text>
            <Text style={styles.sublabel}>Helps customize discovery feeds and mentorship pairings</Text>
            <View style={styles.tagsWrap}>
              {allTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagChip, isSelected && styles.tagChipActive]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[styles.tagText, isSelected && styles.tagTextActive]}>{tag}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.btnRow}>
          {step > 1 && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setStep((step - 1) as any)}
            >
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => {
              if (step < 4) setStep((step + 1) as any);
              else handleFinish();
            }}
          >
            <Text style={styles.nextBtnText}>{step === 4 ? 'Complete Onboarding' : 'Next Step'}</Text>
          </TouchableOpacity>
        </View>

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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerStep: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: 4,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 6,
  },
  sublabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  radioRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  radioBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  radioBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  radioText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  radioTextActive: {
    color: '#FFFFFF',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  tagTextActive: {
    color: '#FFFFFF',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  nextBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
