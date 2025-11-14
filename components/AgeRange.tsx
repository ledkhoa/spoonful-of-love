import { colors } from '@/constants/colors';
import { Text, View } from 'react-native';
import { BabyIcon } from 'phosphor-react-native';
interface AgeRangeProps {
  minMonths: number;
  maxMonths?: number;
  compressedView: boolean;
  className?: string;
}

export default function AgeRange({
  minMonths,
  maxMonths,
  compressedView,
  className,
}: AgeRangeProps) {
  return (
    <View className={`flex-row items-center ${className ?? ''}`}>
      <BabyIcon
        weight='regular'
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
