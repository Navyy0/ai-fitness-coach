export async function generateImage(prompt, type = "exercise") {
  try {
    const huggingFacePrompt = type === "exercise"
      ? `realistic gym exercise, ${prompt}, professional photography, well-lit, high quality, detailed, 4k`
      : `delicious ${prompt}, food photography, professional lighting, high quality, appetizing, detailed, 4k`;

    // Get API key if available, otherwise use public access (rate limited)
    const apiKey = process.env.HUGGINGFACE_API_KEY?.trim();
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
      console.log("Using Hugging Face API key");
    } else {
      console.log("Using Hugging Face public access (rate limited)");
    }

    // Try Stable Diffusion XL first (best quality), fallback to other models if needed
    const models = [
      "stabilityai/stable-diffusion-xl-base-1.0",
      "runwayml/stable-diffusion-v1-5",
      "stabilityai/stable-diffusion-2-1",
    ];

    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            headers,
            method: "POST",
            body: JSON.stringify({ 
              inputs: huggingFacePrompt,
              parameters: {
                num_inference_steps: apiKey ? 25 : 20, // Fewer steps for free tier
                guidance_scale: 7.5,
              }
            }),
          }
        );

        // If model is loading, wait and retry
        if (response.status === 503) {
          const errorData = await response.json().catch(() => ({}));
          const estimatedTime = errorData.estimated_time || 20;
          console.log(`Model ${model} is loading, waiting ${estimatedTime} seconds...`);
          // Wait for model to load
          await new Promise(resolve => setTimeout(resolve, estimatedTime * 1000));
          // Retry once
          const retryResponse = await fetch(
            `https://api-inference.huggingface.co/models/${model}`,
            {
              headers,
              method: "POST",
              body: JSON.stringify({ 
                inputs: huggingFacePrompt,
                parameters: {
                  num_inference_steps: apiKey ? 25 : 20,
                  guidance_scale: 7.5,
                }
              }),
            }
          );
          
          if (!retryResponse.ok) {
            throw new Error(`Model still loading after ${estimatedTime}s`);
          }
          
          const imageBuffer = await retryResponse.arrayBuffer();
          const base64 = Buffer.from(imageBuffer).toString('base64');
          return `data:image/png;base64,${base64}`;
        }

        if (!response.ok) {
          // If 401/403, it's auth issue
          if (response.status === 401 || response.status === 403) {
            if (apiKey) {
              throw new Error(`Invalid HUGGINGFACE_API_KEY. Please check your API key in .env.local`);
            }
            // Without API key, try next model
            console.log(`Auth issue with ${model}, trying next model...`);
            continue;
          }
          
          // If rate limit, try next model
          if (response.status === 429) {
            console.log(`Rate limit on ${model}, trying next model...`);
            continue;
          }
          
          const errorText = await response.text();
          let errorMessage = `Image generation failed: ${response.status}`;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            errorMessage += ` - ${errorText}`;
          }
          
          // If not the last model, try next one
          if (model !== models[models.length - 1]) {
            console.log(`Error with ${model}: ${errorMessage}, trying next model...`);
            continue;
          }
          
          throw new Error(errorMessage);
        }

        // Check if response is JSON error
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const jsonData = await response.json();
          if (jsonData.error) {
            throw new Error(jsonData.error);
          }
        }

        const imageBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(imageBuffer).toString('base64');
        console.log(`Successfully generated image using ${model}`);
        return `data:image/png;base64,${base64}`;
      } catch (error) {
        // If last model, throw error; otherwise try next
        if (model === models[models.length - 1]) {
          throw error;
        }
        console.log(`Error with model ${model}, trying next...`, error.message);
      }
    }
    
    throw new Error("All image generation models failed");
  } catch (error) {
    console.error("HuggingFace image generation error:", error);
    
    // Provide helpful error messages
    if (error.message.includes("Invalid HUGGINGFACE_API_KEY")) {
      throw error;
    }
    
    if (error.message.includes("rate limit") || error.message.includes("429")) {
      throw new Error("Rate limit exceeded. Please try again later or add your HUGGINGFACE_API_KEY in .env.local for higher limits.");
    }
    
    throw new Error(error.message || "Failed to generate image. Please try again or check your Hugging Face API key.");
  }
}
