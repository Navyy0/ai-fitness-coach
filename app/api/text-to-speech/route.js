import { textToSpeech } from "../../../lib/elevenlabs";

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Invalid text" }), { status: 400 });
    }

    // server-side call
    const audioDataUrl = await textToSpeech(text);

    return new Response(JSON.stringify({ audio: audioDataUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("TTS route error:", err);
    return new Response(JSON.stringify({ error: err.message || "TTS failed" }), {
      status: err?.status || 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
