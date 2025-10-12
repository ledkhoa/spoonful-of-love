import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  AntDesign,
} from '@expo/vector-icons';

export default function IconExamples() {
  return (
    <ScrollView className='p-6 bg-cream-50'>
      <Text className='text-2xl font-bold text-primary-600 mb-6'>
        Icon Examples
      </Text>

      {/* Tab Bar Style Icons */}
      <View className='mb-6'>
        <Text className='text-lg font-semibold text-neutral-800 mb-3'>
          Tab Bar Icons
        </Text>
        <View className='flex-row justify-around bg-white p-4 rounded-xl'>
          <View className='items-center'>
            <MaterialIcons name='restaurant-menu' size={24} color='#ed7d5b' />
            <Text className='text-xs text-neutral-600 mt-1'>Recipes</Text>
          </View>
          <View className='items-center'>
            <Ionicons name='search' size={24} color='#14b8a6' />
            <Text className='text-xs text-neutral-600 mt-1'>Search</Text>
          </View>
          <View className='items-center'>
            <Ionicons name='heart' size={24} color='#ffcd2b' />
            <Text className='text-xs text-neutral-600 mt-1'>Saved</Text>
          </View>
          <View className='items-center'>
            <Ionicons name='person' size={24} color='#6ea575' />
            <Text className='text-xs text-neutral-600 mt-1'>Profile</Text>
          </View>
        </View>
      </View>

      {/* Recipe Action Icons */}
      <View className='mb-6'>
        <Text className='text-lg font-semibold text-neutral-800 mb-3'>
          Recipe Actions
        </Text>
        <View className='space-y-3'>
          <TouchableOpacity className='bg-primary-500 flex-row items-center justify-center py-3 px-6 rounded-xl'>
            <MaterialIcons name='play-arrow' size={20} color='white' />
            <Text className='text-white font-semibold ml-2'>Start Cooking</Text>
          </TouchableOpacity>

          <TouchableOpacity className='bg-secondary-500 flex-row items-center justify-center py-3 px-6 rounded-xl'>
            <Ionicons name='bookmark-outline' size={18} color='white' />
            <Text className='text-white font-semibold ml-2'>Save Recipe</Text>
          </TouchableOpacity>

          <TouchableOpacity className='bg-accent-500 flex-row items-center justify-center py-3 px-6 rounded-xl'>
            <MaterialIcons name='share' size={18} color='white' />
            <Text className='text-white font-semibold ml-2'>Share Recipe</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Food & Kitchen Icons */}
      <View className='mb-6'>
        <Text className='text-lg font-semibold text-neutral-800 mb-3'>
          Food & Kitchen Icons
        </Text>
        <View className='bg-white p-4 rounded-xl'>
          <View className='flex-row flex-wrap justify-around'>
            <View className='items-center m-2'>
              <MaterialIcons name='restaurant' size={32} color='#ed7d5b' />
              <Text className='text-xs text-neutral-600 mt-1'>Restaurant</Text>
            </View>
            <View className='items-center m-2'>
              <MaterialIcons name='local-dining' size={32} color='#14b8a6' />
              <Text className='text-xs text-neutral-600 mt-1'>Dining</Text>
            </View>
            <View className='items-center m-2'>
              <MaterialIcons name='cake' size={32} color='#ffcd2b' />
              <Text className='text-xs text-neutral-600 mt-1'>Dessert</Text>
            </View>
            <View className='items-center m-2'>
              <FontAwesome5 name='apple-alt' size={28} color='#6ea575' />
              <Text className='text-xs text-neutral-600 mt-1'>Healthy</Text>
            </View>
            <View className='items-center m-2'>
              <MaterialIcons name='kitchen' size={32} color='#b492f0' />
              <Text className='text-xs text-neutral-600 mt-1'>Kitchen</Text>
            </View>
            <View className='items-center m-2'>
              <MaterialIcons name='timer' size={32} color='#e4c078' />
              <Text className='text-xs text-neutral-600 mt-1'>Timer</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Status Icons */}
      <View className='mb-6'>
        <Text className='text-lg font-semibold text-neutral-800 mb-3'>
          Status & Feedback
        </Text>
        <View className='space-y-3'>
          <View className='bg-success-100 border border-success-300 p-4 rounded-xl flex-row items-center'>
            <Ionicons name='checkmark-circle' size={20} color='#34c249' />
            <Text className='text-success-700 font-medium ml-3'>
              Recipe saved successfully!
            </Text>
          </View>

          <View className='bg-warning-100 border border-warning-300 p-4 rounded-xl flex-row items-center'>
            <Ionicons name='warning' size={20} color='#f59e0b' />
            <Text className='text-warning-700 font-medium ml-3'>
              This recipe contains nuts
            </Text>
          </View>

          <View className='bg-error-100 border border-error-300 p-4 rounded-xl flex-row items-center'>
            <Ionicons name='close-circle' size={20} color='#e8664c' />
            <Text className='text-error-700 font-medium ml-3'>
              Failed to load recipe
            </Text>
          </View>
        </View>
      </View>

      {/* Rating & Features */}
      <View className='mb-6'>
        <Text className='text-lg font-semibold text-neutral-800 mb-3'>
          Recipe Features
        </Text>
        <View className='bg-white p-4 rounded-xl'>
          <View className='flex-row items-center justify-between mb-3'>
            <Text className='text-base font-medium text-neutral-800'>
              Banana Pancakes
            </Text>
            <View className='flex-row'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= 4 ? 'star' : 'star-outline'}
                  size={16}
                  color='#ffcd2b'
                />
              ))}
            </View>
          </View>

          <View className='flex-row space-x-4'>
            <View className='flex-row items-center'>
              <MaterialIcons name='timer' size={16} color='#6ea575' />
              <Text className='text-sm text-neutral-600 ml-1'>15 min</Text>
            </View>
            <View className='flex-row items-center'>
              <MaterialIcons name='people' size={16} color='#14b8a6' />
              <Text className='text-sm text-neutral-600 ml-1'>4 servings</Text>
            </View>
            <View className='flex-row items-center'>
              <FontAwesome5 name='leaf' size={14} color='#6ea575' />
              <Text className='text-sm text-neutral-600 ml-1'>Healthy</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
