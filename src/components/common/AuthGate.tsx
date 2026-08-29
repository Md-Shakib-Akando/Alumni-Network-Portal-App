import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS, UNIVERSITY } from '../../constants/theme';
import { Badge } from './Badge';

interface AuthGateProps {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  title,
  description,
  icon = 'lock-closed-outline',
}) => {
  const navigation = useNavigation<any>();
  const { allUsers, login } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={36} color={COLORS.primary} />
        </View>

        <Text style={styles.uniBadge}>{UNIVERSITY.name.toUpperCase()}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate('RegisterScreen')}
            activeOpacity={0.85}
          >
            <Ionicons name="person-add-outline" size={17} color={COLORS.primary} />
            <Text style={styles.registerBtnText}>Register</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerNote}>
          <Ionicons name="shield-checkmark" size={14} color="#059669" />
          <Text style={styles.footerNoteText}>Institutional login for students, alumni, and faculty</Text>
        </View>
      </View>

      {/* Login Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Login to University Account</Text>
                <Text style={styles.modalSub}>Select your account persona to sign in</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
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
                    setModalVisible(false);
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
                setModalVisible(false);
                navigation.navigate('LoginScreen');
              }}
            >
              <Text style={styles.customLoginBtnText}>Enter Email / Password / SSO</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uniBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  btnRow: {
    width: '100%',
    gap: 10,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 12,
    ...SHADOWS.sm,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 6,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  registerBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 6,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 6,
  },
  footerNoteText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
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
