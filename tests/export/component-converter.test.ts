import { describe, expect, test } from "bun:test";
import { convertToFramework } from "../../src/export/component-converter";

const SAMPLE_HTML = `<div class="card">
  <h2 class="card-title">Hello World</h2>
  <p>Some content here</p>
  <label for="email">Email</label>
  <input id="email" type="email" class="input" />
  <img src="photo.jpg" alt="A photo" class="rounded" />
  <button class="btn" onclick="handleClick()">Click me</button>
</div>`;

describe("Component Converter", () => {
  test("converts to React JSX", () => {
    const result = convertToFramework(SAMPLE_HTML, "react", "Card");
    expect(result).toContain("export default function Card");
    expect(result).toContain("className=");
    expect(result).toContain("htmlFor=");
    // Self-closing tags
    expect(result).toContain("/>");
  });

  test("converts to Svelte", () => {
    const result = convertToFramework(SAMPLE_HTML, "svelte", "Card");
    expect(result).toContain("<script>");
    expect(result).toContain("class=");
    // Svelte keeps class, not className
    expect(result).not.toContain("className");
  });

  test("converts to Vue SFC", () => {
    const result = convertToFramework(SAMPLE_HTML, "vue", "Card");
    expect(result).toContain("<template>");
    expect(result).toContain("<script setup>");
    expect(result).toContain("class=");
  });

  test("preserves CSS classes", () => {
    const react = convertToFramework(SAMPLE_HTML, "react", "Card");
    expect(react).toContain("card");
    expect(react).toContain("card-title");
    expect(react).toContain("rounded");
  });

  test("handles empty input", () => {
    const result = convertToFramework("", "react", "Empty");
    expect(result).toContain("export default function Empty");
  });
});
