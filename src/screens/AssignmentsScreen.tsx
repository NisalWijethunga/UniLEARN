import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { assignmentsApi } from '../api/assignments';
import { Assignment } from '../types';
import { Header } from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';

type Filter = 'all' | 'pending' | 'submitted' | 'graded';

const statusColors: Record<Assignment['status'], string> = {
  pending: colors.warning,
  submitted: colors.info,
  graded: colors.success,
};

const statusLabels: Record<Assignment['status'], string> = {
  pending: 'Pending',
  submitted: 'Submitted',
  graded: 'Graded',
};

export function AssignmentsScreen() {
  const { horizontalPadding } = useResponsive();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAssignments = useCallback(async () => {
    const data = await assignmentsApi.getAll();
    setAssignments(data);
  }, []);

  useEffect(() => {
    fetchAssignments().finally(() => setLoading(false));
  }, [fetchAssignments]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAssignments();
    setRefreshing(false);
  };

  const filtered =
    filter === 'all' ? assignments : assignments.filter((a) => a.status === filter);

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Assignments" subtitle="Track & submit work" />
      <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.filters}>
          {(['all', 'pending', 'submitted', 'graded'] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AssignmentItem assignment={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="document-text-outline"
              title="No assignments"
              message="You're all caught up for this filter."
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
}

function AssignmentItem({ assignment }: { assignment: Assignment }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.courseCode}>{assignment.courseCode}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[assignment.status] + '20' },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColors[assignment.status] }]}>
            {statusLabels[assignment.status]}
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{assignment.title}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.dueDate}>
          Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
        {assignment.grade && (
          <Text style={styles.grade}>Grade: {assignment.grade}</Text>
        )}
      </View>
      {assignment.status === 'pending' && (
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Submit Assignment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

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
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseCode: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  grade: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.success,
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.white,
  },
});
