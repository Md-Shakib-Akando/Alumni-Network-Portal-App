import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { COLORS, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { SearchInput } from '../../components/common/SearchInput';
import { Badge } from '../../components/common/Badge';
import { JobListing } from '../../api/types';

export const JobBoardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { jobs, referralRequests } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Must be approved unless user is staff
      if (job.status !== 'approved') return false;

      const q = searchQuery.toLowerCase();
      const matches =
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.requirements.some(r => r.toLowerCase().includes(q));

      if (!matches) return false;
      if (selectedType !== 'All' && job.type !== selectedType) return false;
      if (selectedLevel !== 'All' && job.experienceLevel !== selectedLevel) return false;

      return true;
    });
  }, [jobs, searchQuery, selectedType, selectedLevel]);

  const renderJobCard = ({ item }: { item: JobListing }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetailScreen', { jobId: item.id })}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.companyIconBox}>
          <Ionicons name="business" size={22} color={COLORS.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.companyName}>{item.company} • {item.location}</Text>
        </View>
      </View>

      <View style={styles.badgesRow}>
        <Badge label={item.type} variant="primary" size="sm" />
        <Badge label={item.experienceLevel} variant="neutral" size="sm" style={{ marginLeft: 6 }} />
        <Badge label={item.salaryRange} variant="success" size="sm" style={{ marginLeft: 6 }} />
      </View>

      <Text style={styles.descSnippet} numberOfLines={2}>{item.description}</Text>

      {/* Alumni Presence & Referral Incentive */}
      <View style={styles.alumniBanner}>
        <Ionicons name="people" size={14} color="#1E40AF" />
        <Text style={styles.alumniBannerText}>
          {item.alumniEmployeesCount} alumni work at {item.company}
        </Text>
        <Text style={styles.referralHint}>• Referral available</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.postedTime}>Posted {item.postedDate}</Text>
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => navigation.navigate('JobDetailScreen', { jobId: item.id })}
        >
          <Text style={styles.detailsBtnText}>View Details & Referral</Text>
          <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Careers & Job Board"
        subtitle="Alumni-exclusive listings and referral pipeline"
        onNotificationPress={() => navigation.navigate('NotificationCenterScreen')}
        rightAction={
          <TouchableOpacity
            style={styles.postJobHeaderBtn}
            onPress={() => navigation.navigate('PostJobScreen')}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.postJobHeaderBtnText}>Post Job</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by title, company, or skills..."
        />

        {/* Type Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsScroll}
          contentContainerStyle={styles.pillsContent}
        >
          {['All', 'Full-Time', 'Internship', 'Contract', 'Remote'].map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.pill, selectedType === t && styles.pillActive]}
              onPress={() => setSelectedType(t)}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, selectedType === t && styles.pillTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredJobs}
          keyExtractor={item => item.id}
          renderItem={renderJobCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="briefcase-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Jobs Found</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search criteria or clear your filters.
              </Text>
            </View>
          }
        />
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
  postJobHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  postJobHeaderBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 2,
  },
  pillsScroll: {
    marginBottom: 14,
  },
  pillsContent: {
    paddingVertical: 4,
    paddingRight: 16,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  list: {
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
    alignItems: 'center',
    marginBottom: 8,
  },
  companyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  companyName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  descSnippet: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  alumniBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    marginBottom: 10,
  },
  alumniBannerText: {
    fontSize: 11,
    color: '#1E40AF',
    fontWeight: '700',
    marginLeft: 4,
  },
  referralHint: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
  },
  postedTime: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 2,
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
    paddingHorizontal: 24,
  },
});
