import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-2.5" });
    
    const prompt = `Generate a short, inspiring motivational fitness quote (1-2 sentences max). Make it encouraging, positive, and relevant to fitness goals. Return only the quote text, no additional formatting, no quotes around it.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const quote = response.text().trim();
    
    return new Response(
      JSON.stringify({ quote }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Motivation quote error:", error);
    // Return a fallback quote
    const fallbackQuotes = [
      "Your body can do it. It's your mind you need to convince!",
      "The only bad workout is the one that didn't happen.",
      "Success is the sum of small efforts repeated day in and day out.",
      "Take care of your body. It's the only place you have to live.",
    ];
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    
    return new Response(
      JSON.stringify({ quote: randomQuote }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

