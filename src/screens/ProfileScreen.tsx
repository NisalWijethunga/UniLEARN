import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const { horizontalPadding } = useResponsive();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Profile" subtitle="Account & settings" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding, paddingBottom: 32 }}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.studentId}>{user.studentId}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Semester {user.semester}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <InfoRow icon="mail-outline" label="Email" value={user.email} />
          <InfoRow icon="school-outline" label="Program" value={user.program} />
          <InfoRow icon="id-card-outline" label="Student ID" value={user.studentId} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <MenuRow icon="notifications-outline" label="Notifications" />
          <MenuRow icon="lock-closed-outline" label="Change Password" />
          <MenuRow icon="help-circle-outline" label="Help & Support" />
          <MenuRow icon="information-circle-outline" label="About UniLEARN" />
        </View>

        <View style={styles.logoutSection}>
          <Button title="Sign Out" onPress={handleLogout} variant="outline" />
        </View>

        <Text style={styles.version}>UniLEARN v1.0.0 · NSBM Green University</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={infoStyles.row}>
      <Ionicons name={icon} size={20} color={colors.primary} style={infoStyles.icon} />
      <View style={infoStyles.content}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

function MenuRow({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <TouchableOpacity style={menuStyles.row} activeOpacity={0.7}>
      <Ionicons name={icon} size={22} color={colors.textSecondary} />
      <Text style={menuStyles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
    </TouchableOpacity>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  icon: {
    marginRight: 14,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },
});

const menuStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 14,
  },
  label: {
    ...typography.body,
    color: colors.text,
    flex: 1,
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
    paddingTop: 24,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  studentId: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
  },
  badge: {
    marginTop: 12,
    backgroundColor: colors.overlay,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 12,
  },
  logoutSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  version: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
  },
});
