# 🔥 Firebase Authentication Setup

This guide will help you set up Firebase Authentication for the AI Fitness Coach app.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter your project name
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get Started**
3. Enable the following sign-in methods:
   - **Email/Password**: Enable this for email/password authentication
   - **Google**: Enable this for Google sign-in (optional but recommended)

### Enable Email/Password:
- Click on "Email/Password"
- Toggle "Enable" to ON
- Click "Save"

### Enable Google Sign-In:
- Click on "Google"
- Toggle "Enable" to ON
- Enter your project support email
- Click "Save"

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. If you haven't added a web app yet:
   - Click the **</>** (Web) icon
   - Register your app with a nickname (e.g., "AI Fitness Coach Web")
   - Click "Register app"
5. Copy your Firebase configuration object (or individual values)

## Step 4: Add Environment Variables

Create or update your `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Existing API keys (keep these if you already have them)
GEMINI_API_KEY=your_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

## Step 5: Configure Authorized Domains (For Production)

When deploying to production:

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your production domain (e.g., `yourdomain.com`)
3. Firebase automatically includes:
   - `localhost` (for development)
   - Your Firebase project domain

## 🔒 Security Rules

Firebase Authentication handles security automatically. Make sure:
- ✅ Environment variables are in `.env.local` (not committed to git)
- ✅ `.env.local` is in your `.gitignore`
- ✅ Never expose your Firebase config in client-side code (we're using env vars correctly)

## 🧪 Testing Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
   - You should be redirected to `/login` if not authenticated

3. Test sign-up:
   - Click "Sign up" or toggle to sign up mode
   - Enter email and password (min 6 characters)
   - Click "Sign Up"
   - You should be redirected to the main app

4. Test sign-in:
   - Log out
   - Enter your credentials
   - Click "Sign In"

5. Test Google sign-in:
   - Click "Continue with Google"
   - Select your Google account
   - You should be redirected to the main app

## 📝 Notes

- **Password Requirements**: Minimum 6 characters (Firebase default)
- **Email Verification**: Not required by default, but you can enable it in Firebase Console
- **User Management**: View and manage users in Firebase Console → Authentication → Users
- **Session Persistence**: Users stay logged in across browser sessions (Firebase default)

## 🚀 Production Deployment

When deploying:

1. Add environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Add your production domain to Firebase authorized domains
3. Test authentication flow in production

## 🔧 Troubleshooting

### "Firebase: Error (auth/domain-not-authorized)"
- Add your domain to Firebase authorized domains

### "Firebase: Error (auth/invalid-api-key)"
- Check that your API key is correct in `.env.local`
- Make sure variable names start with `NEXT_PUBLIC_`

### "Firebase: Error (auth/api-key-not-valid)"
- Regenerate your API key in Firebase Console → Project Settings

### Environment variables not loading
- Restart your development server after adding/changing env vars
- Ensure variables start with `NEXT_PUBLIC_` for client-side access

