export type MapSection = "india" | "world";
export type MapSubSection = "political" | "physical" | "terrain"; // political, physical, and rivers/mountains/terrain

export interface PresetLocation {
  id: string;
  name: string;
  coordinatesStr: string;
  x: number; // Percent of SVG width
  y: number; // Percent of SVG height
  lat?: number;
  lng?: number;
  category: "city" | "river" | "mountain" | "plain" | "plateau" | "fort" | "pass";
  subCategoryText: string;
  details: string;
  era?: "Ancient" | "Medieval" | "Early Modern" | "Modern";
  kingsRuled?: string;
  giTags?: string[];
}

export interface ChroniclerReport {
  locationName: string;
  coordinates: string;
  archetype: string;
  title: string;
  poeticDescription: string;
  importance: string;
  timeline: {
    era: string;
    event: string;
  }[];
  associatedFeatures: {
    rivers: string;
    mountains: string;
    surroundingPlains: string;
  };
  trivia: string;
  upscPrelims?: string;
  upscMains?: string;
  systemMessage?: string;
}
