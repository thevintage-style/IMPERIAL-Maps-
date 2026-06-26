import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { INDIA_LOCATIONS, WORLD_LOCATIONS } from "./src/data";
import { RIVERS_DATA } from "./src/riversData";

dotenv.config();

// Standard server-side key check with lazy initialization
function getGoogleGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to call ai.models.generateContent with retries on transient errors (429 and 503)
async function generateContentWithRetry(aiClient: GoogleGenAI, model: string, contents: any, config: any, maxRetries = 3) {
  let delay = 1000; // start with 1 second delay
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await aiClient.models.generateContent({
        model,
        contents,
        config
      });
    } catch (error: any) {
      const errorMsg = String(error?.message || error || "");
      const isRateLimit = errorMsg.includes("429") || errorMsg.toLowerCase().includes("resource_exhausted") || errorMsg.toLowerCase().includes("quota");
      const isTransient503 = errorMsg.includes("503") || errorMsg.toLowerCase().includes("overloaded") || errorMsg.toLowerCase().includes("high demand") || errorMsg.toLowerCase().includes("unavailable");
      
      if ((isRateLimit || isTransient503) && attempt < maxRetries) {
        console.log(`[Gemini Retry] Attempt ${attempt} of ${maxRetries} failed with transient error: ${errorMsg.slice(0, 100)}. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries reached");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // API Endpoint: Explore any place or coordinates
  app.post("/api/gemini/explore", async (req, res) => {
    const { name, section, category, coordinates, details } = req.body;

    const ai = getGoogleGenAI();

    const cleanErrorMessage = (errorMsg?: string): string => {
      if (!errorMsg) return "Sovereign Scroll Vaults Ledger Entry • Backup Handled";
      const msgLower = errorMsg.toLowerCase();

      // Check for Gemini/Google API Quota or Throttle limits (429)
      if (
        msgLower.includes("quota") || 
        msgLower.includes("429") || 
        msgLower.includes("resource_exhausted") || 
        msgLower.includes("rate-limits") ||
        msgLower.includes("billing")
      ) {
        return "Imperial Courier Suspended (Gemini API Quota Exceeded) • Offline Vault Active";
      }

      // Check for 503 / unavailable / overloaded
      if (
        msgLower.includes("503") ||
        msgLower.includes("temporarily unavailable") ||
        msgLower.includes("experiencing high demand") ||
        msgLower.includes("unavailable")
      ) {
        return "Celestial Oracle Quiet (Gemini API 503 Busy) • Offline Vault Active";
      }

      // Check for key-specific errors
      if (
        msgLower.includes("api key") || 
        msgLower.includes("key absent") || 
        msgLower.includes("invalid key") ||
        msgLower.includes("unauthorized")
      ) {
        return "Imperial Scribe Quiet (API Connection Setup Required) • Offline Vault Active";
      }

      // Try parsing as JSON to find clean error message
      try {
        const parsed = JSON.parse(errorMsg);
        if (parsed?.error?.message) {
          const mainLine = parsed.error.message.split("\n")[0];
          return `${mainLine} • Offline Vault Active`;
        }
      } catch (jsonErr) {
        // Fall back to clean substring
      }

      // Trim extremely long raw tracebacks
      if (errorMsg.length > 120) {
        return errorMsg.substring(0, 110) + "... • Offline Vault Active";
      }
      return `${errorMsg} • Offline Vault Active`;
    };

    const generateLocalFallback = (errorMsg?: string) => {
      const parsedName = name || (coordinates ? `Coordinates [${coordinates}]` : "Ancient Landmass");
      const cleanError = cleanErrorMessage(errorMsg);

      // Search lists for a matched preset to deliver ultra high fidelity factual fallback
      const presetMatches = [...INDIA_LOCATIONS, ...WORLD_LOCATIONS];
      const match = presetMatches.find(p => p.name.toLowerCase() === parsedName.toLowerCase() || p.id.toLowerCase() === parsedName.toLowerCase());
      const riverMatch = RIVERS_DATA.find(r => r.name.toLowerCase() === parsedName.toLowerCase() || r.id.toLowerCase() === parsedName.toLowerCase());

      if (riverMatch) {
         return {
           locationName: riverMatch.name,
           coordinates: `${riverMatch.path[0][0].toFixed(3)}°N / ${riverMatch.path[0][1].toFixed(3)}°E (Source)`,
           archetype: "Flowing Lifeline Watercourse",
           title: `${riverMatch.name.toUpperCase()} RIVER DISPATCH`,
           poeticDescription: `${riverMatch.name} is one of the most vital rivers in UPSC geography. It originates at ${riverMatch.origin} and meanders for an extensive length of ${riverMatch.length}. It flows directly across ${riverMatch.statesOrCountriesDirect.length} territory zones: ${riverMatch.statesOrCountriesDirect.join(", ")}. It is central to agricultural safety, industrial basins, and ecological zones.`,
           importance: `Pivotal hydro-ecological stream acting as irrigation backbone, riparian demarcator, and regional transport corridor (NW networks).`,
           timeline: [
             { era: "Headwaters Source", event: riverMatch.origin },
             { era: "Total Flow Meander", event: riverMatch.length },
             { era: "Left Bank", event: riverMatch.tributariesLeft.join(", ") },
             { era: "Right Bank", event: riverMatch.tributariesRight.join(", ") }
           ],
           associatedFeatures: {
             rivers: `${riverMatch.name} River Basin & Catchment`,
             mountains: "Surrounding alpine ridges and glacier lines that supply water flow",
             surroundingPlains: "Fertile agricultural river-delta or riparian basin plains"
           },
           trivia: `Major Hydrological Infrastructure/Dams: ${riverMatch.majorDamsProjects.join(", ")}. Ancient Context: ${riverMatch.historicSignificance}`,
           upscPrelims: `• National Status: Major drainage basin framework.\n• Left Bank Tributaries: ${riverMatch.tributariesLeft.join(", ")}\n• Right Bank Tributaries: ${riverMatch.tributariesRight.join(", ")}\n• Dam Projects & Engineering: ${riverMatch.majorDamsProjects.join(", ")}\n• UPSC Prelims Highlight: ${riverMatch.upscPrelimsBrief}`,
           upscMains: `• Direct Territory Coverage: Passes directly through ${riverMatch.statesOrCountriesDirect.length} regions: ${riverMatch.statesOrCountriesDirect.join(", ")}.\n\n• UPSC Mains Analytical Studies (Geography, Environment, Disaster Management):\n${riverMatch.upscMainsBrief}`,
           systemMessage: cleanError
         };
      }

      if (match) {
        return {
          locationName: match.name,
          coordinates: match.coordinatesStr,
          archetype: match.subCategoryText,
          title: `THE CHRONICLE OF IMPERIAL ${match.name.toUpperCase()}`,
          poeticDescription: match.details,
          importance: `Key geographic bastion holding core strategic significance, managing sovereign transportation routes, water drainages, or fertile basin soils.`,
          timeline: [
            { era: "Antiquity", event: "Noted in early geographic records of classical mapmakers." },
            { era: "Imperial Peak", event: "Consolidated as a pivotal asset for defensive walls and trade networks." },
            { era: "Modern Era", event: "Preserved as a protected national heritage and study monument." }
          ],
          associatedFeatures: {
            rivers: "Faint river channels or underground aquifers feed nearby agricultural systems.",
            mountains: "High crests of the defensive terrain line are observable nearby.",
            surroundingPlains: "Flat valleys and black or alluvial soils support vast agrarian communities."
          },
          trivia: "An extremely legendary chronicle states ancient caravans stopped here to verify maps and swap deep gold and silk loads.",
          upscPrelims: `• Landmark Feature: ${match.name} remains a crucial historical subject.\n• Category Type: ${match.category.toUpperCase()} within the geographic region.\n• Core UPSC Significance: Connected to major dynastic administrative seats, art-and-architecture models, or crucial environmental zones.`,
          upscMains: `A comprehensive evaluation of the physical geography of ${match.name} highlights the dynamic link between spatial terrains, agrarian base integration, and historical communication corridors (GS-1 & GS-3).`,
          systemMessage: cleanError
        };
      }

      return {
        locationName: parsedName,
        coordinates: coordinates || "Unmarked",
        archetype: category || "Ancient Sovereign Sector",
        title: `THE SCROLL OF ${parsedName.toUpperCase()}`,
        poeticDescription: `Surrounding geography has nourished regional agricultural basins, military units, and merchants throughout history. ${details || "A majestic sector recorded on our aged vellum manuscripts for permanent archive recording."}`,
        importance: `Serves as a strategic regional marker. Retains substantial trade and defense value, commanding control over nearby passes, fertile soils, or maritime pathways.`,
        timeline: [
          { era: "Antiquity", event: "Inscribed in early bronze scrolls and local folk-melodies." },
          { era: "Middle Realms", event: "Becomes a center of regional tribute and caravan rest-stops." },
          { era: "Modern Scholarly Era", event: "Recorded in the Magnus Atlas by the order of the Royal Geographer." }
        ],
        associatedFeatures: {
          rivers: "Faint river branches mapped in close proximity feed nearby basins.",
          mountains: "Elevated ridges visible along the distant horizon path.",
          surroundingPlains: "Rolling pastoral lands suitable for agricultural empire building and boundary demarcation."
        },
        trivia: "Legend has it that early maritime navigators designated this region with illustrations of mystical sea beasts, warnings of ancient winds.",
        upscPrelims: `• Key Dynasties & Administration: Surrounding geography has intersections with major imperial consolidation lines.\n• Structural Monuments: Notable structures from historical periods showcasing regional design types.\n• Ecological Context: Linked to vital regional watersheds, local forest covers, or protected wildlife zones.\n• Mapping Highlights: Command center of early defensive passes or caravan linkages.`,
        upscMains: `The developmental and geographical evolution of this area illustrates the pivotal role physical terrain plays in guiding trade corridors, agrarian surplus distribution, and regional administration.\n1. Agrarian Integration: Natural valley drainages served as the basis for agricultural production, supporting sovereign taxation and army maintenance (GS-1: Indian Geography).\n2. Geopolitical Conduit: Mountain passes, river channels, or maritime centers functioned as key transit points for trade and diplomatic routes (GS-1: Ancient & Medieval History).\n3. Contemporary Heritage and Water Security: Preservation of local monuments and sustainable management of regional aquifers amidst urban sprawl (GS-3: Environment).`,
        systemMessage: cleanError
      };
    };

    try {
      if (!ai) {
        return res.json(generateLocalFallback("Cartographer keys currently held in offline status."));
      }

      const prompt = `
        You are an 18th-century royal chronicler, scholar, and lead cartographer compiling the "Atlas of the Imperial Cartographic Society".
        Your role is additionally enhanced with a modern scholar's objective: preparing aspirants for the Indian Civil Services Examination (UPSC GS Papers I & III).
        Write a historical and geographical survey for a location or region click interest:
        - Name / Subject: "${name || "Unknown coordinates"}"
        - Section: "${section || "India or World"}"
        - Map Category: "${category || "coordinate inspection"}"
        - Marked Coordinates: "${coordinates || "N/A"}"
        - Initial clues: "${details || "A mysterious point on the map"}"

        You must response with two distinct characters integrated:
        1. An 18th-century royal scholar first (realms, majestic, providence, topography, eminence).
        2. A rigorous modern academic providing highly structured UPSC examination insights (Prelims high-yield facts and Mains analytical briefs) strictly aligned with the Indian Civil Services CSE Syllabus.

        Format your detailed response strictly in JSON adhering to this schema:
        {
          "locationName": "Strictly descriptive human-readable label for this point",
          "coordinates": "Coordinates styled in maritime notation (e.g. N 28°36' / E 77°12')",
          "archetype": "Archetype, e.g. Mughal Seat, Mighty River-System, High Mountain Pass, Trading Plains, Maritime Haven",
          "title": "A grand title for the scroll (e.g., 'THE CHRONICLE OF IMPERIAL DELHI')",
          "poeticDescription": "An immersive paragraph of scholarly lore and physical overview of the place (80-120 words)",
          "importance": "Detailed military, cultural, agricultural or strategic value of the topography",
          "timeline": [
            { "era": "Chronological Era (e.g., Bronze Age / Ancient Kings)", "event": "Significant event, battle, or dynamic movement in history" },
            { "era": "e.g., Imperial Renaissance", "event": "Cultural or empire building peak" },
            { "era": "e.g., Modern Cartography", "event": "Its current renown or historical remnants" }
          ],
          "associatedFeatures": {
            "rivers": "Major rivers or watersheds flowing nearby or feeding this place",
            "mountains": "Mountain ranges, hills, or high lookouts guarding the zone",
            "surroundingPlains": "Plains, valley systems, or agricultural significance of the basin"
          },
          "trivia": "A singular incredible secret, legend, lost relic or folklore recorded about this coordinate by older mariners",
          "upscPrelims": "High-yield factual details for UPSC Civil Services Prelims (GS-1: Ancient, Medieval, Modern Indian History, Art & Culture, Indian & World Physical Geography, and Environment). Highlight key dynasties, crucial ancient battles, inscription edicts, nearby National Parks, Wildlife Sanctuaries, Tiger Reserves, Ramsar Wetlands, soil and mineral types, and core artistic or architectural features. Return as bullet points with • symbol.",
          "upscMains": "A highly structured, multidimensional analytical critique tailored for UPSC CSE Mains Examination (GS Paper I Art & Culture/Geography/History, or GS Paper III Environment). Analyze the historical significance, agrarian surplus dynamics, socio-cultural integration pattern, defensive/strategic value of geography, or environmental sustainability vs conservation challenges of this coordinate. Limit to 120-180 words."
        }
      `;

      const response = await generateContentWithRetry(
        ai,
        "gemini-3.5-flash",
        prompt,
        {
          systemInstruction: "You are the Ultimate Royal Cartographer and Scholar. Ensure historical accuracy, immersive 18th century parchment narration style, combined with professional Indian Civil Services Exam (UPSC Prelims/Mains) syllabus integration, and return strict JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              locationName: { type: Type.STRING },
              coordinates: { type: Type.STRING },
              archetype: { type: Type.STRING },
              title: { type: Type.STRING },
              poeticDescription: { type: Type.STRING },
              importance: { type: Type.STRING },
              timeline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    era: { type: Type.STRING },
                    event: { type: Type.STRING }
                  },
                  required: ["era", "event"]
                }
              },
              associatedFeatures: {
                type: Type.OBJECT,
                properties: {
                  rivers: { type: Type.STRING },
                  mountains: { type: Type.STRING },
                  surroundingPlains: { type: Type.STRING }
                },
                required: ["rivers", "mountains", "surroundingPlains"]
              },
              trivia: { type: Type.STRING },
              upscPrelims: { type: Type.STRING },
              upscMains: { type: Type.STRING }
            },
            required: ["locationName", "coordinates", "archetype", "title", "poeticDescription", "importance", "timeline", "associatedFeatures", "trivia", "upscPrelims", "upscMains"]
          }
        }
      );

      const responseText = response.text || "";
      const resultObj = JSON.parse(responseText.trim());
      res.json({
        ...resultObj,
        systemMessage: "Successfully channeled via Gemini AI."
      });
    } catch (error: any) {
      const cleanMsg = cleanErrorMessage(error?.message || String(error));
      console.log(`[Backup Engaged] Gemini mapping handled via local backup. Details: ${cleanMsg}`);
      console.log(`[Backup Debug] Original details: ${error?.message || error}`);
      // Seamlessly serve local backup instead of a 500 error!
      res.json(generateLocalFallback(error?.message || String(error)));
    }
  });

  // Serve static assets or mount Vite middleware
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
    console.log(`Imperial Maps Server is active upon port http://localhost:${PORT}`);
  });
}

startServer();
