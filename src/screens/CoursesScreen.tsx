import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { coursesApi } from '../api/courses';
import { Course } from '../types';
import { Header } from '../components/Header';
import { CourseCard } from '../components/CourseCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function CoursesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { horizontalPadding } = useResponsive();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchCourses = useCallback(async () => {
    const data = await coursesApi.getAll();
    setCourses(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    fetchCourses().finally(() => setLoading(false));
  }, [fetchCourses]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(courses);
      return;
    }
    const query = search.toLowerCase();
    setFiltered(
      courses.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query) ||
          c.lecturer.toLowerCase().includes(query)
      )
    );
  }, [search, courses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  };

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="My Courses" subtitle="NSBM UniLEARN" />
      <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            placeholderTextColor={colors.textLight}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="book-outline"
              title="No courses found"
              message="Try adjusting your search or check back later."
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  list: {
    paddingBottom: 24,
  },
});
