import { readFileSync } from "fs";
import { resolve } from "path";

export interface Palette {
  type: string;
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

export interface FontPairing {
  name: string;
  heading: string;
  body: string;
  mood: string[];
  googleUrl: string;
}

export interface Style {
  name: string;
  description: string;
  useCases: string[];
  avoid: string[];
  cssHints: string;
}

export interface ProductType {
  type: string;
  landingPattern: string;
  styles: string[];
  colorFocus: string;
  dashboardStyle: string;
  avoid: string[];
}

const DATA_DIR = resolve(import.meta.dir, "../../data");

let palettesCache: Palette[] | null = null;
let fontPairingsCache: FontPairing[] | null = null;
let stylesCache: Style[] | null = null;
let productTypesCache: ProductType[] | null = null;

function loadJSON<T>(filename: string): T[] {
  const content = readFileSync(resolve(DATA_DIR, filename), "utf-8");
  return JSON.parse(content) as T[];
}

export function getAllPalettes(): Palette[] {
  if (!palettesCache) {
    palettesCache = loadJSON<Palette>("palettes.json");
  }
  return palettesCache;
}

export function lookupPalette(productType: string): Palette | null {
  const palettes = getAllPalettes();
  return palettes.find((p) => p.type === productType) ?? null;
}

export function getAllFontPairings(): FontPairing[] {
  if (!fontPairingsCache) {
    fontPairingsCache = loadJSON<FontPairing>("font-pairings.json");
  }
  return fontPairingsCache;
}

export function lookupFontPairings(mood: string): FontPairing[] {
  const pairings = getAllFontPairings();
  const lowerMood = mood.toLowerCase();
  return pairings.filter((p) =>
    p.mood.some((m) => m.toLowerCase().includes(lowerMood))
  );
}

export function getAllStyles(): Style[] {
  if (!stylesCache) {
    stylesCache = loadJSON<Style>("styles.json");
  }
  return stylesCache;
}

export function lookupStyle(name: string): Style | null {
  const styles = getAllStyles();
  const lowerName = name.toLowerCase();
  return styles.find((s) => s.name.toLowerCase() === lowerName) ?? null;
}

export function getAllProductTypes(): ProductType[] {
  if (!productTypesCache) {
    productTypesCache = loadJSON<ProductType>("product-types.json");
  }
  return productTypesCache;
}

export function lookupProductType(type: string): ProductType | null {
  const types = getAllProductTypes();
  const lowerType = type.toLowerCase();
  return types.find((t) => t.type.toLowerCase() === lowerType) ?? null;
}
