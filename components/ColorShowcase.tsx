import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function ColorShowcase() {
  return (
    <ScrollView className='flex-1 bg-cream-50'>
      {/* Header Section */}
      <View className='bg-primary-500 px-6 py-8'>
        <Text className='text-2xl font-bold text-white text-center mb-2'>
          Spoonful of Love
        </Text>
        <Text className='text-primary-100 text-center text-base'>
          Toddler Recipe Color Palette
        </Text>
      </View>

      <View className='p-6 space-y-6'>
        {/* Primary Colors - Recipe Actions */}
        <View>
          <Text className='text-xl font-bold text-neutral-800 mb-4'>
            Primary Colors - Main Actions
          </Text>
          <View className='space-y-5'>
            <TouchableOpacity className='bg-primary-500 py-4 px-6 rounded-xl shadow-sm'>
              <Text className='text-white text-center font-semibold text-lg'>
                Save Recipe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className='bg-secondary-500 py-4 px-6 rounded-xl shadow-sm'>
              <Text className='text-white text-center font-semibold text-lg'>
                Browse Recipes
              </Text>
            </TouchableOpacity>
            <View className='flex-row space-x-3'>
              <View className='bg-primary-100 p-3 rounded-lg flex-1'>
                <Text className='text-primary-800 text-sm font-medium text-center'>
                  Light Coral
                </Text>
              </View>
              <View className='bg-primary-300 p-3 rounded-lg flex-1'>
                <Text className='text-primary-800 text-sm font-medium text-center'>
                  Medium Coral
                </Text>
              </View>
              <View className='bg-primary-700 p-3 rounded-lg flex-1'>
                <Text className='text-white text-sm font-medium text-center'>
                  Dark Coral
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Accent & Supporting Colors */}
        <View>
          <Text className='text-xl font-bold text-neutral-800 mb-4'>
            Natural & Healthy
          </Text>
          <View className='space-y-3'>
            <TouchableOpacity className='bg-accent-500 py-4 px-6 rounded-xl shadow-sm'>
              <Text className='text-white text-center font-semibold text-lg'>
                Organic Recipes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className='bg-sunshine-500 py-4 px-6 rounded-xl shadow-sm'>
              <Text className='text-neutral-800 text-center font-semibold text-lg'>
                Fun Activities
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className='bg-lavender-500 py-4 px-6 rounded-xl shadow-sm'>
              <Text className='text-white text-center font-semibold text-lg'>
                Premium Recipes
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipe Card Examples */}
        <View>
          <Text className='text-xl font-bold text-neutral-800 mb-4'>
            Recipe Cards
          </Text>

          {/* Breakfast Recipe Card */}
          <View className='bg-white rounded-xl p-5 mb-4 shadow-sm border border-cream-200'>
            <View className='flex-row justify-between items-start mb-3'>
              <View>
                <Text className='text-lg font-bold text-neutral-800'>
                  Banana Pancakes
                </Text>
                <Text className='text-sm text-accent-600 font-medium'>
                  🌱 Healthy • ⏱️ 15 min
                </Text>
              </View>
              <View className='bg-sunshine-100 px-3 py-1 rounded-full'>
                <Text className='text-sunshine-700 font-semibold text-xs'>
                  TODDLER FAVORITE
                </Text>
              </View>
            </View>
            <Text className='text-neutral-600 text-sm mb-4'>
              Fluffy, naturally sweet pancakes perfect for little hands and big
              appetites.
            </Text>
            <View className='flex-row space-x-3'>
              <TouchableOpacity className='bg-primary-500 py-2 px-4 rounded-lg flex-1'>
                <Text className='text-white text-center font-medium text-sm'>
                  Cook Now
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className='border border-accent-500 py-2 px-4 rounded-lg flex-1'>
                <Text className='text-accent-600 text-center font-medium text-sm'>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Snack Recipe Card */}
          <View className='bg-lavender-50 rounded-xl p-5 mb-4 border border-lavender-200'>
            <View className='flex-row justify-between items-start mb-3'>
              <View>
                <Text className='text-lg font-bold text-neutral-800'>
                  Apple Cinnamon Bites
                </Text>
                <Text className='text-sm text-lavender-600 font-medium'>
                  ✨ Premium • ⏱️ 10 min
                </Text>
              </View>
              <View className='bg-cream-200 px-3 py-1 rounded-full'>
                <Text className='text-cream-800 font-semibold text-xs'>
                  NO SUGAR
                </Text>
              </View>
            </View>
            <Text className='text-neutral-600 text-sm mb-4'>
              Naturally sweet apple bites with a hint of cinnamon. Perfect for
              tiny fingers!
            </Text>
            <TouchableOpacity className='bg-lavender-500 py-3 px-4 rounded-lg'>
              <Text className='text-white text-center font-medium'>
                Unlock Recipe
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Messages */}
        <View>
          <Text className='text-xl font-bold text-neutral-800 mb-4'>
            Status Messages
          </Text>
          <View className='space-y-3'>
            <View className='bg-success-100 border border-success-300 p-4 rounded-xl'>
              <Text className='text-success-700 font-medium'>
                ✓ Recipe saved to your favorites! Your toddler will love this
                one.
              </Text>
            </View>
            <View className='bg-warning-100 border border-warning-300 p-4 rounded-xl'>
              <Text className='text-warning-700 font-medium'>
                ⚠ This recipe contains nuts. Check for allergies before
                serving.
              </Text>
            </View>
            <View className='bg-error-100 border border-error-300 p-4 rounded-xl'>
              <Text className='text-error-700 font-medium'>
                ✕ Oops! Please fill in all required ingredients.
              </Text>
            </View>
          </View>
        </View>

        {/* Typography Showcase */}
        <View>
          <Text className='text-xl font-bold text-neutral-800 mb-4'>
            Typography Styles
          </Text>
          <View className='space-y-3'>
            <Text className='text-3xl font-bold text-primary-600'>
              Main Heading
            </Text>
            <Text className='text-2xl font-semibold text-secondary-600'>
              Section Title
            </Text>
            <Text className='text-lg font-medium text-accent-600'>
              Recipe Name
            </Text>
            <Text className='text-base text-neutral-700'>
              Body text for instructions and descriptions. Clear and easy to
              read for busy moms.
            </Text>
            <Text className='text-sm text-neutral-500'>
              Small text for details, timing, and additional notes.
            </Text>
            <Text className='text-base font-semibold text-sunshine-600'>
              Highlighted text for fun facts and tips!
            </Text>
          </View>
        </View>

        {/* Color Palette Grid */}
        <View>
          <Text className='text-xl font-bold text-neutral-800 mb-4'>
            Complete Color Palette
          </Text>

          {/* Primary Row */}
          <View className='mb-4'>
            <Text className='text-sm font-semibold text-neutral-600 mb-2'>
              Primary - Warm Coral
            </Text>
            <View className='flex-row space-x-1'>
              <View className='bg-primary-100 h-12 flex-1 rounded' />
              <View className='bg-primary-300 h-12 flex-1 rounded' />
              <View className='bg-primary-500 h-12 flex-1 rounded' />
              <View className='bg-primary-700 h-12 flex-1 rounded' />
              <View className='bg-primary-900 h-12 flex-1 rounded' />
            </View>
          </View>

          {/* Secondary Row */}
          <View className='mb-4'>
            <Text className='text-sm font-semibold text-neutral-600 mb-2'>
              Secondary - Ocean Teal
            </Text>
            <View className='flex-row space-x-1'>
              <View className='bg-secondary-100 h-12 flex-1 rounded' />
              <View className='bg-secondary-300 h-12 flex-1 rounded' />
              <View className='bg-secondary-500 h-12 flex-1 rounded' />
              <View className='bg-secondary-700 h-12 flex-1 rounded' />
              <View className='bg-secondary-900 h-12 flex-1 rounded' />
            </View>
          </View>

          {/* Accent Row */}
          <View className='mb-4'>
            <Text className='text-sm font-semibold text-neutral-600 mb-2'>
              Accent - Sage Green
            </Text>
            <View className='flex-row space-x-1'>
              <View className='bg-accent-100 h-12 flex-1 rounded' />
              <View className='bg-accent-300 h-12 flex-1 rounded' />
              <View className='bg-accent-500 h-12 flex-1 rounded' />
              <View className='bg-accent-700 h-12 flex-1 rounded' />
              <View className='bg-accent-900 h-12 flex-1 rounded' />
            </View>
          </View>

          {/* Sunshine Row */}
          <View className='mb-4'>
            <Text className='text-sm font-semibold text-neutral-600 mb-2'>
              Sunshine - Happy Yellow
            </Text>
            <View className='flex-row space-x-1'>
              <View className='bg-sunshine-100 h-12 flex-1 rounded' />
              <View className='bg-sunshine-300 h-12 flex-1 rounded' />
              <View className='bg-sunshine-500 h-12 flex-1 rounded' />
              <View className='bg-sunshine-700 h-12 flex-1 rounded' />
              <View className='bg-sunshine-900 h-12 flex-1 rounded' />
            </View>
          </View>

          {/* Lavender Row */}
          <View className='mb-4'>
            <Text className='text-sm font-semibold text-neutral-600 mb-2'>
              Lavender - Premium Purple
            </Text>
            <View className='flex-row space-x-1'>
              <View className='bg-lavender-100 h-12 flex-1 rounded' />
              <View className='bg-lavender-300 h-12 flex-1 rounded' />
              <View className='bg-lavender-500 h-12 flex-1 rounded' />
              <View className='bg-lavender-700 h-12 flex-1 rounded' />
              <View className='bg-lavender-900 h-12 flex-1 rounded' />
            </View>
          </View>

          {/* Cream Row */}
          <View className='mb-6'>
            <Text className='text-sm font-semibold text-neutral-600 mb-2'>
              Cream - Warm Neutral
            </Text>
            <View className='flex-row space-x-1'>
              <View className='bg-cream-100 h-12 flex-1 rounded' />
              <View className='bg-cream-300 h-12 flex-1 rounded' />
              <View className='bg-cream-500 h-12 flex-1 rounded' />
              <View className='bg-cream-700 h-12 flex-1 rounded' />
              <View className='bg-cream-900 h-12 flex-1 rounded' />
            </View>
          </View>
        </View>

        {/* Bottom CTA */}
        <View className='bg-gradient-to-r from-primary-500 to-secondary-500 p-6 rounded-xl'>
          <Text className='text-white text-xl font-bold text-center mb-2'>
            Ready to Start Cooking?
          </Text>
          <Text className='text-primary-100 text-center mb-4'>
            Discover hundreds of toddler-approved recipes
          </Text>
          <TouchableOpacity className='bg-white py-3 px-6 rounded-lg'>
            <Text className='text-primary-600 text-center font-bold'>
              Browse Recipes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
