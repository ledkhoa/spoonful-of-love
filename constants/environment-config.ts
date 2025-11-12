import { Platform } from 'react-native';

const getSupabaseUrl = () => {
  const envUrl =
    process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:54321';

  // If running on Android and URL is localhost, convert to 10.0.2.2
  if (Platform.OS === 'android' && envUrl.includes('localhost')) {
    return envUrl.replace('localhost', '10.0.2.2');
  }

  return envUrl;
};

export const Config = {
  SUPABASE_URL: getSupabaseUrl(),
  SUPABASE_PUBLISHABLE_KEY:
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH',
};
