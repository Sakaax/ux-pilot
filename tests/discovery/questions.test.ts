import { describe, expect, test } from "bun:test";
import {
  getAllQuestions,
  getQuestionsByCategory,
  getQuestionById,
  type Question,
} from "../../src/discovery/questions";

describe("Question Bank", () => {
  test("getAllQuestions returns all questions", () => {
    const questions = getAllQuestions();
    expect(questions.length).toBeGreaterThanOrEqual(30);
  });

  test("every question has required fields", () => {
    const questions = getAllQuestions();
    for (const q of questions) {
      expect(q.id).toBeDefined();
      expect(q.text).toBeDefined();
      expect(q.category).toBeDefined();
      expect(q.choices.length).toBeGreaterThanOrEqual(1);
      // Last choice is always free text
      const last = q.choices[q.choices.length - 1];
      expect(last.isFreeText).toBe(true);
    }
  });

  test("getQuestionsByCategory filters correctly", () => {
    const productQuestions = getQuestionsByCategory("product");
    expect(productQuestions.length).toBeGreaterThanOrEqual(3);
    for (const q of productQuestions) {
      expect(q.category).toBe("product");
    }
  });

  test("categories cover all required areas", () => {
    const questions = getAllQuestions();
    const categories = new Set(questions.map((q) => q.category));
    expect(categories.has("product")).toBe(true);
    expect(categories.has("users")).toBe(true);
    expect(categories.has("business")).toBe(true);
    expect(categories.has("flows")).toBe(true);
    expect(categories.has("design")).toBe(true);
    expect(categories.has("seo")).toBe(true);
    expect(categories.has("technical")).toBe(true);
    expect(categories.has("retention")).toBe(true);
  });

  test("question IDs are unique", () => {
    const questions = getAllQuestions();
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("getQuestionById returns correct question", () => {
    const q = getQuestionById("product_type");
    expect(q).toBeDefined();
    expect(q!.text).toContain("produit");
  });

  test("getQuestionById returns undefined for unknown id", () => {
    const q = getQuestionById("nonexistent_xyz");
    expect(q).toBeUndefined();
  });
});
