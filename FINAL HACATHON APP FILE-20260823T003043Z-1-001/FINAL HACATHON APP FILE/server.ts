import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Helper for lazy Gemini AI instance
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "REMI" });
  });

  // AI Memory extraction from conversation
  app.post("/api/extract-memory", async (req, res) => {
    try {
      const { conversationText, personName, relationship } = req.body;
      if (!conversationText) {
        return res.status(400).json({ error: "Missing conversation text" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback rule-based extraction if no API key is set
        return res.json({
          person: personName || "Aarav",
          relationship: relationship || "Family",
          whatHappened: `Discussed: "${conversationText.slice(0, 80)}..."`,
          when: "Upcoming",
          importance: "High",
          summary: conversationText.slice(0, 100),
          isAiGenerated: false,
        });
      }

      const prompt = `Analyze this real-life everyday conversation for REMI, an AI memory companion designed for someone with mild cognitive impairment or dementia.
Extract meaningful, reassuring, concise facts that will help the user stay oriented.

Speaker/Context: Person named "${personName || "Unknown"}" (Relationship: "${relationship || "Familiar"}").
Conversation snippet:
"${conversationText}"

Return JSON matching the schema. Keep the 'whatHappened' friendly, simple, and direct (e.g. "Aarav said he will visit tomorrow." or "Priya asked you to call her tonight.").`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are REMI's core Memory Synthesizer. Convert conversations into gentle, ultra-clear, concise 1-sentence memories for someone who needs context orientation.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              person: { type: Type.STRING },
              relationship: { type: Type.STRING },
              whatHappened: { type: Type.STRING },
              when: { type: Type.STRING },
              contextNote: { type: Type.STRING },
            },
            required: ["person", "relationship", "whatHappened", "when"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        person: parsed.person || personName || "Familiar person",
        relationship: parsed.relationship || relationship || "Family",
        whatHappened: parsed.whatHappened || "Had a pleasant conversation.",
        when: parsed.when || "Recent",
        contextNote: parsed.contextNote || "",
        isAiGenerated: true,
      });
    } catch (error: any) {
      console.error("Gemini memory extraction error:", error);
      return res.json({
        person: req.body.personName || "Familiar person",
        relationship: req.body.relationship || "Loved one",
        whatHappened: req.body.conversationText
          ? `Conversation: "${req.body.conversationText.slice(0, 70)}"`
          : "Shared a warm conversation.",
        when: "Today",
        isAiGenerated: false,
      });
    }
  });

  // Reconnection prompt synthesizer
  app.post("/api/reconnect-context", async (req, res) => {
    try {
      const { person, recentMemories } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          reconnectCue: `${person?.name || "Aarav"} is your ${person?.relationship || "grandson"}. He visited recently and said he may visit again today.`,
        });
      }

      const prompt = `Generate a calm, reassuring 2-sentence context cue for REMI's Memory Reconnection feature.
Person: ${person?.name} (${person?.relationship}).
Recent details: ${JSON.stringify(recentMemories || [])}
Make it warm, respectful, and grounding. No clinical terms.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      return res.json({
        reconnectCue: response.text?.trim() || `${person?.name} is your ${person?.relationship}.`,
      });
    } catch (err) {
      return res.json({
        reconnectCue: "Aarav is your grandson. He visited recently and said he may visit again today.",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`REMI Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
