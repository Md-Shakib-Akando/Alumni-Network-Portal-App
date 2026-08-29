import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../../constants/theme';
import { useApp } from '../../store/AppContext';
import { ReportUserModal } from '../../components/modals/ReportUserModal';

export const ChatScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { currentUser, sendMessage, markConversationAsRead } = useApp();

  const participantId = route.params?.participantId;
  const participantName = route.params?.participantName || 'Alumni Contact';
  const participantAvatar = route.params?.participantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  const [inputText, setInputText] = useState('');
  const [reportModalVisible, setReportModalVisible] = useState(false);

  // Initial messages state for this conversation
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'm1',
      senderId: participantId,
      text: `Hello ${currentUser.name}! Great connecting with you on the Alumni Portal.`,
      timestamp: '10:14 AM',
    },
    {
      id: 'm2',
      senderId: currentUser.id,
      text: 'Thanks for reaching out! Excited to discuss industry trends and opportunities.',
      timestamp: '10:16 AM',
    },
  ]);

  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: inputText.trim(),
      timestamp: 'Just now',
    };

    setChatMessages(prev => [...prev, newMsg]);
    sendMessage(participantId, inputText.trim());
    setInputText('');

    // Simulated reply after 1.5s for demo verification
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          senderId: participantId,
          text: 'Got it! Looking forward to chatting further.',
          timestamp: 'Just now',
        },
      ]);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      {/* Chat Navigation Bar */}
      <View style={[styles.navBar, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 24 : 16) + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerInfo}
          onPress={() => navigation.navigate('ProfileDetailScreen', { userId: participantId })}
        >
          <Image source={{ uri: participantAvatar }} style={styles.navAvatar} />
          <View style={styles.navTextCol}>
            <Text style={styles.navName} numberOfLines={1}>{participantName}</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Active on Portal</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportBtn} onPress={() => setReportModalVisible(true)}>
          <Ionicons name="alert-circle-outline" size={22} color={COLORS.accentRose} />
        </TouchableOpacity>
      </View>

      {/* Safety Notice */}
      <View style={styles.safetyNotice}>
        <Ionicons name="lock-closed" size={12} color="#0284C7" />
        <Text style={styles.safetyText}>
          Direct message between verified university members. Moderation enabled.
        </Text>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isMe = item.senderId === currentUser.id;
          return (
            <View style={[styles.bubbleWrap, isMe ? styles.myBubbleWrap : styles.theirBubbleWrap]}>
              <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>
                  {item.text}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={[styles.timestamp, isMe ? styles.myTime : styles.theirTime]}>
                    {item.timestamp}
                  </Text>
                  {isMe && (
                    <Ionicons name="checkmark-done" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Write a message..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
        >
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Safety & Moderation Modal */}
      <ReportUserModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        targetUserId={participantId}
        targetUserName={participantName}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  backBtn: {
    padding: 4,
    marginRight: 6,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  navTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  navName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginRight: 4,
  },
  onlineText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  reportBtn: {
    padding: 6,
  },
  safetyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  safetyText: {
    fontSize: 11,
    color: '#0369A1',
    fontWeight: '500',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  bubbleWrap: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  myBubbleWrap: {
    alignSelf: 'flex-end',
  },
  theirBubbleWrap: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 2,
  },
  theirBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myText: {
    color: '#FFFFFF',
  },
  theirText: {
    color: COLORS.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
  },
  myTime: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  theirTime: {
    color: COLORS.textMuted,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
});
