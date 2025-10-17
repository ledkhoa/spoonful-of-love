import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

type DietaryType =
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'freezer-friendly';

interface DietaryBadgeProps {
  type: DietaryType;
  size?: 'small' | 'medium' | 'large';
}

const DIETARY_CONFIG: Record<
  DietaryType,
  { label?: string; icon?: string; bgColor: string; textColor: string }
> = {
  vegan: {
    label: 'VG',
    bgColor: colors.accent[500], // Sage green
    textColor: colors.cream[50],
  },
  vegetarian: {
    label: 'V',
    bgColor: colors.secondary[500], // Teal
    textColor: colors.cream[50],
  },
  'gluten-free': {
    label: 'GF',
    bgColor: colors.sunshine[500], // Yellow
    textColor: colors.neutral[800],
  },
  'dairy-free': {
    label: 'DF',
    bgColor: colors.lavender[500], // Lavender
    textColor: colors.cream[50],
  },
  'nut-free': {
    label: 'NF',
    bgColor: colors.primary[500], // Coral
    textColor: colors.cream[50],
  },
  'freezer-friendly': {
    icon: 'snow',
    bgColor: colors.secondary[400], // Light teal/cyan
    textColor: colors.cream[50],
  },
};

const SIZE_CONFIG = {
  small: {
    container: 'w-6 h-6',
    text: 'text-[8px]',
    icon: 12,
  },
  medium: {
    container: 'w-8 h-8',
    text: 'text-[10px]',
    icon: 16,
  },
  large: {
    container: 'w-10 h-10',
    text: 'text-xs',
    icon: 20,
  },
};

export default function DietaryBadge({
  type,
  size = 'medium',
}: DietaryBadgeProps) {
  const config = DIETARY_CONFIG[type];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <View
      className={`${sizeConfig.container} rounded-full items-center justify-center`}
      style={{ backgroundColor: config.bgColor }}
    >
      {config.icon ? (
        <Ionicons
          name={config.icon as any}
          size={sizeConfig.icon}
          color={config.textColor}
        />
      ) : (
        <Text
          className={`${sizeConfig.text} font-bold`}
          style={{ color: config.textColor }}
        >
          {config.label}
        </Text>
      )}
    </View>
  );
}

// Helper component to display multiple dietary badges
interface DietaryBadgesProps {
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isNutFree?: boolean;
  isFreezerFriendly?: boolean;
  size?: 'small' | 'medium' | 'large';
  maxDisplay?: number; // Maximum number of badges to display
}

export function DietaryBadges({
  isVegan,
  isVegetarian,
  isGlutenFree,
  isDairyFree,
  isNutFree,
  isFreezerFriendly,
  size = 'medium',
  maxDisplay,
}: DietaryBadgesProps) {
  const badges: DietaryType[] = [];

  if (isVegan) badges.push('vegan');
  else if (isVegetarian) badges.push('vegetarian'); // Only show vegetarian if not vegan
  if (isGlutenFree) badges.push('gluten-free');
  if (isDairyFree) badges.push('dairy-free');
  if (isNutFree) badges.push('nut-free');
  if (isFreezerFriendly) badges.push('freezer-friendly');

  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;
  const remainingCount =
    maxDisplay && badges.length > maxDisplay ? badges.length - maxDisplay : 0;

  if (displayBadges.length === 0) return null;

  return (
    <View className='flex-row items-center gap-1'>
      {displayBadges.map((type) => (
        <DietaryBadge key={type} type={type} size={size} />
      ))}
      {remainingCount > 0 && (
        <View
          className={`${SIZE_CONFIG[size].container} rounded-full items-center justify-center bg-neutral-300`}
        >
          <Text
            className={`${SIZE_CONFIG[size].text} font-bold text-neutral-700`}
          >
            +{remainingCount}
          </Text>
        </View>
      )}
    </View>
  );
}
