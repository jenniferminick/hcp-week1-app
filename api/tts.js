export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { text, voiceId } = req.body;
  const apiKey = process.env.ELEVENLABS_KEY;

  if (!apiKey) return res.status(500).json({ error: "Missing API key" });
  if (!text || !voiceId) return res.status(400).json({ error: "Missing text or voiceId" });

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: { stability: 0.4, similarity_boost: 0.8 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.send(Buffer.from(audioBuffer));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}