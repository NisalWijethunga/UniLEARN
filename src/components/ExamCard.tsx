import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exam } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface ExamCardProps {
  exam: Exam;
}

const statusConfig = {
  upcoming: { color: colors.info, label: 'Upcoming', icon: 'calendar' as const },
  completed: { color: colors.success, label: 'Completed', icon: 'checkmark-circle' as const },
  cancelled: { color: colors.error, label: 'Cancelled', icon: 'close-circle' as const },
};

const typeColors: Record<Exam['examType'], string> = {
  Midterm: colors.primary,
  Final: colors.primaryDark,
  Quiz: colors.info,
  Practical: colors.accent,
};

export function ExamCard({ exam }: ExamCardProps) {
  const status = statusConfig[exam.status];
  const examDate = new Date(exam.date);
  const day = examDate.getDate();
  const month = examDate.toLocaleString('en-US', { month: 'short' });

  return (
    <View style={styles.card}>
      <View style={styles.dateBox}>
        <Text style={styles.dateDay}>{day}</Text>
        <Text style={styles.dateMonth}>{month}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.typeBadge, { backgroundColor: typeColors[exam.examType] + '20' }]}>
            <Text style={[styles.typeText, { color: typeColors[exam.examType] }]}>
              {exam.examType}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '15' }]}>
            <Ionicons name={status.icon} size={12} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>
        <Text style={styles.courseCode}>{exam.courseCode}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {exam.courseTitle}
        </Text>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              {exam.startTime} – {exam.endTime}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{exam.venue}</Text>
          </View>
          {exam.seatNumber && (
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>Seat: {exam.seatNumber}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  dateBox: {
    width: 56,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  dateDay: {
    ...typography.h2,
    color: colors.white,
    lineHeight: 26,
  },
  dateMonth: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    ...typography.caption,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '500',
  },
  courseCode: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  title: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  details: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
});
