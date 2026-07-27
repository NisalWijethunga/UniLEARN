import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { coursesApi } from '../api/courses';
import { Course } from '../types';
import { Header } from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';
import { RootStackParamList } from '../navigation/types';

type RouteProps = RouteProp<RootStackParamList, 'CourseDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function CourseDetailScreen() {
  const { params } = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { horizontalPadding } = useResponsive();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesApi
      .getById(params.courseId)
      .then(setCourse)
      .finally(() => setLoading(false));
  }, [params.courseId]);

  if (loading) return <LoadingScreen />;
  if (!course) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title={course.code}
        subtitle={course.title}
        showBack
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding, paddingBottom: 32 }}
      >
        <View style={[styles.heroCard, { borderLeftColor: course.color }]}>
          <Text style={styles.heroTitle}>{course.title}</Text>
          <Text style={styles.heroLecturer}>{course.lecturer}</Text>
        </View>

        <View style={styles.infoGrid}>
          <InfoTile label="Credits" value={course.credits.toString()} />
          <InfoTile label="Progress" value={`${course.progress}%`} />
          <InfoTile label="Schedule" value={course.schedule} wide />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course Progress</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${course.progress}%`, backgroundColor: course.color },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {course.progress >= 75
              ? 'Great progress! Keep it up.'
              : course.progress >= 50
              ? 'You are halfway there.'
              : 'Stay focused and attend all sessions.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ActionRow icon="📋" label="View Assignments" />
          <ActionRow icon="📅" label="Exam Schedule" />
          <ActionRow icon="📚" label="Course Materials" />
          <ActionRow icon="💬" label="Discussion Forum" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoTile({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <View style={[infoStyles.tile, wide && infoStyles.wide]}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function ActionRow({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={actionStyles.row}>
      <Text style={actionStyles.icon}>{icon}</Text>
      <Text style={actionStyles.label}>{label}</Text>
      <Text style={actionStyles.arrow}>›</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    minWidth: '45%',
  },
  wide: {
    flex: 2,
    minWidth: '100%',
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
});

const actionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 14,
  },
  label: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  arrow: {
    fontSize: 22,
    color: colors.textLight,
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
    marginTop: -8,
    paddingTop: 20,
  },
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 5,
    marginBottom: 16,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 6,
  },
  heroLecturer: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 12,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
