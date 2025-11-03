# 🤗 Hugging Face Image Generation Setup

## How It Works

The image generation feature uses Hugging Face's Inference API with **fallback support**:

### ✅ Works WITHOUT API Key (Free Public Access)
- Uses Hugging Face's public API
- **Rate limited** (~10-20 requests/hour)
- May experience cold starts (models need to load, ~20-30 seconds first time)
- Automatically falls back to alternative models if one fails

### 🚀 Works WITH API Key (Recommended)
- Higher rate limits
- Faster response times
- Priority access to models
- More reliable

## Getting Your API Key (Optional)

1. **Sign up / Login** at https://huggingface.co/
2. **Go to Settings** → Click your profile → Settings
3. **Access Tokens** → Click "New token"
4. **Name it** (e.g., "fitness-app") → Select "Read" role → Create
5. **Copy the token** → Add to `.env.local`:
   ```env
   HUGGINGFACE_API_KEY=your_token_here
   ```

## Features

- ✅ **Multiple Model Fallback**: Tries 3 different Stable Diffusion models
- ✅ **Auto-Retry**: Handles model loading states (503 errors)
- ✅ **Smart Error Handling**: Shows helpful messages for rate limits, loading states, etc.
- ✅ **Works Without Key**: Free public access available

## Troubleshooting

### "Rate limit exceeded"
- **Without API key**: Wait 1-2 hours or add API key
- **With API key**: You've hit your tier limit, wait a bit

### "Model is loading"
- First request can take 20-30 seconds
- The system automatically waits and retries
- Be patient, it will work!

### "Failed to generate image"
- Check your internet connection
- Try again in a few moments
- If persistent, check browser console for details

## Models Used (in order)
1. `stabilityai/stable-diffusion-xl-base-1.0` (Best quality)
2. `runwayml/stable-diffusion-v1-5` (Fallback)
3. `stabilityai/stable-diffusion-2-1` (Last resort)

All models are automatically tried if one fails!

