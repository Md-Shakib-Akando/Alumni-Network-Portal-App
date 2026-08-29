import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { AuthGate } from '../../components/common/AuthGate';
import { Conversation } from '../../api/types';

export const ConversationsListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { conversations, groups, markConversationAsRead, isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState<'direct' | 'groups'>('direct');

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header
          title="Connect"
          subtitle="Messages & Campus Clubs"
          onNotificationPress={() => navigation.navigate('NotificationCenterScreen')}
        />
        <AuthGate
          title="Login to Connect & Message"
          description="Sign in to chat with classmates, send messages to alumni mentors, and participate in department interest clubs."
          icon="chatbubbles-outline"
        />
      </View>
    );
  }

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.convItem}
      onPress={() => {
        markConversationAsRead(item.id);
        navigation.navigate('ChatScreen', {
          participantId: item.participant.id,
          participantName: item.participant.name,
          participantAvatar: item.participant.avatar,
        });
      }}
      activeOpacity={0.75}
    >
      <View style={styles.avatarWrap}>
        <Image source={{ uri: item.participant.avatar }} style={styles.avatar} />
        {item.participant.verified && (
          <View style={styles.verifiedDot}>
            <Ionicons name="checkmark" size={9} color="#FFFFFF" />
          </View>
        )}
      </View>

      <View style={styles.convDetails}>
        <View style={styles.convHeaderRow}>
          <Text style={styles.participantName}>{item.participant.name}</Text>
          <Text style={styles.timestamp}>{item.lastMessage.timestamp}</Text>
        </View>

        <Text style={styles.headlineText} numberOfLines={1}>{item.participant.headline}</Text>

        <View style={styles.lastMsgRow}>
          <Text
            style={[styles.lastMsgText, item.unreadCount > 0 && styles.lastMsgUnread]}
            numberOfLines={1}
          >
            {item.lastMessage.text}
          </Text>

          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Messages & Networking"
        subtitle="1:1 direct conversations and interest groups"
        onNotificationPress={() => navigation.navigate('NotificationCenterScreen')}
      />

      <View style={styles.content}>
        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'direct' && styles.activeTab]}
            onPress={() => setActiveTab('direct')}
          >
            <Ionicons
              name="chatbubbles-outline"
              size={15}
              color={activeTab === 'direct' ? COLORS.primary : COLORS.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.tabText, activeTab === 'direct' && styles.activeTabText]}>
              Direct Messages
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
            onPress={() => setActiveTab('groups')}
          >
            <Ionicons
              name="people-outline"
              size={15}
              color={activeTab === 'groups' ? COLORS.primary : COLORS.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>
              Interest Groups ({groups.length})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'direct' ? (
          <FlatList
            data={conversations}
            keyExtractor={item => item.id}
            renderItem={renderConversation}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="chatbubble-ellipses-outline" size={48} color={COLORS.textMuted} />
                <Text style={styles.emptyTitle}>No Conversations Yet</Text>
                <Text style={styles.emptySub}>
                  Find classmates or mentors in the Directory to start a conversation.
                </Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={groups}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.groupCard}
                onPress={() => navigation.navigate('GroupsScreen', { groupId: item.id })}
                activeOpacity={0.8}
              >
                <View style={[styles.groupIconBox, { backgroundColor: item.bannerColor }]}>
                  <Ionicons name={item.iconName as any} size={22} color="#FFFFFF" />
                </View>
                <View style={styles.groupInfo}>
                  <View style={styles.groupHeaderRow}>
                    <Text style={styles.groupName}>{item.name}</Text>
                    {item.isMember && <Badge label="Joined" variant="success" size="sm" />}
                  </View>
                  <Text style={styles.groupDesc} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.groupMetaRow}>
                    <Text style={styles.groupMetaText}>{item.membersCount} members • {item.posts.length} posts</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    ...SHADOWS.sm,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 24,
  },
  convItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  verifiedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0284C7',
    borderRadius: 8,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  convDetails: {
    flex: 1,
    marginLeft: 12,
  },
  convHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  headlineText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  lastMsgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMsgText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  lastMsgUnread: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  groupIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfo: {
    flex: 1,
    marginLeft: 12,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  groupDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  groupMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  groupMetaText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
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
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 30,
  },
});
