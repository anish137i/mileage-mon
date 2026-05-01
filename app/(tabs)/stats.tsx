import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useMileage } from '../../context/MileageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { entries, totalDistance, averageKml, loading, currency } = useMileage();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const totalFuel = entries.reduce((acc, entry) => acc + entry.fuelAdded, 0);
  const totalCost = entries.reduce((acc, entry) => acc + entry.fuelCost, 0);
  const lastEntry = entries.length > 0 ? entries[0] : null;

  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#1E293B' : '#F1F5F9';

  if (loading) return null;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: textColor }]}>Efficiency Stats</Text>

      {/* Main Metric Card */}
      <View style={[styles.mainCard, { backgroundColor: '#22C55E' }]}>
        <View style={styles.mainMetricHeader}>
          <IconSymbol name="leaf.fill" size={24} color="#FFFFFF" />
          <Text style={styles.mainMetricLabel}>Average Efficiency</Text>
        </View>
        <Text style={styles.mainMetricValue}>{averageKml.toFixed(2)}</Text>
        <Text style={styles.mainMetricUnit}>Kilometers per Litre (KM/L)</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statBox, { backgroundColor: cardBg }]}>
          <Text style={[styles.statLabel, { color: subtextColor }]}>Total Distance</Text>
          <Text style={[styles.statValue, { color: textColor }]}>{totalDistance.toLocaleString()} km</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: cardBg }]}>
          <Text style={[styles.statLabel, { color: subtextColor }]}>Total Fuel</Text>
          <Text style={[styles.statValue, { color: textColor }]}>{totalFuel.toFixed(1)} L</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statBox, { backgroundColor: cardBg }]}>
          <Text style={[styles.statLabel, { color: subtextColor }]}>Total Cost</Text>
          <Text style={[styles.statValue, { color: textColor }]}>{currency}{totalCost.toLocaleString()}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: cardBg }]}>
          <Text style={[styles.statLabel, { color: subtextColor }]}>Avg Cost/KM</Text>
          <Text style={[styles.statValue, { color: textColor }]}>
            {currency}{totalDistance > 0 ? (totalCost / totalDistance).toFixed(2) : '0.00'}
          </Text>
        </View>
      </View>

      <View style={styles.insightsSection}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Insights</Text>
        
        {entries.length < 2 ? (
          <View style={[styles.insightCard, { backgroundColor: cardBg }]}>
            <IconSymbol name="info.circle.fill" size={20} color="#22C55E" />
            <Text style={[styles.insightText, { color: subtextColor }]}>
              Add at least two entries to see fuel efficiency trends.
            </Text>
          </View>
        ) : (
          <View style={[styles.insightCard, { backgroundColor: cardBg }]}>
            <IconSymbol name="checkmark.circle.fill" size={20} color="#22C55E" />
            <Text style={[styles.insightText, { color: textColor }]}>
              Your vehicle is performing consistently at {averageKml.toFixed(1)} KM/L.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  mainCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  mainMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  mainMetricLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  mainMetricValue: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
  },
  mainMetricUnit: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    gap: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  insightsSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  insightCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
});
