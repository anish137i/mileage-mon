import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useMileage } from '../context/MileageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AddEntryScreen() {
  const router = useRouter();
  const { addEntry, entries } = useMileage();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [odometer, setOdometer] = useState('');
  const [fuel, setFuel] = useState('');
  const [cost, setCost] = useState('');

  const handleSubmit = async () => {
    const odoNum = parseFloat(odometer);
    const fuelNum = parseFloat(fuel);
    const costNum = parseFloat(cost);

    if (isNaN(odoNum) || isNaN(fuelNum) || isNaN(costNum)) {
      Alert.alert('Invalid Input', 'Please fill in all fields with valid numbers.');
      return;
    }

    if (entries.length > 0 && odoNum <= entries[0].odometer) {
      Alert.alert('Invalid Odometer', `New reading should be greater than the last (${entries[0].odometer} km).`);
      return;
    }

    await addEntry(odoNum, fuelNum, costNum);
    router.replace('/(tabs)/stats');
  };

  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const labelColor = isDark ? '#94A3B8' : '#64748B';
  const inputBg = isDark ? '#1E293B' : '#F1F5F9';

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: textColor }]}>New Trip Entry</Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: labelColor }]}>Current Odometer (km)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
            placeholder="e.g. 15420"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            value={odometer}
            onChangeText={setOdometer}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: labelColor }]}>Fuel Added (Litres)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
            placeholder="e.g. 45.5"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            value={fuel}
            onChangeText={setFuel}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: labelColor }]}>Total Cost</Text>
          <TextInput
            style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
            placeholder="e.g. 120"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            value={cost}
            onChangeText={setCost}
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Save Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelButtonText, { color: labelColor }]}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#22C55E',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
