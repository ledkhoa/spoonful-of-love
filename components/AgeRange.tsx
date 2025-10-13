import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface AgeRangeProps {
  minMonths: number;
  maxMonths?: number;
  compressedView: boolean;
}

export default function AgeRange({
  minMonths,
  maxMonths,
  compressedView,
}: AgeRangeProps) {
  return (
    <View className='flex-row items-center mb-2'>
      <Ionicons
        name='accessibility-outline'
        size={compressedView ? 12 : 14}
        color={colors.accent[500]}
      />
      <Text className='text-xs text-accent-500 ml-1 font-medium'>
        {compressedView
          ? maxMonths
            ? `${minMonths}-${maxMonths}mo`
            : `${minMonths}mo+`
          : maxMonths
            ? `${minMonths}-${maxMonths} months`
            : `${minMonths}+ months`}
      </Text>
    </View>
  );
}
