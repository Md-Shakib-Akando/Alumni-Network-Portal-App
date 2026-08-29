import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS } from '../../constants/theme';
import { AppNotification } from '../../api/types';

export const NotificationCenterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredNotifications = notifications.filter(n => {
    if (selectedCategory === 'all') return true;
    return n.category === selectedCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'messages':
        return { name: 'chatbubbles', color: COLORS.primaryLight };
      case 'mentorship':
        return { name: 'school', color: COLORS.accent };
      case 'events':
        return { name: 'calendar', color: COLORS.accentPurple };
      case 'jobs':
        return { name: 'briefcase', color: COLORS.accentAmber };
      default:
        return { name: 'notifications', color: COLORS.textSecondary };
    }
  };

  const handleNotificationPress = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.category === 'messages') {
      navigation.navigate('ConversationsListScreen');
    } else if (notif.category === 'mentorship') {
      navigation.navigate('MentorshipTab');
    } else if (notif.category === 'events') {
      navigation.navigate('EventsTab');
    } else if (notif.category === 'jobs') {
      navigation.navigate('JobsTab');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.navBar, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 24 : 16) + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Notifications</Text>
        <TouchableOpacity style={styles.clearBtn} onPress={clearAllNotifications}>
          <Text style={styles.clearBtnText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.categoriesRow}>
        {[
          { id: 'all', label: 'All' },
          { id: 'messages', label: 'Messages' },
          { id: 'mentorship', label: 'Mentorship' },
          { id: 'events', label: 'Events' },
          { id: 'jobs', label: 'Jobs' },
        ].map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, selectedCategory === cat.id && styles.chipActive]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={[styles.chipText, selectedCategory === cat.id && styles.chipTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const icon = getCategoryIcon(item.category);
          return (
            <TouchableOpacity
              style={[styles.notifItem, !item.read && styles.notifItemUnread]}
              onPress={() => handleNotificationPress(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, { backgroundColor: `${icon.color}15` }]}>
                <Ionicons name={icon.name as any} size={20} color={icon.color} />
              </View>
              <View style={styles.notifTextCol}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, !item.read && styles.titleUnread]}>
                    {item.title}
                  </Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                <Text style={styles.time}>{item.timestamp}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySub}>You're all caught up with community updates.</Text>
          </View>
        }
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
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  categoriesRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: 16,
  },
  notifItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
    ...SHADOWS.sm,
  },
  notifItemUnread: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notifTextCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  titleUnread: {
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
  },
  message: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  time: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
