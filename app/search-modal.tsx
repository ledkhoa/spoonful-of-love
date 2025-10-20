import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useSearchParamsStore } from '@/stores/searchParamsStore';

type IconFamily = 'Ionicons' | 'MaterialCommunityIcons';

interface DietaryFilter {
  id: string;
  label: string;
  iconFamily: IconFamily;
  iconName: string;
}

interface StageFilter {
  id: number;
  label: string;
  description: string;
}

const DIETARY_FILTERS: DietaryFilter[] = [
  {
    id: 'isVegan',
    label: 'Vegan',
    iconFamily: 'Ionicons',
    iconName: 'leaf-outline',
  },
  {
    id: 'isVegetarian',
    label: 'Vegetarian',
    iconFamily: 'MaterialCommunityIcons',
    iconName: 'food-apple-outline',
  },
  {
    id: 'isGlutenFree',
    label: 'Gluten Free',
    iconFamily: 'MaterialCommunityIcons',
    iconName: 'barley-off',
  },
  {
    id: 'isDairyFree',
    label: 'Dairy Free',
    iconFamily: 'MaterialCommunityIcons',
    iconName: 'cow-off',
  },
  {
    id: 'isNutFree',
    label: 'Nut Free',
    iconFamily: 'MaterialCommunityIcons',
    iconName: 'peanut-off-outline',
  },
  {
    id: 'isFreezerFriendly',
    label: 'Freezer Friendly',
    iconFamily: 'Ionicons',
    iconName: 'snow',
  },
];

const STAGE_FILTERS: StageFilter[] = [
  { id: 1, label: 'Stage 1', description: '4-6 months' },
  { id: 2, label: 'Stage 2', description: '6-9 months' },
  { id: 3, label: 'Stage 3', description: '9-12 months' },
  { id: 4, label: 'Stage 4', description: '12+ months' },
];

