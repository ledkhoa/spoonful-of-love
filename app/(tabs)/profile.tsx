import { Text, View, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/constants/colors';
import { UserCircleIcon, SignOutIcon } from 'phosphor-react-native';

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated, signOut, isSigningOut } = useAuth();

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
      <View className='flex-1'>
        {/* Header with Profile Info */}
        <View className='bg-primary-500 px-6 pt-6 pb-12 rounded-b-3xl'>
          {/* Profile Avatar and Info */}
          <View className='items-center'>
            {/* Avatar Circle */}
            <View className='bg-cream-50 rounded-full p-1 mb-4'>
              <View className='bg-primary-100 rounded-full w-32 h-32 items-center justify-center'>
                <UserCircleIcon
                  size={64}
                  weight='thin'
                  color={colors.primary[500]}
                />
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
        <View className='p-6 mt-6 screen-bg-color flex-1'>
          {/* Spacer to push Sign Out button to bottom */}
          <View className='flex-1' />

          {/* Logout Button */}
          <TouchableOpacity
            className='bg-primary-500 rounded-2xl p-4 mb-8 flex-row items-center justify-center shadow-sm shadow-neutral-400/30'
            onPress={handleSignOut}
            disabled={isSigningOut}
            activeOpacity={0.7}
          >
            <SignOutIcon
              size={24}
              weight='thin'
              color={colors.cream[50]}
              style={{ marginRight: 8 }}
            />
            <Text className='text-base font-semibold text-cream-50'>
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
