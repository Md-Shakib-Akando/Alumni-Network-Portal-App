import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS } from '../../constants/theme';
import { Badge } from '../../components/common/Badge';
import { GroupPost } from '../../api/types';

export const GroupsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { groups, currentUser, toggleJoinGroup, createGroupPost, likeGroupPost, addPostComment, isAuthenticated } = useApp();

  const initialGroupId = route.params?.groupId || groups[0].id;
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});

  const activeGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    const tags = newPostTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    createGroupPost(selectedGroupId, newPostContent, tags);
    setNewPostContent('');
    setNewPostTags('');
    setPostModalVisible(false);
  };

  const handleAddComment = (postId: string) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please sign in with your university account to participate in discussions.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('ProfileTab') },
        ]
      );
      return;
    }

    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addPostComment(selectedGroupId, postId, text.trim());
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const renderPost = ({ item }: { item: GroupPost }) => {
    const isExpanded = !!expandedComments[item.id];
    return (
      <View style={styles.postCard}>
        <View style={styles.postAuthorRow}>
          <Image source={{ uri: item.author.avatar }} style={styles.postAvatar} />
          <View style={styles.authorMeta}>
            <Text style={styles.authorName}>{item.author.name}</Text>
            <Text style={styles.authorHeadline} numberOfLines={1}>{item.author.headline}</Text>
            <Text style={styles.postTime}>{item.timestamp}</Text>
          </View>
        </View>

        <Text style={styles.postContent}>{item.content}</Text>

        {item.tags.length > 0 && (
          <View style={styles.tagWrap}>
            {item.tags.map((t, idx) => (
              <Badge key={idx} label={`#${t}`} variant="info" size="sm" style={{ marginRight: 6, marginBottom: 4 }} />
            ))}
          </View>
        )}

        <View style={styles.postStats}>
          <TouchableOpacity
            style={styles.statBtn}
            onPress={() => likeGroupPost(selectedGroupId, item.id)}
          >
            <Ionicons
              name={item.isLikedByMe ? 'heart' : 'heart-outline'}
              size={18}
              color={item.isLikedByMe ? COLORS.accentRose : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.statText,
                item.isLikedByMe && { color: COLORS.accentRose, fontWeight: '700' },
              ]}
            >
              {item.likesCount} Likes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBtn}
            onPress={() => setExpandedComments(prev => ({ ...prev, [item.id]: !isExpanded }))}
          >
            <Ionicons name="chatbubble-outline" size={17} color={COLORS.textSecondary} />
            <Text style={styles.statText}>{item.comments.length} Comments</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        {isExpanded && (
          <View style={styles.commentsSection}>
            {item.comments.map(c => (
              <View key={c.id} style={styles.commentItem}>
                <Image source={{ uri: c.author.avatar }} style={styles.commentAvatar} />
                <View style={styles.commentBubble}>
                  <Text style={styles.commentAuthor}>{c.author.name}</Text>
                  <Text style={styles.commentText}>{c.content}</Text>
                  <Text style={styles.commentTime}>{c.timestamp}</Text>
                </View>
              </View>
            ))}

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                placeholderTextColor={COLORS.textMuted}
                value={commentInputs[item.id] || ''}
                onChangeText={text => setCommentInputs(prev => ({ ...prev, [item.id]: text }))}
              />
              <TouchableOpacity
                style={styles.commentSubmitBtn}
                onPress={() => handleAddComment(item.id)}
              >
                <Ionicons name="send" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.navBar, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 24 : 16) + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>Interest Groups & Chapters</Text>
      </View>

      {/* Horizontal Group Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupTabs}>
        {groups.map(grp => {
          const isSelected = grp.id === selectedGroupId;
          return (
            <TouchableOpacity
              key={grp.id}
              style={[styles.groupTab, isSelected && styles.groupTabActive]}
              onPress={() => setSelectedGroupId(grp.id)}
            >
              <Ionicons
                name={grp.iconName as any}
                size={16}
                color={isSelected ? '#FFFFFF' : COLORS.textSecondary}
              />
              <Text style={[styles.groupTabText, isSelected && styles.groupTabTextActive]}>
                {grp.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Active Group Banner & Membership Control */}
      <View style={styles.groupHeaderCard}>
        <View style={styles.groupHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.groupTitle}>{activeGroup.name}</Text>
            <Text style={styles.groupDescription}>{activeGroup.description}</Text>
            <View style={styles.groupMeta}>
              <Ionicons name="people-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.groupMemberCount}>{activeGroup.membersCount} members</Text>
              <Badge label={activeGroup.category} variant="neutral" size="sm" style={{ marginLeft: 8 }} />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.joinBtn, activeGroup.isMember && styles.leaveBtn]}
            onPress={() => {
              if (!isAuthenticated) {
                Alert.alert(
                  'Login Required',
                  'Please sign in with your university account to join campus groups.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Login', onPress: () => navigation.navigate('ProfileTab') },
                  ]
                );
                return;
              }
              toggleJoinGroup(activeGroup.id);
            }}
          >
            <Text style={[styles.joinBtnText, activeGroup.isMember && styles.leaveBtnText]}>
              {activeGroup.isMember ? 'Joined' : '+ Join Group'}
            </Text>
          </TouchableOpacity>
        </View>

        {activeGroup.isMember && (
          <TouchableOpacity
            style={styles.createPostBar}
            onPress={() => setPostModalVisible(true)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: currentUser.avatar }} style={styles.myMiniAvatar} />
            <Text style={styles.createPostPlaceholder}>Share an update or question with the group...</Text>
            <Ionicons name="create-outline" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Group Feed List */}
      <FlatList
        data={activeGroup.posts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.feedList}
        ListEmptyComponent={
          <View style={styles.emptyFeed}>
            <Ionicons name="chatbubbles-outline" size={44} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No posts in this group yet</Text>
            <Text style={styles.emptySub}>
              {activeGroup.isMember ? 'Be the first to share an insight, job lead, or question!' : 'Join this group to participate in discussions.'}
            </Text>
          </View>
        }
      />

      {/* Create Post Modal */}
      <Modal visible={postModalVisible} transparent animationType="slide" onRequestClose={() => setPostModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.postModalCard}>
            <View style={styles.postModalHeader}>
              <Text style={styles.modalTitle}>Post to {activeGroup.name}</Text>
              <TouchableOpacity onPress={() => setPostModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.postInput}
              placeholder="What would you like to discuss or share with alumni and students?"
              placeholderTextColor={COLORS.textMuted}
              multiline
              value={newPostContent}
              onChangeText={setNewPostContent}
            />

            <Text style={styles.tagLabel}>Tags (comma separated, e.g. Hiring, AI, Advice)</Text>
            <TextInput
              style={styles.tagInput}
              placeholder="Hiring, Internships, Networking"
              placeholderTextColor={COLORS.textMuted}
              value={newPostTags}
              onChangeText={setNewPostTags}
            />

            <TouchableOpacity
              style={[styles.publishBtn, !newPostContent.trim() && styles.publishBtnDisabled]}
              onPress={handleCreatePost}
              disabled={!newPostContent.trim()}
            >
              <Text style={styles.publishBtnText}>Publish Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  groupTabs: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  groupTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    gap: 6,
  },
  groupTabActive: {
    backgroundColor: COLORS.primary,
  },
  groupTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  groupTabTextActive: {
    color: '#FFFFFF',
  },
  groupHeaderCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  groupTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  groupDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  groupMemberCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  joinBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  leaveBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  leaveBtnText: {
    color: '#059669',
  },
  createPostBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    marginTop: 14,
  },
  myMiniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  createPostPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  feedList: {
    padding: 16,
    paddingBottom: 32,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  postAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  authorMeta: {
    marginLeft: 10,
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  authorHeadline: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  postTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  postContent: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: 10,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  postStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
    gap: 16,
  },
  statBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginTop: 2,
  },
  commentBubble: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 8,
    marginLeft: 8,
    flex: 1,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  commentText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  commentTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
  },
  commentSubmitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  emptyFeed: {
    alignItems: 'center',
    paddingVertical: 40,
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
    paddingHorizontal: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  postModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    ...SHADOWS.lg,
  },
  postModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  postInput: {
    height: 120,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
  },
  tagLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
  tagInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
  },
  publishBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  publishBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
