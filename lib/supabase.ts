import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://icbsxipnzmxxolkrtdmn.supabase.co";
const supabasePublishableKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljYnN4aXBuem14eG9sa3J0ZG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDk5NjAsImV4cCI6MjA3NTY4NTk2MH0.JCGNtbXmZYnDNwzwoTBT04xZBHCP4dJAQav5sDjbpOg";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
