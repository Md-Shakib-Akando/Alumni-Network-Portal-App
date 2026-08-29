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

export const CreateEventScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { createEvent, currentUser, isAuthenticated } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'reunion' | 'networking' | 'workshop' | 'keynote' | 'social'>('networking');
  const [type, setType] = useState<'in-person' | 'virtual' | 'hybrid'>('in-person');
  const [date, setDate] = useState('Nov 20, 2026');
  const [time, setTime] = useState('6:00 PM - 8:30 PM PST');
  const [location, setLocation] = useState('Alumni Hall & Innovation Lounge');
  const [virtualLink, setVirtualLink] = useState('');
  const [capacity, setCapacity] = useState('100');

  const handlePublish = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please sign in with your university account to host campus events.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('ProfileTab') },
        ]
      );
      return;
    }

    if (!title.trim() || !description.trim()) {
      Alert.alert('Missing Details', 'Please fill in an event title and description.');
      return;
    }

    createEvent({
      title: title.trim(),
      description: description.trim(),
      category,
      type,
      date,
      time,
      location,
      virtualLink: virtualLink.trim() || undefined,
      organizer: `${currentUser.name} (${currentUser.role === 'staff' ? 'Alumni Relations' : 'Alumni Chapter'})`,
      capacity: parseInt(capacity, 10) || 50,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    });

    Alert.alert('Event Published!', 'Your event is now live and listed in the community calendar.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.navBar, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 24 : 16) + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Host an Alumni Event</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handlePublish}>
          <Text style={styles.saveBtnText}>Publish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.label}>Event Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. NYC Alumni Happy Hour & FinTech Panel"
          placeholderTextColor={COLORS.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Event Category</Text>
        <View style={styles.chipsRow}>
          {(['reunion', 'networking', 'workshop', 'keynote', 'social'] as const).map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Delivery Format</Text>
        <View style={styles.chipsRow}>
          {(['in-person', 'virtual', 'hybrid'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, type === t && styles.chipActive]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.chipText, type === t && styles.chipTextActive]}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Date</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Time</Text>
            <TextInput style={styles.input} value={time} onChangeText={setTime} />
          </View>
        </View>

        <Text style={styles.label}>Location / Venue</Text>
        <TextInput
          style={styles.input}
          placeholder="Building name, address, or room"
          placeholderTextColor={COLORS.textMuted}
          value={location}
          onChangeText={setLocation}
        />

        {(type === 'virtual' || type === 'hybrid') && (
          <>
            <Text style={styles.label}>Virtual Broadcast Link</Text>
            <TextInput
              style={styles.input}
              placeholder="https://zoom.us/j/..."
              placeholderTextColor={COLORS.textMuted}
              value={virtualLink}
              onChangeText={setVirtualLink}
            />
          </>
        )}

        <Text style={styles.label}>Max Attendee Capacity</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={capacity}
          onChangeText={setCapacity}
        />

        <Text style={styles.label}>Description & Agenda *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Outline keynote speakers, schedule, networking format, and attendee requirements..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.publishBottomBtn} onPress={handlePublish}>
          <Text style={styles.publishBottomBtnText}>Publish to Community</Text>
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
  row: {
    flexDirection: 'row',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
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
  publishBottomBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  publishBottomBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
