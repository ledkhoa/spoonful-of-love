import { supabase } from '@/lib/supabase';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp({ email, password, firstName, lastName }: SignUpData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      throw error;
    }

    // Insert user record in the users table
    if (data.user) {
      const { error: insertError } = await supabase.from('users').insert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
      });

      if (insertError) {
        // Log the error but don't throw - the auth user was created successfully
        console.error('Error creating user profile:', insertError.message);
      }
    }

    return data;
  }

  /**
   * Sign in an existing user
   */
  static async signIn({ email, password }: SignInData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error.message);
    }

    return data;
  }

  /**
   * Sign out the current user
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error.message);
    }
  }

  /**
   * Get the current user session
   */
  static async getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error.message);
    }

    return data.session;
  }

  /**
   * Get the current user
   */
  static async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting current user:', error.message);
    }

    return data.user;
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return !!session;
  }
}
