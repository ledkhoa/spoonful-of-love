import { colors } from '@/constants/colors';
import { Tabs, useRouter } from 'expo-router';
import {
  BookmarkSimpleIcon,
  ChefHatIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from 'phosphor-react-native';

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
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <ChefHatIcon size={size} weight='fill' color={color} />
            ) : (
              <ChefHatIcon size={size} weight='thin' color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MagnifyingGlassIcon size={size} weight='thin' color={color} />
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
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <BookmarkSimpleIcon size={size} weight='fill' color={color} />
            ) : (
              <BookmarkSimpleIcon size={size} weight='thin' color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <UserIcon size={size} color={color} weight='fill' />
            ) : (
              <UserIcon size={size} color={color} weight='thin' />
            ),
        }}
      />
    </Tabs>
  );
}
