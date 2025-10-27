import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (mode === 'signup') {
      setIsSignUp(true);
    } else if (mode === 'signin') {
      setIsSignUp(false);
    }
  }, [mode]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await signIn({
        email: email.trim(),
        password: password,
      });

      // Successfully signed in - go back twice to close auth screen and sign-in prompt
      router.back();
      // Use setTimeout to ensure the first back() completes before the second
      setTimeout(() => router.back(), 100);
    } catch (error) {
      Alert.alert(
        'Sign In Failed',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signUp({
        email: email.trim(),
        password: password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      Alert.alert(
        'Success',
        'Account created successfully! Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Go back twice to close auth screen and sign-in prompt
              router.back();
              setTimeout(() => router.back(), 100);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Sign Up Failed',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
  };

  return (
    <SafeAreaView className='flex-1 bg-primary-500' edges={['top']}>
      <View className='flex-1'>
        <ScrollView
          className='flex-1'
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className='bg-primary-500 px-4 py-3 flex-row items-center justify-center'>
            <TouchableOpacity
              onPress={() => router.back()}
              className='absolute left-4'
              activeOpacity={0.7}
            >
              <Ionicons
                name='arrow-back'
                size={24}
                color={colors.neutral[800]}
              />
            </TouchableOpacity>

            <Text className='text-2xl font-bold text-neutral-800 text-center'>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
          </View>

          {/* Form */}
          <View className='flex-1 bg-cream-50 px-6 pt-8'>
            {/* Sign Up Fields */}
            {isSignUp && (
              <>
                <View className='mb-4'>
                  <Text className='text-sm font-semibold text-neutral-700 mb-2'>
                    First Name
                  </Text>
                  <TextInput
                    className='bg-white border border-neutral-200 rounded-xl px-4 py-3 text-base'
                    placeholder='Enter your first name'
                    placeholderTextColor={colors.neutral[400]}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize='words'
                    editable={!loading}
                  />
                </View>

                <View className='mb-4'>
                  <Text className='text-sm font-semibold text-neutral-700 mb-2'>
                    Last Name
                  </Text>
                  <TextInput
                    className='bg-white border border-neutral-200 rounded-xl px-4 py-3 text-base'
                    placeholder='Enter your last name'
                    placeholderTextColor={colors.neutral[400]}
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize='words'
                    editable={!loading}
                  />
                </View>
              </>
            )}

            {/* Email */}
            <View className='mb-4'>
              <Text className='text-sm font-semibold text-neutral-700 mb-2'>
                Email
              </Text>
              <TextInput
                className='bg-white border border-neutral-200 rounded-xl px-4 py-3 text-base'
                placeholder='Enter your email'
                placeholderTextColor={colors.neutral[400]}
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Password */}
            <View className='mb-4'>
              <Text className='text-sm font-semibold text-neutral-700 mb-2'>
                Password
              </Text>
              <View className='relative'>
                <TextInput
                  className='bg-white border border-neutral-200 rounded-xl px-4 py-3 pr-12 text-base'
                  placeholder='Enter your password'
                  placeholderTextColor={colors.neutral[400]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize='none'
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  className='absolute right-4 top-3'
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={colors.neutral[400]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <View className='mb-6'>
                <Text className='text-sm font-semibold text-neutral-700 mb-2'>
                  Confirm Password
                </Text>
                <View className='relative'>
                  <TextInput
                    className='bg-white border border-neutral-200 rounded-xl px-4 py-3 pr-12 text-base'
                    placeholder='Confirm your password'
                    placeholderTextColor={colors.neutral[400]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize='none'
                    autoCorrect={false}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    className='absolute right-4 top-3'
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color={colors.neutral[400]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              className='bg-primary-500 rounded-xl py-4 items-center mb-4'
              onPress={isSignUp ? handleSignUp : handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.cream[50]} />
              ) : (
                <Text className='text-cream-50 font-semibold text-base'>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Mode */}
            <View className='flex-row justify-center items-center'>
              <Text className='text-neutral-600 text-sm'>
                {isSignUp
                  ? 'Already have an account? '
                  : "Don't have an account? "}
              </Text>
              <TouchableOpacity onPress={toggleMode} activeOpacity={0.7}>
                <Text className='text-primary-500 font-semibold text-sm'>
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
