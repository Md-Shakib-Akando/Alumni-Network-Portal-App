import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS } from '../../constants/theme';
import { Badge } from './Badge';

interface PersonaSwitcherProps {
  onNotificationPress?: () => void;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ onNotificationPress }) => {
  const navigation = useNavigation<any>();
  const { currentUser, allUsers, switchPersona, isAuthenticated, unreadNotificationsCount } = useApp();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  // Available demonstration personas
  const personas = allUsers.filter(u => ['user-sarah', 'user-alex', 'user-dean'].includes(u.id));

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'alumni':
        return <Badge label="ALUMNI" variant="primary" size="sm" />;
      case 'student':
        return <Badge label="STUDENT" variant="warning" size="sm" />;
      case 'staff':
        return <Badge label="STAFF / ADMIN" variant="purple" size="sm" />;
      default:
        return null;
    }
  };

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 26 : 20);

  return (
    <>
      <View style={[styles.triggerContainer, { paddingTop: topInset + 6 }]}>
        <TouchableOpacity
          style={styles.triggerLeft}
          onPress={() => {
            if (!isAuthenticated) {
              navigation.navigate('ProfileTab');
            } else {
              setModalVisible(true);
            }
          }}
          activeOpacity={0.85}
        >
          {isAuthenticated ? (
            <Image source={{ uri: currentUser.avatar }} style={styles.miniAvatar} />
          ) : (
            <View style={[styles.miniAvatar, { backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="person" size={16} color="#94A3B8" />
            </View>
          )}
          <View style={styles.triggerInfo}>
            <View style={styles.row}>
              <Text style={styles.triggerName} numberOfLines={1}>
                {isAuthenticated ? currentUser.name : 'Guest Visitor'}
              </Text>
              {isAuthenticated ? (
                <View style={{ marginLeft: 6 }}>{getRoleBadge(currentUser.role)}</View>
              ) : (
                <View style={{ marginLeft: 6 }}>
                  <Badge label="NOT SIGNED IN" variant="neutral" size="sm" />
                </View>
              )}
            </View>
            <Text style={styles.triggerSub} numberOfLines={1}>
              {isAuthenticated ? 'Tap to switch persona' : 'Tap to Login'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Top Notification Icon replacing the arrow icon */}
        <TouchableOpacity
          style={styles.topNotifBtn}
          onPress={() => {
            if (onNotificationPress) {
              onNotificationPress();
            } else {
              navigation.navigate('NotificationCenterScreen');
            }
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          {unreadNotificationsCount > 0 && (
            <View style={styles.topBadgeWrap}>
              <Text style={styles.topBadgeCount}>
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

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
                <Text style={styles.modalTitle}>Switch Demonstration Persona</Text>
                <Text style={styles.modalSub}>
                  Experience the portal from different PRD user roles
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={26} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={personas}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const isSelected = item.id === currentUser.id;
                return (
                  <TouchableOpacity
                    style={[styles.personaItem, isSelected && styles.personaItemSelected]}
                    onPress={() => {
                      switchPersona(item.id);
                      setModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: item.avatar }} style={styles.avatarLarge} />
                    <View style={styles.personaDetails}>
                      <View style={styles.row}>
                        <Text style={styles.personaName}>{item.name}</Text>
                        <View style={{ marginLeft: 8 }}>{getRoleBadge(item.role)}</View>
                      </View>
                      <Text style={styles.personaRole} numberOfLines={2}>
                        {item.headline}
                      </Text>
                      <Text style={styles.personaSpec}>
                        {item.role === 'alumni' && `Class of ${item.education.gradYear} • ${item.isMentor ? 'Available Mentor' : 'Alumni'}`}
                        {item.role === 'student' && `Class of ${item.education.gradYear} • Seeking Mentorship`}
                        {item.role === 'staff' && 'Full Portal Admin & Moderation Access'}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.accent} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  triggerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  triggerInfo: {
    marginLeft: 10,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  triggerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  triggerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  topNotifBtn: {
    padding: 8,
    position: 'relative',
  },
  topBadgeWrap: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  topBadgeCount: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
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
    maxWidth: 480,
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
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  personaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  personaItemSelected: {
    borderColor: COLORS.primaryLight,
    backgroundColor: '#EFF6FF',
  },
  avatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  personaDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  personaName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  personaRole: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  personaSpec: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '600',
    marginTop: 3,
  },
});
