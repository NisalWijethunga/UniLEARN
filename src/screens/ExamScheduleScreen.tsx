import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { examsApi } from '../api/exams';
import { Exam } from '../types';
import { Header } from '../components/Header';
import { ExamCard } from '../components/ExamCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';

type Filter = 'all' | 'upcoming' | 'completed';

export function ExamScheduleScreen() {
  const { horizontalPadding } = useResponsive();
  const [exams, setExams] = useState<Exam[]>([]);
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchExams = useCallback(async () => {
    const data = await examsApi.getAll();
    setExams(data);
  }, []);

  useEffect(() => {
    fetchExams().finally(() => setLoading(false));
  }, [fetchExams]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExams();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    if (filter === 'all') return exams;
    return exams.filter((e) => e.status === filter);
  }, [exams, filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [filtered]);

  const nextExam = useMemo(
    () => exams.find((e) => e.status === 'upcoming'),
    [exams]
  );

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Exam Schedule" subtitle="NSBM Examination Timetable" />
      <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>
        {nextExam && filter !== 'completed' && (
          <View style={styles.nextExamBanner}>
            <View style={styles.bannerIcon}>
              <Ionicons name="alarm-outline" size={24} color={colors.accent} />
            </View>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerLabel}>Next Exam</Text>
              <Text style={styles.bannerTitle} numberOfLines={1}>
                {nextExam.courseCode} — {nextExam.examType}
              </Text>
              <Text style={styles.bannerDate}>
                {formatFullDate(nextExam.date)} · {nextExam.startTime} · {nextExam.venue}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.summaryRow}>
          <SummaryChip
            icon="calendar"
            label="Total"
            value={exams.length}
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <SummaryChip
            icon="time"
            label="Upcoming"
            value={exams.filter((e) => e.status === 'upcoming').length}
            active={filter === 'upcoming'}
            onPress={() => setFilter('upcoming')}
          />
          <SummaryChip
            icon="checkmark-circle"
            label="Done"
            value={exams.filter((e) => e.status === 'completed').length}
            active={filter === 'completed'}
            onPress={() => setFilter('completed')}
          />
        </View>

        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExamCard exam={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No exams scheduled"
              message={
                filter === 'upcoming'
                  ? 'Enjoy the break — no upcoming exams right now.'
                  : 'No exams match this filter.'
              }
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
}

function SummaryChip({
  icon,
  label,
  value,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[chipStyles.chip, active && chipStyles.chipActive]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={18}
        color={active ? colors.white : colors.primary}
      />
      <Text style={[chipStyles.value, active && chipStyles.valueActive]}>{value}</Text>
      <Text style={[chipStyles.label, active && chipStyles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const chipStyles = StyleSheet.create({
  chip: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  value: {
    ...typography.h3,
    color: colors.primary,
    marginTop: 4,
  },
  valueActive: {
    color: colors.white,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  labelActive: {
    color: 'rgba(255,255,255,0.85)',
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -8,
    paddingTop: 20,
  },
  nextExamBanner: {
    flexDirection: 'row',
    backgroundColor: colors.accentLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerContent: {
    flex: 1,
  },
  bannerLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  bannerDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 24,
  },
});
