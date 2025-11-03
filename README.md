# 💪 AI Fitness Coach

An AI-powered fitness assistant built with Next.js that generates personalized workout and diet plans using LLMs (Google Gemini). Includes voice narration, image generation, and PDF export features.

## 🚀 Features

- **Personalized AI Plans**: Generate custom workout and diet plans based on user details
- **Voice Narration**: Listen to your plan using ElevenLabs text-to-speech
- **Image Generation**: Click exercises/foods to see AI-generated images (Hugging Face)
- **PDF Export**: Export your complete plan as a PDF
- **Dark/Light Mode**: Beautiful theme toggle
- **Local Storage**: Save plans locally
- **Daily Motivation**: AI-generated motivational quotes
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + JavaScript
- **Styling**: Tailwind CSS v4 + Dark Mode
- **Animations**: Framer Motion
- **State Management**: React Query (@tanstack/react-query)
- **AI & APIs**:
  - **LLM**: Google Gemini API
  - **Image Gen**: Hugging Face Inference API (Stable Diffusion XL)
  - **TTS**: Web Speech API (Browser native - no API key needed!)
- **Database**: Supabase (optional, for saving plans)
- **PDF**: html2canvas + jsPDF

## 📋 Prerequisites

- Node.js (LTS version)
- pnpm (or npm/yarn)
- API Keys:
  - Gemini API Key (Google AI Studio)
  - Hugging Face API Key
  - Supabase credentials (optional)
  - **Note**: Text-to-speech uses browser's native Web Speech API - no key needed!

## 🔧 Setup Instructions

1. **Clone and Install**
   ```bash
   cd ai-fitness-coach
   pnpm install
   ```

2. **Environment Variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # LLM API
   GEMINI_API_KEY=your_gemini_api_key
   
   # Image Generation (Optional - works without API key but rate limited)
   HUGGINGFACE_API_KEY=your_huggingface_api_key  # Get from https://huggingface.co/settings/tokens
   
   # Text to Speech (Optional - not needed, using browser's Web Speech API)
   # ELEVENLABS_API_KEY=your_elevenlabs_api_key  # If you want to use ElevenLabs instead
   
   # Supabase (optional)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Get API Keys**
   - **Gemini**: https://makersuite.google.com/app/apikey (Required for plan generation)
   - **Hugging Face**: https://huggingface.co/settings/tokens (Optional - for higher rate limits on image generation)
   - **Supabase**: https://supabase.com/dashboard (optional - for saving plans)
   - **TTS**: No key needed! Uses browser's built-in Web Speech API (works in Chrome, Edge, Safari)
   - **Image Gen**: Works without API key but rate limited. Add HUGGINGFACE_API_KEY for higher limits.

4. **Run Development Server**
   ```bash
   pnpm dev
   ```

5. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup (Optional - Supabase)

If you want to save plans to a database:

1. Create a Supabase project
2. Run this SQL in the Supabase SQL editor:
   ```sql
   CREATE TABLE fitness_plans (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     plan_data JSONB NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   CREATE INDEX idx_fitness_plans_user_id ON fitness_plans(user_id);
   ```

## 📁 Project Structure

```
ai-fitness-coach/
├── app/
│   ├── api/              # API routes
│   │   ├── generate-plan/
│   │   ├── generate-image/
│   │   ├── text-to-speech/
│   │   └── motivation/
│   ├── layout.js          # Root layout
│   ├── page.js            # Main page
│   └── providers.js       # React Query provider
├── components/
│   ├── UserForm.js        # User input form
│   ├── WorkoutPlan.js     # Workout display
│   ├── DietPlan.js        # Diet display
│   ├── AITips.js          # Tips & motivation
│   ├── AudioPlayer.js     # TTS player
│   ├── ImageModal.js      # Image viewer
│   ├── ThemeToggle.js     # Dark mode toggle
│   ├── PDFExportButton.js # PDF export
│   ├── Header.js
│   ├── Footer.js
│   └── PlanCard.js
├── lib/
│   ├── gemini.js          # Gemini API client
│   ├── supabase.js        # Supabase client
│   ├── huggingface.js     # Image generation
│   ├── elevenlabs.js      # TTS client
│   └── pdf.js             # PDF export utility
├── hooks/
│   ├── useTheme.js        # Theme hook
│   ├── usePlan.js         # Plan query hook
│   └── useLocalStorage.js # Local storage hook
└── utils/
    └── prompts.js         # Prompt templates
```

## 🎯 Usage

1. **Fill the Form**: Enter your fitness details (name, age, gender, height, weight, goal, etc.)
2. **Generate Plan**: Click "Generate My Plan" - AI will create a personalized plan
3. **Listen**: Use the audio player to hear your workout or diet plan
4. **View Images**: Click on any exercise or food item to see AI-generated images
5. **Export**: Download your plan as a PDF
6. **Regenerate**: Create a new plan or regenerate the current one

## 🔒 Environment Variables

Make sure to add `.env.local` to `.gitignore` (already included).

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Docker

## 📝 Notes

- Plans are saved to localStorage by default
- Supabase integration is optional but recommended for production
- Image generation may take a few seconds on first request
- TTS generation depends on text length
- All AI features require valid API keys

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Google Gemini for AI plan generation
- Hugging Face for image generation
- ElevenLabs for text-to-speech
- Next.js team for the amazing framework

---

Built with ❤️ using Next.js and AI
