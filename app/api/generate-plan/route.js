import { generatePlanWithGemini } from "@/lib/gemini";

export async function POST(req) {
  try {
    const userData = await req.json();
    
    if (!userData.name || !userData.age || !userData.goal) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const plan = await generatePlanWithGemini(userData);
    
    return new Response(JSON.stringify(plan), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Plan generation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate plan" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
