// lib/elevenlabs.js (server-side)
import fetch from "node-fetch"; // if running node 18+, native fetch is fine

export async function textToSpeech(text, voiceId = "21m00Tcm4TlvDq8ikWAM") {
  const apiKey = (process.env.ELEVENLABS_API_KEY || "").trim();
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not set on server");

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: { stability: 0.5, similarity_boost: 0.5 },
    }),
  });

  if (!res.ok) {
    let errText = await res.text().catch(() => "");
    try {
      const json = JSON.parse(errText || "{}");
      errText = json.detail?.message || json.message || errText;
    } catch {}
    const errMsg =
      res.status === 401
        ? `ElevenLabs 401: Invalid or insufficient-permission key`
        : `ElevenLabs error ${res.status}: ${errText || res.statusText}`;
    const e = new Error(errMsg);
    e.status = res.status;
    throw e;
  }

  const buffer = await res.arrayBuffer();
  const b64 = Buffer.from(buffer).toString("base64");
  return `data:audio/mpeg;base64,${b64}`;
}
