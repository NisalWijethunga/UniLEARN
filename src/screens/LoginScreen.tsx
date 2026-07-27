import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';

export function LoginScreen() {
  const { login, error, clearError } = useAuth();
  const { horizontalPadding } = useResponsive();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = 'Email is required';
    else if (!email.includes('@')) errors.email = 'Enter a valid email';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 4) errors.password = 'Minimum 4 characters';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[colors.primaryDark, colors.primary, colors.primaryLight]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={[styles.scroll, { paddingHorizontal: horizontalPadding }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoSection}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>UL</Text>
              </View>
              <Text style={styles.appName}>UniLEARN</Text>
              <Text style={styles.tagline}>NSBM Green University</Text>
              <Text style={styles.subTagline}>Student Learning Management</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Welcome Back</Text>
              <Text style={styles.formSubtitle}>Sign in to continue learning</Text>

              <Input
                label="University Email"
                icon="mail-outline"
                placeholder="name@students.nsbm.ac.lk"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={fieldErrors.email}
              />
              <Input
                label="Password"
                icon="lock-closed-outline"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={fieldErrors.password}
              />

              {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

              <Button title="Sign In" onPress={handleLogin} loading={loading} />

              <Text style={styles.demoHint}>
                Demo: use any email and password (4+ chars)
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
  },
  tagline: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  subTagline: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 4,
  },
  formSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  errorBanner: {
    ...typography.bodySmall,
    color: colors.error,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  demoHint: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
});
