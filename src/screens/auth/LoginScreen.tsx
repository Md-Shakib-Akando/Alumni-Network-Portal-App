import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS, UNIVERSITY } from '../../constants/theme';
import { UserRole } from '../../api/types';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { switchPersona, allUsers } = useApp();

  const [email, setEmail] = useState('alex.rivera@student.univ.edu');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otpCode, setOtpCode] = useState('842910');

  const handleSendOtp = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please provide a valid institutional email address.');
      return;
    }
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    // Select persona matching role
    if (selectedRole === 'alumni') {
      switchPersona('user-sarah');
    } else if (selectedRole === 'staff') {
      switchPersona('user-dean');
    } else {
      switchPersona('user-alex');
    }

    navigation.replace('MainTabs');
  };

  const handleSsoLogin = (provider: 'Google' | 'Microsoft') => {
    Alert.alert(
      `${provider} SSO Verification`,
      `Single Sign-On authentication for institutional identity provider verified successfully.`,
      [
        {
          text: 'Continue',
          onPress: () => {
            switchPersona('user-sarah');
            navigation.replace('MainTabs');
          },
        },
      ]
    );
  };

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 24 : 16);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: topInset + 12 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          <View style={styles.brandIconBox}>
            <Ionicons name="school" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.portalTitle}>{UNIVERSITY.name.toUpperCase()}</Text>
          <Text style={styles.portalSub}>{UNIVERSITY.networkTitle}</Text>
        </View>

        <View style={styles.formCard}>
        {step === 'email' ? (
          <>
            <Text style={styles.formTitle}>Sign In / Verify Identity</Text>
            <Text style={styles.formSub}>
              Access is reserved for verified graduates, current students, and faculty.
            </Text>

            {/* Role Picker */}
            <Text style={styles.inputLabel}>I am signing in as:</Text>
            <View style={styles.rolesRow}>
              {(['student', 'alumni', 'staff'] as const).map(role => (
                <TouchableOpacity
                  key={role}
                  style={[styles.roleBtn, selectedRole === role && styles.roleBtnActive]}
                  onPress={() => {
                    setSelectedRole(role);
                    if (role === 'alumni') setEmail('sarah.jenkins@alumni.univ.edu');
                    else if (role === 'staff') setEmail('marcus.cole@univ.edu');
                    else setEmail('alex.rivera@student.univ.edu');
                  }}
                >
                  <Text style={[styles.roleBtnText, selectedRole === role && styles.roleBtnTextActive]}>
                    {role.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Institutional Email (.edu / alumni domain)</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="name@alumni.univ.edu"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSendOtp} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Send Verification Code (OTP)</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR CONTINUE WITH SSO</Text>
              <View style={styles.line} />
            </View>

            {/* SSO Providers */}
            <View style={styles.ssoRow}>
              <TouchableOpacity
                style={styles.ssoBtn}
                onPress={() => handleSsoLogin('Google')}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-google" size={18} color="#EA4335" />
                <Text style={styles.ssoBtnText}>Google SSO</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ssoBtn}
                onPress={() => handleSsoLogin('Microsoft')}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-windows" size={18} color="#00A4EF" />
                <Text style={styles.ssoBtnText}>Microsoft 365</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.registerLinkBtn}
              onPress={() => navigation.navigate('RegisterScreen')}
              activeOpacity={0.8}
            >
              <Text style={styles.registerLinkText}>
                New student or alumni? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Register here</Text>
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.backLink} onPress={() => setStep('email')}>
              <Ionicons name="arrow-back" size={16} color={COLORS.primary} />
              <Text style={styles.backLinkText}>Change email address</Text>
            </TouchableOpacity>

            <Text style={styles.formTitle}>Enter Verification Code</Text>
            <Text style={styles.formSub}>
              A 6-digit one-time passkey was dispatched to <Text style={{ fontWeight: '700' }}>{email}</Text>.
            </Text>

            <View style={styles.otpInputBox}>
              <TextInput
                style={styles.otpInput}
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleVerifyOtp} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Verify & Enter Portal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.onboardingBtn}
              onPress={() => navigation.navigate('OnboardingScreen')}
            >
              <Text style={styles.onboardingBtnText}>New user? Run Onboarding Wizard</Text>
            </TouchableOpacity>
          </>
        )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    padding: 20,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandIconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...SHADOWS.md,
  },
  portalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  portalSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    ...SHADOWS.lg,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  formSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
    marginBottom: 16,
    lineHeight: 17,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 8,
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  roleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  roleBtnTextActive: {
    color: '#FFFFFF',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginHorizontal: 8,
  },
  ssoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ssoBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 6,
  },
  ssoBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  backLinkText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  otpInputBox: {
    alignItems: 'center',
    marginVertical: 16,
  },
  otpInput: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 10,
    textAlign: 'center',
    color: COLORS.primary,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    width: 200,
  },
  onboardingBtn: {
    marginTop: 14,
    alignItems: 'center',
  },
  onboardingBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryLight,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  registerLinkBtn: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 8,
  },
  registerLinkText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
