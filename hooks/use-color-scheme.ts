import { useMileage } from '../context/MileageContext';

export function useColorScheme() {
  const { colorScheme } = useMileage();
  return colorScheme;
}
