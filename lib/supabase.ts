import { Config } from '@/constants/environment-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

console.log(Config.SUPABASE_URL, Config.SUPABASE_PUBLISHABLE_KEY);

export const supabase = createClient(
  Config.SUPABASE_URL,
  Config.SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