export default function SearchModal() {
  const router = useRouter();
  const { params } = useSearchParamsStore();

  // Initialize selectedDietary from individual boolean params
  const initialDietary = new Set<string>();
  if (params.isVegan === 'true') initialDietary.add('isVegan');
  if (params.isVegetarian === 'true') initialDietary.add('isVegetarian');
  if (params.isGlutenFree === 'true') initialDietary.add('isGlutenFree');
  if (params.isDairyFree === 'true') initialDietary.add('isDairyFree');
  if (params.isNutFree === 'true') initialDietary.add('isNutFree');
  if (params.isFreezerFriendly === 'true')
    initialDietary.add('isFreezerFriendly');

  const [searchQuery, setSearchQuery] = useState(params.q || '');
  const [selectedDietary, setSelectedDietary] =
    useState<Set<string>>(initialDietary);
  const [selectedStage, setSelectedStage] = useState<number | null>(
    params.stage ? parseInt(params.stage) : null
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    params.ageInMonths || ''
  );

  const toggleDietary = (id: string) => {
    const newSet = new Set(selectedDietary);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedDietary(newSet);
  };

  const handleStageSelect = (stageId: number) => {
    if (selectedStage === stageId) {
      setSelectedStage(null);
    } else {
      setSelectedStage(stageId);
      setSelectedMonth(''); // Clear month when stage is selected
    }
  };

  const handleMonthChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    setSelectedMonth(numericText);
    if (numericText) {
      setSelectedStage(null); // Clear stage when month is entered
    }
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    if (searchQuery.trim()) {
      queryParams.append('q', searchQuery.trim());
    }

    // Add dietary filters as individual boolean params
    selectedDietary.forEach((dietId) => {
      queryParams.append(dietId, 'true');
    });

    // Add stage or month filter (mutually exclusive)
    if (selectedStage) {
      queryParams.append('stage', selectedStage.toString());
    } else if (selectedMonth && parseInt(selectedMonth) > 0) {
      queryParams.append('ageInMonths', selectedMonth);
    }

    // Navigate back to index with query params
    const paramsObject = Object.fromEntries(queryParams);

    // Build query string manually
    const queryString = queryParams.toString();
    const path = queryString ? `/(tabs)?${queryString}` : '/(tabs)';

    // Navigate to the tabs with the query params in the URL
    router.replace(path as any);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDietary(new Set());
    setSelectedStage(null);
    setSelectedMonth('');
  };

  const hasFilters =
    searchQuery.trim() ||
    selectedDietary.size > 0 ||
    selectedStage ||
    selectedMonth;

  return (
    <SafeAreaView className='flex-1 screen-bg-color' edges={['top']}>
      {/* Header */}
      <View className='px-4 py-4 flex-row items-center screen-bg-color'>
        <TouchableOpacity onPress={() => router.back()} className='mr-3'>
          <Ionicons name='close' size={28} color={colors.neutral[800]} />
        </TouchableOpacity>

        {/* Search Bar */}
        <View className='flex-1 flex-row items-center bg-cream-50 rounded-xl px-4 py-3 shadow-sm'>
          <Ionicons name='search' size={20} color={colors.neutral[400]} />
          <TextInput
            placeholder="Find your toddler's new favorite meal"
            placeholderTextColor={colors.neutral[400]}
            className='flex-1 ml-3 text-base text-neutral-800'
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType='search'
            onSubmitEditing={handleSearch}
          />
        </View>

        {hasFilters && (
          <TouchableOpacity onPress={clearAllFilters} className='ml-3'>
            <Text className='text-primary-500 font-semibold text-base'>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className='flex-1 px-4 screen-bg-color'>
        {/* Dietary Restrictions Section */}
        <View className='mb-8 mt-4'>
          <Text className='text-neutral-800 text-lg font-bold mb-4'>
            Dietary Restrictions
          </Text>
          <View className='flex-row flex-wrap gap-2'>
            {DIETARY_FILTERS.map((filter) => {
              const isSelected = selectedDietary.has(filter.id);
              const iconColor = isSelected ? '#FFFFFF' : colors.neutral[600];
              const IconComponent =
                filter.iconFamily === 'Ionicons'
                  ? Ionicons
                  : MaterialCommunityIcons;

              return (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => toggleDietary(filter.id)}
                  className={`flex-row items-center px-4 py-2.5 rounded-full ${
                    isSelected ? 'bg-primary-500' : 'bg-cream-50'
                  }`}
                >
                  <IconComponent
                    name={filter.iconName as any}
                    size={16}
                    color={iconColor}
                  />
                  <Text
                    className={`ml-2 text-sm font-medium ${
                      isSelected ? 'text-cream-50' : 'text-neutral-600'
                    }`}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Stage Section */}
        <View className='mb-8'>
          <Text className='text-neutral-800 text-lg font-bold mb-4'>Stage</Text>
          <View className='flex-row flex-wrap gap-2'>
            {STAGE_FILTERS.map((stage) => (
              <TouchableOpacity
                key={stage.id}
                onPress={() => handleStageSelect(stage.id)}
                className={`px-4 py-2.5 rounded-full ${
                  selectedStage === stage.id ? 'bg-primary-500' : 'bg-cream-50'
                }`}
              >
                <View>
                  <Text
                    className={`text-sm font-medium ${
                      selectedStage === stage.id
                        ? 'text-cream-50'
                        : 'text-neutral-600'
                    }`}
                  >
                    {stage.label}
                  </Text>
                  <Text
                    className={`text-xs ${
                      selectedStage === stage.id
                        ? 'text-cream-50 opacity-80'
                        : 'text-neutral-400'
                    }`}
                  >
                    {stage.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Specific Month Section */}
        <View className='mb-8'>
          <Text className='text-neutral-800 text-lg font-bold mb-4'>
            Or Specific Age (months)
          </Text>
          <View className='flex-row items-center bg-cream-50 rounded-xl px-4 py-3 shadow-sm'>
            <TextInput
              placeholder='e.g., 8'
              placeholderTextColor={colors.neutral[400]}
              className='flex-1 text-base text-neutral-800'
              value={selectedMonth}
              onChangeText={handleMonthChange}
              keyboardType='number-pad'
              maxLength={3}
            />
            {selectedMonth && (
              <TouchableOpacity onPress={() => setSelectedMonth('')}>
                <Ionicons
                  name='close-circle'
                  size={20}
                  color={colors.neutral[400]}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          onPress={handleSearch}
          className='bg-primary-500 rounded-xl py-4 items-center mb-8 shadow-sm'
        >
          <Text className='text-cream-50 text-base font-bold'>Search</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
