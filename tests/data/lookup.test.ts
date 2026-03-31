import { describe, expect, test } from "bun:test";
import {
  lookupPalette,
  lookupFontPairings,
  lookupStyle,
  lookupProductType,
  getAllPalettes,
  getAllFontPairings,
  getAllStyles,
  getAllProductTypes,
} from "../../src/data/lookup";

describe("Data Lookup", () => {
  // Palettes
  test("getAllPalettes returns 161 palettes", () => {
    const palettes = getAllPalettes();
    expect(palettes.length).toBe(161);
  });

  test("lookupPalette finds a palette by type", () => {
    const palette = lookupPalette("saas");
    expect(palette).not.toBeNull();
    expect(palette!.primary).toBeDefined();
    expect(palette!.accent).toBeDefined();
    expect(palette!.background).toBeDefined();
  });

  test("lookupPalette returns null for unknown type", () => {
    expect(lookupPalette("nonexistent_xyz")).toBeNull();
  });

  // Font pairings
  test("getAllFontPairings returns 57 pairings", () => {
    const pairings = getAllFontPairings();
    expect(pairings.length).toBe(57);
  });

  test("lookupFontPairings finds pairings by mood", () => {
    const pairings = lookupFontPairings("luxury");
    expect(pairings.length).toBeGreaterThan(0);
    expect(pairings[0].heading).toBeDefined();
    expect(pairings[0].body).toBeDefined();
  });

  test("lookupFontPairings returns empty for unknown mood", () => {
    expect(lookupFontPairings("nonexistent_xyz")).toEqual([]);
  });

  // Styles
  test("getAllStyles returns 67 styles", () => {
    const styles = getAllStyles();
    expect(styles.length).toBe(67);
  });

  test("lookupStyle finds a style by name", () => {
    const style = lookupStyle("glassmorphism");
    expect(style).not.toBeNull();
    expect(style!.description).toBeDefined();
    expect(style!.useCases).toBeDefined();
  });

  test("lookupStyle is case-insensitive", () => {
    const style = lookupStyle("Glassmorphism");
    expect(style).not.toBeNull();
  });

  test("lookupStyle returns null for unknown name", () => {
    expect(lookupStyle("nonexistent_xyz")).toBeNull();
  });

  // Product types
  test("getAllProductTypes returns entries", () => {
    const types = getAllProductTypes();
    expect(types.length).toBeGreaterThanOrEqual(25);
  });

  test("lookupProductType finds a type", () => {
    const pt = lookupProductType("fintech");
    expect(pt).not.toBeNull();
    expect(pt!.landingPattern).toBeDefined();
    expect(pt!.styles).toBeDefined();
    expect(pt!.avoid).toBeDefined();
  });

  test("lookupProductType returns null for unknown type", () => {
    expect(lookupProductType("nonexistent_xyz")).toBeNull();
  });
});
