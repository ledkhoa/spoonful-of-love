import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/constants/colors';
import { useState } from 'react';

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated, signOut, isSigningOut } = useAuth();
  const [isMetric, setIsMetric] = useState(false); // false = Imperial, true = Metric

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/(tabs)');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
            console.error('Sign out error:', error);
          }
        },
      },
    ]);
  };

  const handleSignIn = () => {
    router.push({
      pathname: '/auth',
      params: { mode: 'signin' },
    });
  };

  const handleSignUp = () => {
    router.push({
      pathname: '/auth',
      params: { mode: 'signup' },
    });
  };

  // Unauthenticated state
  if (!isAuthenticated) {
    return (
      <SafeAreaView className='flex-1 screen-bg-color'>
        <View className='flex-1 p-6'>
          {/* Icon and Message */}
          <View className='flex-1 items-center justify-center'>
            <View className='mb-6'>
              <Image
                source={require('@/assets/images/logo.png')}
                style={{ width: 240, height: 240 }}
                resizeMode='contain'
              />
            </View>
            <Text className='text-xl font-semibold text-neutral-800 mb-2 text-center'>
              Sign in to access your profile
            </Text>
            <Text className='text-base text-neutral-600 text-center px-4 mb-8'>
              Save recipes, track your favorites, and personalize your
              experience
            </Text>

            {/* Sign In Button */}
            <TouchableOpacity
              className='bg-primary-500 py-4 px-8 rounded-xl active:opacity-80 mb-3 w-full max-w-xs'
              onPress={handleSignIn}
            >
              <Text className='text-cream-50 text-center text-lg font-semibold'>
                Sign In
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
              className='bg-cream-50 border-2 border-primary-500 py-4 px-8 rounded-xl active:opacity-80 w-full max-w-xs'
              onPress={handleSignUp}
            >
              <Text className='text-primary-500 text-center text-lg font-semibold'>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Authenticated state
  return (
    <SafeAreaView className='flex-1 bg-primary-500' edges={['top']}>
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Header with Profile Info */}
        <View className='bg-primary-500 px-6 pt-6 pb-12 rounded-b-3xl'>
          {/* Profile Avatar and Info */}
          <View className='items-center'>
            {/* Avatar Circle */}
            <View className='bg-cream-50 rounded-full p-1 mb-4'>
              <View className='bg-primary-100 rounded-full w-32 h-32 items-center justify-center'>
                <Ionicons name='person' size={64} color={colors.primary[500]} />
              </View>
            </View>

            {/* User Info */}
            {user && (
              <View className='items-center'>
                <Text className='text-xl font-bold text-neutral-800 mb-1'>
                  {user.user_metadata?.first_name}{' '}
                  {user.user_metadata?.last_name}
                </Text>
                <Text className='text-base text-neutral-600'>{user.email}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Settings Options */}
        <View className='p-6 mt-6 screen-bg-color'>
          {/* Measurement Units */}
          <View className='bg-white rounded-2xl p-4 mb-3 shadow-sm shadow-neutral-400/30'>
            <View className='flex-row items-center mb-2'>
              <View className='bg-sunshine-100 rounded-full w-12 h-12 items-center justify-center mr-4'>
                <Ionicons
                  name='scale-outline'
                  size={24}
                  color={colors.sunshine[500]}
                />
              </View>
              <View className='flex-1'>
                <Text className='text-base font-semibold text-neutral-800 mb-1'>
                  Measurement Units
                </Text>
                <Text className='text-sm text-neutral-600'>
                  {isMetric ? 'Metric' : 'Imperial'}
                </Text>
              </View>
              <View className='flex-row items-center gap-2'>
                <Text className='text-sm text-neutral-600'>Imperial</Text>
                <Switch
                  value={isMetric}
                  onValueChange={setIsMetric}
                  trackColor={{
                    false: colors.accent[300],
                    true: colors.primary[300],
                  }}
                  thumbColor={
                    isMetric ? colors.primary[500] : colors.accent[500]
                  }
                  ios_backgroundColor={colors.accent[300]}
                />
                <Text className='text-sm text-neutral-600'>Metric</Text>
              </View>
            </View>
            <Text className='text-xs text-neutral-500 mt-2 pl-16'>
              Some recipes may use descriptive measurements (e.g., "1 whole
              apple") regardless of unit preference.
            </Text>
          </View>

          {/* Notification Preferences */}
          <TouchableOpacity
            className='bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm shadow-neutral-400/30'
            activeOpacity={0.7}
          >
            <View className='bg-primary-100 rounded-full w-12 h-12 items-center justify-center mr-4'>
              <Ionicons
                name='notifications-outline'
                size={24}
                color={colors.primary[500]}
              />
            </View>
            <View className='flex-1'>
              <Text className='text-base font-semibold text-neutral-800'>
                Notification Preferences
              </Text>
            </View>
            <Ionicons
              name='chevron-forward'
              size={20}
              color={colors.neutral[400]}
            />
          </TouchableOpacity>

          {/* Privacy Settings */}
          <TouchableOpacity
            className='bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm shadow-neutral-400/30'
            activeOpacity={0.7}
          >
            <View className='bg-secondary-100 rounded-full w-12 h-12 items-center justify-center mr-4'>
              <Ionicons
                name='lock-closed-outline'
                size={24}
                color={colors.secondary[500]}
              />
            </View>
            <View className='flex-1'>
              <Text className='text-base font-semibold text-neutral-800'>
                Privacy Settings
              </Text>
            </View>
            <Ionicons
              name='chevron-forward'
              size={20}
              color={colors.neutral[400]}
            />
          </TouchableOpacity>

          {/* About Us */}
          <TouchableOpacity
            className='bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm shadow-neutral-400/30'
            activeOpacity={0.7}
          >
            <View className='bg-lavender-100 rounded-full w-12 h-12 items-center justify-center mr-4'>
              <Ionicons
                name='information-circle-outline'
                size={24}
                color={colors.lavender[500]}
              />
            </View>
            <View className='flex-1'>
              <Text className='text-base font-semibold text-neutral-800'>
                About Us
              </Text>
            </View>
            <Ionicons
              name='chevron-forward'
              size={20}
              color={colors.neutral[400]}
            />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            className='bg-white rounded-2xl p-4 mb-6 flex-row items-center shadow-sm shadow-neutral-400/30'
            activeOpacity={0.7}
          >
            <View className='bg-accent-100 rounded-full w-12 h-12 items-center justify-center mr-4'>
              <Ionicons
                name='help-circle-outline'
                size={24}
                color={colors.accent[500]}
              />
            </View>
            <View className='flex-1'>
              <Text className='text-base font-semibold text-neutral-800'>
                Help & Support
              </Text>
            </View>
            <Ionicons
              name='chevron-forward'
              size={20}
              color={colors.neutral[400]}
            />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            className='bg-primary-500 rounded-2xl p-4 mb-8 flex-row items-center justify-center shadow-sm shadow-neutral-400/30'
            onPress={handleSignOut}
            disabled={isSigningOut}
            activeOpacity={0.7}
          >
            <Ionicons
              name='log-out-outline'
              size={24}
              color={colors.cream[50]}
              style={{ marginRight: 8 }}
            />
            <Text className='text-base font-semibold text-cream-50'>
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
