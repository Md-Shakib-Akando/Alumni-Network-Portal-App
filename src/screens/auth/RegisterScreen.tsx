import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS, UNIVERSITY } from '../../constants/theme';
import { UserRole } from '../../api/types';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electrical & Electronic Engineering',
  'Business Administration (BBA)',
  'Economics & Social Sciences',
  'Pharmacy & Bioengineering',
  'Law & Justice',
  'English & Modern Languages',
  'Civil & Environmental Engineering',
];

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { updateCurrentUserProfile } = useApp();

  const [role, setRole] = useState<UserRole>('alumni');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [gradYear, setGradYear] = useState(role === 'alumni' ? '2019' : '2026');
  const [degree, setDegree] = useState('B.S.');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [isMentor, setIsMentor] = useState(true);

  const [deptModalVisible, setDeptModalVisible] = useState(false);

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 24 : 16);

  const handleRegister = () => {
    if (!name.trim() || !studentId.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please complete all required fields (Name, Student ID, Email, Password).');
      return;
    }

    // Set updated profile
    updateCurrentUserProfile({
      name: name.trim(),
      email: email.trim(),
      role,
      verified: true,
      headline:
        role === 'alumni'
          ? `${currentRole || 'Graduate'} @ ${company || 'Independent'} | ${department}`
          : `${department} Student | Class of ${gradYear}`,
      bio:
        role === 'alumni'
          ? `Alumni of ${UNIVERSITY.name} (${department}, Class of ${gradYear}). Excited to connect and offer guidance to students.`
          : `Student at ${UNIVERSITY.name} studying ${department}. Looking forward to connecting with alumni mentors.`,
      education: {
        institution: UNIVERSITY.name,
        degree,
        major: department,
        gradYear: parseInt(gradYear, 10) || 2024,
      },
      currentCompany: company.trim() || undefined,
      currentRole: currentRole.trim() || undefined,
      isMentor: role === 'alumni' && isMentor,
      isMentee: role === 'student',
      profileCompletionPercentage: 90,
    });

    Alert.alert(
      'Account Created Successfully!',
      `Welcome to ${UNIVERSITY.name} ${UNIVERSITY.networkTitle}, ${name}! Your university profile is now active.`,
      [
        {
          text: 'Enter Portal',
          onPress: () => navigation.navigate('MainTabs'),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Safe Area Header */}
      <View style={[styles.navBar, { paddingTop: topInset + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Create University Account</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* University Header Brand Card */}
        <View style={styles.brandCard}>
          <View style={styles.crestBox}>
            <Ionicons name="school" size={26} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.uniName}>{UNIVERSITY.name}</Text>
            <Text style={styles.uniSub}>{UNIVERSITY.networkTitle}</Text>
          </View>
        </View>

        {/* Role Toggle */}
        <Text style={styles.sectionHeader}>Select Your Member Role *</Text>
        <View style={styles.roleToggleRow}>
          <TouchableOpacity
            style={[styles.roleCard, role === 'alumni' && styles.roleCardActive]}
            onPress={() => {
              setRole('alumni');
              setGradYear('2019');
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="school"
              size={22}
              color={role === 'alumni' ? '#FFFFFF' : COLORS.primary}
            />
            <Text style={[styles.roleTitle, role === 'alumni' && styles.roleTitleActive]}>
              Alumni (Graduate)
            </Text>
            <Text style={[styles.roleSub, role === 'alumni' && styles.roleSubActive]}>
              Degree completed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, role === 'student' && styles.roleCardActive]}
            onPress={() => {
              setRole('student');
              setGradYear('2026');
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="book"
              size={22}
              color={role === 'student' ? '#FFFFFF' : COLORS.primary}
            />
            <Text style={[styles.roleTitle, role === 'student' && styles.roleTitleActive]}>
              General Student
            </Text>
            <Text style={[styles.roleSub, role === 'student' && styles.roleSubActive]}>
              Current student
            </Text>
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Tanvir Ahmed / Priya Sharma"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Student / Alumni ID Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2018-1-60-042 or 18101045"
            placeholderTextColor={COLORS.textMuted}
            value={studentId}
            onChangeText={setStudentId}
          />

          <Text style={styles.label}>Department / Faculty *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deptScroll}>
            {DEPARTMENTS.map(dept => (
              <TouchableOpacity
                key={dept}
                style={[styles.deptChip, department === dept && styles.deptChipActive]}
                onPress={() => setDepartment(dept)}
              >
                <Text style={[styles.deptChipText, department === dept && styles.deptChipTextActive]}>
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Degree</Text>
              <TextInput style={styles.input} value={degree} onChangeText={setDegree} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>
                {role === 'alumni' ? 'Graduation Year' : 'Expected Batch'}
              </Text>
              <TextInput
                style={styles.input}
                value={gradYear}
                onChangeText={setGradYear}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. name@univ.edu or personal email"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Create Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Minimum 6 characters"
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Alumni Specific Professional Fields */}
        {role === 'alumni' && (
          <View style={styles.formSection}>
            <Text style={styles.sectionHeader}>Professional Information</Text>

            <Text style={styles.label}>Current Company / Employer</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Google, Microsoft, Beximco, Robi"
              placeholderTextColor={COLORS.textMuted}
              value={company}
              onChangeText={setCompany}
            />

            <Text style={styles.label}>Current Job Title / Designation</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Senior Software Engineer / Analyst"
              placeholderTextColor={COLORS.textMuted}
              value={currentRole}
              onChangeText={setCurrentRole}
            />

            <TouchableOpacity
              style={styles.mentorCheckbox}
              onPress={() => setIsMentor(!isMentor)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isMentor ? 'checkbox' : 'square-outline'}
                size={22}
                color={isMentor ? COLORS.primary : COLORS.textMuted}
              />
              <Text style={styles.mentorCheckboxText}>
                I am open to offering 1:1 mentorship guidance to junior students & fresh graduates
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleRegister}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.submitBtnText}>Complete Registration</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginRedirect}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.loginRedirectText}>
            Already have an institutional account? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 12,
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
  scroll: {
    flex: 1,
    padding: 16,
  },
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDark,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    ...SHADOWS.sm,
  },
  crestBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uniName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  uniSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  roleToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  roleCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  roleTitleActive: {
    color: '#FFFFFF',
  },
  roleSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  roleSubActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  row: {
    flexDirection: 'row',
  },
  deptScroll: {
    marginVertical: 4,
  },
  deptChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  deptChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  deptChipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  deptChipTextActive: {
    color: '#FFFFFF',
  },
  mentorCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    padding: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    gap: 8,
  },
  mentorCheckboxText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 16,
    marginLeft: 6,
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 6,
    gap: 8,
    ...SHADOWS.md,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 6,
  },
  loginRedirect: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginRedirectText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
