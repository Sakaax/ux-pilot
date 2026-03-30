import { describe, expect, test } from "bun:test";
import { QuestionRouter } from "../../src/discovery/question-router";

describe("QuestionRouter", () => {
  test("starts with the first question", () => {
    const router = new QuestionRouter();
    const first = router.nextQuestion();
    expect(first).toBeDefined();
    expect(first!.id).toBe("product_type");
  });

  test("advances to next question after answering", () => {
    const router = new QuestionRouter();
    const first = router.nextQuestion();
    router.answer(first!.id, "saas");
    const second = router.nextQuestion();
    expect(second).toBeDefined();
    expect(second!.id).not.toBe(first!.id);
  });

  test("skips questions based on skipIf conditions", () => {
    const router = new QuestionRouter();
    // Answer questions until business_pricing
    let q = router.nextQuestion();
    while (q && q.id !== "business_pricing") {
      router.answer(q.id, q.choices[0].value);
      q = router.nextQuestion();
    }
    // Answer pricing as "free"
    router.answer("business_pricing", "free");
    // business_plans_count should be skipped
    q = router.nextQuestion();
    expect(q?.id).not.toBe("business_plans_count");
  });

  test("returns null when all questions are answered", () => {
    const router = new QuestionRouter();
    let q = router.nextQuestion();
    while (q) {
      router.answer(q.id, q.choices[0].value);
      q = router.nextQuestion();
    }
    expect(router.nextQuestion()).toBeNull();
  });

  test("getAnswers returns all collected answers", () => {
    const router = new QuestionRouter();
    const q = router.nextQuestion()!;
    router.answer(q.id, "saas");
    const answers = router.getAnswers();
    expect(answers.get("product_type")).toBe("saas");
  });

  test("isComplete returns true when all questions answered or skipped", () => {
    const router = new QuestionRouter();
    expect(router.isComplete()).toBe(false);
    let q = router.nextQuestion();
    while (q) {
      router.answer(q.id, q.choices[0].value);
      q = router.nextQuestion();
    }
    expect(router.isComplete()).toBe(true);
  });
});
