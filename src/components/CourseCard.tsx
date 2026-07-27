import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

export function CourseCard({ course, onPress }: CourseCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.accent, { backgroundColor: course.color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.code}>{course.code}</Text>
          <Text style={styles.credits}>{course.credits} credits</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={styles.lecturer}>{course.lecturer}</Text>
        <View style={styles.footer}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.schedule}>{course.schedule}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${course.progress}%`, backgroundColor: course.color },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{course.progress}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  accent: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  code: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.primary,
  },
  credits: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 4,
  },
  lecturer: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  schedule: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary,
    minWidth: 32,
  },
});
