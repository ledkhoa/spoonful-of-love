import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService, SignUpData, SignInData } from '@/services/AuthService';
import { TEN_MINUTES } from '@/constants/cache';

export const authQueryKeys = {
  session: ['auth', 'session'] as const,
  user: ['auth', 'user'] as const,
  all: ['auth'] as const,
};

/**
 * Main auth hook that provides auth state and mutations
 * @returns Auth state and mutation methods
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const sessionQuery = useGetAuthSession();
  const userQuery = useGetAuthUser();

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: (data: SignUpData) => AuthService.signUp(data),
    onSuccess: () => {
      // Invalidate auth queries to refetch
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
    },
  });

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: (data: SignInData) => AuthService.signIn(data),
    onSuccess: () => {
      // Invalidate auth queries to refetch
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
    },
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: () => AuthService.signOut(),
    onSuccess: () => {
      // Clear auth queries from cache
      queryClient.setQueryData(authQueryKeys.session, null);
      queryClient.setQueryData(authQueryKeys.user, null);
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
    },
  });

  return {
    // Auth state
    user: userQuery.data ?? null,
    session: sessionQuery.data ?? null,
    isAuthenticated: !!(sessionQuery.data && userQuery.data),
    isLoading: sessionQuery.isLoading || userQuery.isLoading,

    // Mutations
    signUp: signUpMutation.mutateAsync,
    signIn: signInMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,

    // Mutation states
    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,

    // Errors
    signUpError: signUpMutation.error,
    signInError: signInMutation.error,
    signOutError: signOutMutation.error,

    // Refresh method
    refreshAuth: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
    },
  };
};

/**
 * Hook to get current auth session
 * @returns TanStack Query result with session data
 */
const useGetAuthSession = () => {
  return useQuery({
    queryKey: authQueryKeys.session,
    queryFn: () => AuthService.getSession(),
    staleTime: TEN_MINUTES,
    gcTime: TEN_MINUTES,
    retry: 1,
  });
};

/**
 * Hook to get current user
 * @returns TanStack Query result with user data
 */
const useGetAuthUser = () => {
  return useQuery({
    queryKey: authQueryKeys.user,
    queryFn: () => AuthService.getCurrentUser(),
    staleTime: TEN_MINUTES,
    gcTime: TEN_MINUTES,
    retry: 1,
  });
};
