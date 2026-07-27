import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { coursesApi } from '../api/courses';
import { examsApi } from '../api/exams';
import { assignmentsApi } from '../api/assignments';
import { Course, Exam, Assignment } from '../types';
import { LoadingScreen } from '../components/LoadingScreen';
import { CourseCard } from '../components/CourseCard';
import { ExamCard } from '../components/ExamCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const { horizontalPadding } = useResponsive();
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [coursesData, examsData, assignmentsData] = await Promise.all([
        coursesApi.getAll(),
        examsApi.getUpcoming(),
        assignmentsApi.getAll(),
      ]);
      setCourses(coursesData);
      setExams(examsData.slice(0, 2));
      setAssignments(assignmentsData.filter((a) => a.status === 'pending'));
    } catch {
      // Silently fail on dashboard — individual screens handle errors
    }
  }, []);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) return <LoadingScreen />;

  const firstName = user?.name.split(' ')[0] ?? 'Student';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View>
            <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
            <Text style={styles.program} numberOfLines={1}>
              {user?.program}
            </Text>
            <Text style={styles.semester}>Semester {user?.semester}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {firstName.charAt(0)}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="book-outline" label="Courses" value={courses.length.toString()} />
          <StatCard
            icon="document-text-outline"
            label="Pending"
            value={assignments.length.toString()}
            color={colors.accent}
          />
          <StatCard
            icon="calendar-outline"
            label="Exams"
            value={exams.length.toString()}
            color={colors.info}
          />
        </View>

        <SectionHeader
          title="Upcoming Exams"
          action="View All"
          onAction={() => navigation.navigate('MainTabs', { screen: 'Exams' } as never)}
        />
        {exams.length > 0 ? (
          exams.map((exam) => <ExamCard key={exam.id} exam={exam} />)
        ) : (
          <Text style={styles.emptyText}>No upcoming exams</Text>
        )}

        <SectionHeader
          title="My Courses"
          action="See All"
          onAction={() => navigation.navigate('MainTabs', { screen: 'Courses' } as never)}
        />
        {courses.slice(0, 2).map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
          />
        ))}

        {assignments.length > 0 && (
          <>
            <SectionHeader
              title="Pending Assignments"
              action="View All"
              onAction={() => navigation.navigate('MainTabs', { screen: 'Assignments' } as never)}
            />
            {assignments.slice(0, 3).map((assignment) => (
              <View key={assignment.id} style={styles.assignmentItem}>
                <View style={styles.assignmentDot} />
                <View style={styles.assignmentContent}>
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                  <Text style={styles.assignmentMeta}>
                    {assignment.courseCode} · Due {formatDate(assignment.dueDate)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  label,
  value,
  color = colors.primary,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={statStyles.card}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <View style={sectionStyles.row}>
      <Text style={sectionStyles.title}>{title}</Text>
      <TouchableOpacity onPress={onAction}>
        <Text style={sectionStyles.action}>{action}</Text>
      </TouchableOpacity>
    </View>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  value: {
    ...typography.h2,
    color: colors.text,
    marginTop: 6,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  action: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 8,
  },
  hero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
  },
  program: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
    maxWidth: 260,
  },
  semester: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h3,
    color: colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 16,
  },
  assignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  assignmentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginRight: 12,
  },
  assignmentContent: {
    flex: 1,
  },
  assignmentTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  assignmentMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
