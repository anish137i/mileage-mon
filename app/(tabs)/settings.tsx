import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { useMileage } from '../../context/MileageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const CURRENCIES = [
  { symbol: '$', name: 'US Dollar (USD)' },
  { symbol: '€', name: 'Euro (EUR)' },
  { symbol: '£', name: 'British Pound (GBP)' },
  { symbol: '₹', name: 'Indian Rupee (INR)' },
  { symbol: '¥', name: 'Japanese Yen (JPY)' },
  { symbol: 'A$', name: 'Australian Dollar (AUD)' },
  { symbol: 'C$', name: 'Canadian Dollar (CAD)' },
  { symbol: 'CHF', name: 'Swiss Franc (CHF)' },
  { symbol: 'CN¥', name: 'Chinese Yuan (CNY)' },
  { symbol: 'R', name: 'South African Rand (ZAR)' },
  { symbol: 'R$', name: 'Brazilian Real (BRL)' },
  { symbol: '₽', name: 'Russian Ruble (RUB)' },
  { symbol: 'kr', name: 'Swedish Krona (SEK)' },
];

export default function SettingsScreen() {
  const { currency, updateCurrency, themeMode, setThemeMode } = useMileage();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectCurrency = (symbol: string) => {
    updateCurrency(symbol);
    setModalVisible(false);
    Alert.alert('Success', 'Currency symbol updated!');
  };

  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const labelColor = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const modalBg = isDark ? '#0F172A' : '#F8FAFC';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <View style={styles.header}>
          <IconSymbol name="gearshape.fill" size={24} color="#22C55E" />
          <Text style={[styles.title, { color: textColor }]}>App Settings</Text>
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Currency Symbol</Text>
            <Text style={[styles.settingDesc, { color: labelColor }]}>Used for displaying fuel costs</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.dropdownButton, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[styles.dropdownButtonText, { color: textColor }]}>{currency}</Text>
            <IconSymbol name="chevron.right" size={20} color={labelColor} />
          </TouchableOpacity>
        </View>
        <View style={[styles.settingRow, { marginTop: 32 }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: textColor }]}>App Theme</Text>
            <Text style={[styles.settingDesc, { color: labelColor }]}>Select your preferred theme</Text>
          </View>
        </View>
        
        <View style={styles.themeToggleContainer}>
          {(['system', 'light', 'dark'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.themeToggleButton,
                themeMode === mode && { backgroundColor: '#22C55E' },
                themeMode !== mode && { backgroundColor: isDark ? '#334155' : '#F1F5F9' }
              ]}
              onPress={() => setThemeMode(mode)}
            >
              <Text 
                style={[
                  styles.themeToggleText,
                  { color: themeMode === mode ? '#FFFFFF' : textColor }
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: modalBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Select Currency</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={[styles.closeButtonText, { color: labelColor }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={CURRENCIES}
              keyExtractor={(item) => item.symbol}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.currencyItem, 
                    currency === item.symbol && { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }
                  ]}
                  onPress={() => handleSelectCurrency(item.symbol)}
                >
                  <View style={styles.currencyLeft}>
                    <Text style={[styles.currencySymbol, { color: textColor }]}>{item.symbol}</Text>
                    <Text style={[styles.currencyName, { color: textColor }]}>{item.name}</Text>
                  </View>
                  {currency === item.symbol && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color="#22C55E" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 14,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  dropdownButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  themeToggleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  themeToggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    paddingTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    width: 32,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '500',
  },
});
