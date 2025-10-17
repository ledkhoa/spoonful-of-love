<div align="center">
  <img src="./assets/images/logo.png" alt="Spoonful of Love Logo" width="120">
</div>

# Spoonful of Love

A mobile app for discovering and saving toddler-friendly recipes. Built for busy parents who want to provide nutritious and age-appropriate meals for their little ones.

## 📱 About

Spoonful of Love is a React Native mobile application that helps parents find perfect recipes for their toddlers. The app features:

- **Age-appropriate recipes** with clear age range indicators (6-12 months, 12-18 months, etc.)
- **Save functionality** to bookmark favorite recipes
- **Intuitive search** to find recipes quickly
- **Rating system** to help discover the best recipes

## 🛠 Technologies

This app is built with modern mobile development technologies:

- **[Expo](https://expo.dev)** - Development platform and build toolchain
- **[React Native](https://reactnative.dev)** - Cross-platform mobile framework
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and state management
- **[Supabase](https://supabase.com)** - Backend-as-a-Service for database and authentication
- **[Expo Vector Icons](https://docs.expo.dev/guides/icons/)** - Beautiful iconography
- **[NativeWind](https://www.nativewind.dev)** - Tailwind CSS for React Native
- **TypeScript** - Type-safe development

## 🚀 Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm start
   ```

3. **Run on your device**

   Use the Expo Go app to scan the QR code, or run on simulators:
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal

## 🗄️ Local Database Setup

To run Supabase locally for development:

1. **Login to Supabase CLI**

   ```bash
   npm run supabase:login
   ```

2. **Link to your project**

   ```bash
   npm run supabase:link $PROJECT_ID
   ```

3. **Start local Supabase stack**

   ```bash
   npm run supabase:start
   ```

4. **Reset database with migrations**

   ```bash
   npm run supabase:reset
   ```

This will start a local Supabase instance at `http://localhost:54323/project/default` with PostgreSQL, Auth, and API services running on your machine.

## 🔄 Database Migrations

To manage database schema changes:

1. **Create a new migration**

   ```bash
   npm run migration:new <migration_name>
   ```

   Example:

   ```bash
   npm run migration:new add_user_preferences
   ```

2. **Apply migrations**

   ```bash
   npm run migration:up
   ```

   This applies any pending migrations to your database.

**Migration Workflow:**

- Edit the generated SQL file in `supabase/migrations/`
- Test locally with `npm run supabase:reset`
