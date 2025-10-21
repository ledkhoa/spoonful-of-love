import { colors } from '@/constants/colors';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const router = useRouter();

  const handleSearchPress = () => {
    router.push('/search-modal');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarStyle: {
          backgroundColor: colors.cream[50],
          borderTopWidth: 1,
          borderTopColor: colors.neutral[300],
        },
        animation: 'shift',
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Recipes',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='restaurant-menu' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='search' size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleSearchPress();
          },
        }}
      />
      <Tabs.Screen
        name='saved'
        options={{
          title: 'Saved',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='bookmark-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='person' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
