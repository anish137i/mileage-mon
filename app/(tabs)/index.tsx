import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useMileage } from '../../context/MileageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  const router = useRouter();
  const { entries, totalDistance, loading, currency } = useMileage();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const lastOdo = entries.length > 0 ? entries[0].odometer : 0;
  const recentEntries = entries.slice(0, 5);

  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.8)';

  if (loading) return null;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: '#22C55E' }]}>
          <View>
            <Text style={styles.summaryLabel}>Total Distance Tracked</Text>
            <Text style={styles.summaryValue}>{totalDistance.toLocaleString()} km</Text>
          </View>
          <View style={styles.summaryBadge}>
            <Text style={styles.badgeText}>Active</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.grid}>
          <View style={[styles.gridItem, { backgroundColor: cardBg }]}>
            <IconSymbol name="gauge" size={24} color="#22C55E" />
            <Text style={[styles.gridLabel, { color: subtextColor }]}>Last Odo</Text>
            <Text style={[styles.gridValue, { color: textColor }]}>{lastOdo.toLocaleString()}</Text>
          </View>
          <View style={[styles.gridItem, { backgroundColor: cardBg }]}>
            <IconSymbol name="plus.circle.fill" size={24} color="#22C55E" />
            <Text style={[styles.gridLabel, { color: subtextColor }]}>Trips Logged</Text>
            <Text style={[styles.gridValue, { color: textColor }]}>{entries.length}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Activity</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/stats')}>
            <Text style={styles.seeAll}>See All Stats</Text>
          </TouchableOpacity>
        </View>

        {entries.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: cardBg }]}>
            <IconSymbol name="car.fill" size={48} color="#64748B" />
            <Text style={[styles.emptyText, { color: subtextColor }]}>No entries yet. Start tracking your mileage!</Text>
          </View>
        ) : (
          recentEntries.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.entryCard, { backgroundColor: cardBg }]}
              onPress={() => router.push(`/add-entry?id=${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.entryMain}>
                <Text style={[styles.entryOdo, { color: textColor }]}>{item.odometer.toLocaleString()} km</Text>
                <Text style={[styles.entryDate, { color: subtextColor }]}>
                  {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </View>
              <View style={styles.entrySide}>
                <Text style={styles.entryFuel}>+{item.fuelAdded}L</Text>
                <Text style={[styles.entryCost, { color: subtextColor }]}>{currency}{item.fuelCost}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/add-entry')}
        activeOpacity={0.8}
      >
        <IconSymbol name="plus" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  summaryCard: {
    height: 140,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  summaryLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  summaryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  gridItem: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    gap: 8,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  gridValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  seeAll: {
    color: '#22C55E',
    fontWeight: '600',
    fontSize: 14,
  },
  entryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  entryMain: {
    gap: 4,
  },
  entryOdo: {
    fontSize: 18,
    fontWeight: '700',
  },
  entryDate: {
    fontSize: 14,
  },
  entrySide: {
    alignItems: 'flex-end',
    gap: 4,
  },
  entryFuel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },
  entryCost: {
    fontSize: 14,
  },
  emptyState: {
    height: 200,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
