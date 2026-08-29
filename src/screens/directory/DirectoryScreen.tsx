import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { SearchInput } from '../../components/common/SearchInput';
import { Badge } from '../../components/common/Badge';
import { UserProfile } from '../../api/types';

type DirectoryTab = 'all' | 'near' | 'industry';

export const DirectoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { allUsers, currentUser, isAuthenticated } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<DirectoryTab>('all');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filters state
  const [filterMentorOnly, setFilterMentorOnly] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedGradYear, setSelectedGradYear] = useState<string>('All');
  const [geoOptIn, setGeoOptIn] = useState(true);

  const industries = ['All', 'Technology & AI', 'FinTech & Payments', 'Venture Capital & Private Equity', 'Healthcare & Biotech', 'Higher Education & Philanthropy'];
  const gradYears = ['All', '2018', '2015', '2014', '2012', '2002', '2027'];

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      // Don't show self in directory list
      if (user.id === currentUser.id) return false;

      // Text search match
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(q) ||
        user.headline.toLowerCase().includes(q) ||
        user.currentCompany?.toLowerCase().includes(q) ||
        user.education.major.toLowerCase().includes(q) ||
        user.skills.some(s => s.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Tab filter
      if (activeTab === 'near') {
        if (!geoOptIn) return false;
        if (!user.distanceMiles || user.distanceMiles > 15) return false;
      } else if (activeTab === 'industry') {
        if (user.industry !== currentUser.industry) return false;
      }

      // Filter modal options
      if (filterMentorOnly && !user.isMentor) return false;
      if (selectedIndustry !== 'All' && user.industry !== selectedIndustry) return false;
      if (selectedGradYear !== 'All' && user.education.gradYear.toString() !== selectedGradYear) return false;

      return true;
    });
  }, [allUsers, currentUser, searchQuery, activeTab, geoOptIn, filterMentorOnly, selectedIndustry, selectedGradYear]);

  const activeFiltersCount =
    (filterMentorOnly ? 1 : 0) +
    (selectedIndustry !== 'All' ? 1 : 0) +
    (selectedGradYear !== 'All' ? 1 : 0);

  const renderUserCard = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProfileDetailScreen', { userId: item.id })}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {item.verified && (
            <View style={styles.verifiedCheck}>
              <Ionicons name="checkmark" size={10} color="#FFFFFF" />
            </View>
          )}
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            {item.distanceMiles && activeTab === 'near' && (
              <Text style={styles.distanceText}>{item.distanceMiles} mi away</Text>
            )}
          </View>
          <Text style={styles.headline} numberOfLines={2}>{item.headline}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="school-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{item.education.major} '{item.education.gradYear.toString().slice(-2)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.skillsRow}>
        {item.isMentor && (
          <Badge
            label="Available Mentor"
            variant="success"
            icon="school"
            size="sm"
            style={{ marginRight: 6, marginBottom: 4 }}
          />
        )}
        {item.skills.slice(0, 3).map((s, idx) => (
          <Badge
            key={idx}
            label={s}
            variant="neutral"
            size="sm"
            style={{ marginRight: 6, marginBottom: 4 }}
          />
        ))}
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.viewProfileBtn}
          onPress={() => navigation.navigate('ProfileDetailScreen', { userId: item.id })}
        >
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.messageBtn}
          onPress={() => {
            if (!isAuthenticated) {
              Alert.alert(
                'Login Required',
                'Please sign in with your university account to send direct messages.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Login', onPress: () => navigation.navigate('ProfileTab') },
                ]
              );
              return;
            }
            navigation.navigate('ChatScreen', {
              participantId: item.id,
              participantName: item.name,
              participantAvatar: item.avatar,
            });
          }}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={COLORS.primary} />
          <Text style={styles.messageBtnText}>Message</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Alumni Directory"
        subtitle={`${filteredUsers.length} verified alumni & students`}
        onNotificationPress={() => navigation.navigate('NotificationCenterScreen')}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, company, major, or skill..."
          onFilterPress={() => setFilterModalVisible(true)}
          filterActive={activeFiltersCount > 0}
        />

        {/* Discovery Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All Directory
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'near' && styles.activeTab]}
            onPress={() => setActiveTab('near')}
          >
            <Ionicons
              name="navigate-outline"
              size={13}
              color={activeTab === 'near' ? COLORS.primary : COLORS.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.tabText, activeTab === 'near' && styles.activeTabText]}>
              Near Me
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'industry' && styles.activeTab]}
            onPress={() => setActiveTab('industry')}
          >
            <Ionicons
              name="briefcase-outline"
              size={13}
              color={activeTab === 'industry' ? COLORS.primary : COLORS.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.tabText, activeTab === 'industry' && styles.activeTabText]}>
              My Industry
            </Text>
          </TouchableOpacity>
        </View>

        {/* Near Me Geolocation Opt-in banner */}
        {activeTab === 'near' && (
          <View style={styles.geoOptInBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.geoTitle}>Location Discovery</Text>
              <Text style={styles.geoSub}>Show alumni within 15 miles of your current location</Text>
            </View>
            <Switch
              value={geoOptIn}
              onValueChange={setGeoOptIn}
              trackColor={{ false: '#CBD5E1', true: COLORS.primaryLight }}
            />
          </View>
        )}

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <View style={styles.filterChipRow}>
            <Text style={styles.filterChipLabel}>Filters active ({activeFiltersCount}):</Text>
            {filterMentorOnly && (
              <TouchableOpacity
                style={styles.chip}
                onPress={() => setFilterMentorOnly(false)}
              >
                <Text style={styles.chipText}>Mentors Only</Text>
                <Ionicons name="close" size={14} color={COLORS.primary} />
              </TouchableOpacity>
            )}
            {selectedIndustry !== 'All' && (
              <TouchableOpacity
                style={styles.chip}
                onPress={() => setSelectedIndustry('All')}
              >
                <Text style={styles.chipText}>{selectedIndustry}</Text>
                <Ionicons name="close" size={14} color={COLORS.primary} />
              </TouchableOpacity>
            )}
            {selectedGradYear !== 'All' && (
              <TouchableOpacity
                style={styles.chip}
                onPress={() => setSelectedGradYear('All')}
              >
                <Text style={styles.chipText}>Class of {selectedGradYear}</Text>
                <Ionicons name="close" size={14} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Directory List */}
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.id}
          renderItem={renderUserCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Alumni Found</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search keywords or removing active filters.
              </Text>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSearchQuery('');
                  setFilterMentorOnly(false);
                  setSelectedIndustry('All');
                  setSelectedGradYear('All');
                  setActiveTab('all');
                }}
              >
                <Text style={styles.resetBtnText}>Reset All Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalCard}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter Directory</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Mentorship Availability */}
              <View style={styles.filterSection}>
                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.filterSectionTitle}>Mentorship Availability</Text>
                    <Text style={styles.filterDesc}>Only show alumni offering 1:1 mentorship</Text>
                  </View>
                  <Switch
                    value={filterMentorOnly}
                    onValueChange={setFilterMentorOnly}
                    trackColor={{ false: '#CBD5E1', true: COLORS.accent }}
                  />
                </View>
              </View>

              {/* Industry Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Industry</Text>
                <View style={styles.pillsWrap}>
                  {industries.map(ind => (
                    <TouchableOpacity
                      key={ind}
                      style={[styles.pill, selectedIndustry === ind && styles.pillActive]}
                      onPress={() => setSelectedIndustry(ind)}
                    >
                      <Text style={[styles.pillText, selectedIndustry === ind && styles.pillTextActive]}>
                        {ind}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Graduation Year */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Graduation Class</Text>
                <View style={styles.pillsWrap}>
                  {gradYears.map(yr => (
                    <TouchableOpacity
                      key={yr}
                      style={[styles.pill, selectedGradYear === yr && styles.pillActive]}
                      onPress={() => setSelectedGradYear(yr)}
                    >
                      <Text style={[styles.pillText, selectedGradYear === yr && styles.pillTextActive]}>
                        {yr === 'All' ? 'All Classes' : `Class of ${yr}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => {
                  setFilterMentorOnly(false);
                  setSelectedIndustry('All');
                  setSelectedGradYear('All');
                }}
              >
                <Text style={styles.clearBtnText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.applyBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
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
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  geoOptInBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 12,
  },
  geoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  geoSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  filterChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  filterChipLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  chipText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  verifiedCheck: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0284C7',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  distanceText: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  headline: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
  },
  viewProfileBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewProfileText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  messageBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    gap: 6,
  },
  messageBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  resetBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  filterModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    ...SHADOWS.lg,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  filterSection: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  filterDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  pillText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  applyBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
