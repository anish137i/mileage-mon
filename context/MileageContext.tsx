import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MileageEntry {
  id: string;
  date: string;
  odometer: number;
  fuelAdded: number;
  fuelCost: number;
}

interface MileageContextType {
  entries: MileageEntry[];
  addEntry: (odometer: number, fuelAdded: number, fuelCost: number) => Promise<void>;
  updateEntry: (id: string, odometer: number, fuelAdded: number, fuelCost: number) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  totalDistance: number;
  averageKml: number;
  loading: boolean;
  currency: string;
  updateCurrency: (symbol: string) => Promise<void>;
  themeMode: 'system' | 'light' | 'dark';
  setThemeMode: (mode: 'system' | 'light' | 'dark') => Promise<void>;
  colorScheme: 'light' | 'dark';
}

const MileageContext = createContext<MileageContextType | undefined>(undefined);

const STORAGE_KEY = '@mileage_entries';

export function MileageProvider({ children }: { children: ReactNode }) {
  const nativeColorScheme = useColorScheme() ?? 'light';
  const [entries, setEntries] = useState<MileageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('$');
  const [themeMode, setThemeModeState] = useState<'system'|'light'|'dark'>('system');

  const SETTINGS_KEY = '@mileage_settings';
  const THEME_KEY = '@mileage_theme';

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const savedEntries = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
      const savedCurrency = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedCurrency) {
        setCurrency(savedCurrency);
      }
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme) {
        setThemeModeState(savedTheme as any);
      }
    } catch (e) {
      console.error('Failed to load entries', e);
    } finally {
      setLoading(false);
    }
  };

  const updateCurrency = async (symbol: string) => {
    setCurrency(symbol);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, symbol);
    } catch (e) {
      console.error('Failed to save currency', e);
    }
  };

  const setThemeMode = async (mode: 'system' | 'light' | 'dark') => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const colorScheme = themeMode === 'system' ? nativeColorScheme : themeMode;

  const saveEntries = async (newEntries: MileageEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    } catch (e) {
      console.error('Failed to save entries', e);
    }
  };

  const addEntry = async (odometer: number, fuelAdded: number, fuelCost: number) => {
    const newEntry: MileageEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      odometer,
      fuelAdded,
      fuelCost,
    };
    const updatedEntries = [newEntry, ...entries].sort((a, b) => b.odometer - a.odometer);
    setEntries(updatedEntries);
    await saveEntries(updatedEntries);
  };

  const updateEntry = async (id: string, odometer: number, fuelAdded: number, fuelCost: number) => {
    const updatedEntries = entries.map(entry => 
      entry.id === id ? { ...entry, odometer, fuelAdded, fuelCost } : entry
    ).sort((a, b) => b.odometer - a.odometer);
    
    setEntries(updatedEntries);
    await saveEntries(updatedEntries);
  };

  const deleteEntry = async (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    await saveEntries(updatedEntries);
  };

  // Calculations
  const totalDistance = entries.length > 1 
    ? Math.max(...entries.map(e => e.odometer)) - Math.min(...entries.map(e => e.odometer))
    : 0;

  const calculateAverageKml = () => {
    if (entries.length < 2) return 0;
    
    // Sort entries by odometer reading ascending to calculate properly
    const sorted = [...entries].sort((a, b) => a.odometer - b.odometer);
    let totalKm = 0;
    let totalFuel = 0;

    for (let i = 1; i < sorted.length; i++) {
      const dist = sorted[i].odometer - sorted[i-1].odometer;
      totalKm += dist;
      totalFuel += sorted[i].fuelAdded;
    }

    return totalFuel > 0 ? (totalKm / totalFuel) : 0;
  };

  return (
    <MileageContext.Provider value={{ 
      entries, 
      addEntry, 
      updateEntry,
      deleteEntry,
      totalDistance, 
      averageKml: calculateAverageKml(),
      loading,
      currency,
      updateCurrency,
      themeMode,
      setThemeMode,
      colorScheme
    }}>
      {children}
    </MileageContext.Provider>
  );
}

export function useMileage() {
  const context = useContext(MileageContext);
  if (context === undefined) {
    throw new Error('useMileage must be used within a MileageProvider');
  }
  return context;
}
