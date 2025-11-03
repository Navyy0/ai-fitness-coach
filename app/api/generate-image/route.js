import { generateImage } from "@/lib/huggingface";

export async function POST(req) {
  try {
    const { prompt, type = "exercise" } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const imageBase64 = await generateImage(prompt, type);
    
    return new Response(
      JSON.stringify({ image: imageBase64 }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    
    // Provide better error messages
    let errorMessage = error.message || "Failed to generate image";
    
    if (error.message?.includes("rate limit")) {
      errorMessage = "Rate limit exceeded. Please try again in a few moments. Tip: Add HUGGINGFACE_API_KEY in .env.local for higher limits.";
    } else if (error.message?.includes("Invalid HUGGINGFACE_API_KEY")) {
      errorMessage = "Invalid API key. Please check your HUGGINGFACE_API_KEY in .env.local";
    } else if (error.message?.includes("loading")) {
      errorMessage = "Model is loading. Please wait a moment and try again.";
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

