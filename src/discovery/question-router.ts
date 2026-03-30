import { getAllQuestions, type Question } from "./questions";

export class QuestionRouter {
  private questions: Question[];
  private answers: Map<string, string>;
  private currentIndex: number;

  constructor() {
    this.questions = getAllQuestions();
    this.answers = new Map();
    this.currentIndex = 0;
  }

  nextQuestion(): Question | null {
    while (this.currentIndex < this.questions.length) {
      const question = this.questions[this.currentIndex];

      if (this.shouldSkip(question)) {
        this.currentIndex++;
        continue;
      }

      if (!this.answers.has(question.id)) {
        return question;
      }

      this.currentIndex++;
    }

    return null;
  }

  answer(questionId: string, value: string): void {
    this.answers.set(questionId, value);
    this.currentIndex++;
  }

  getAnswers(): Map<string, string> {
    return new Map(this.answers);
  }

  isComplete(): boolean {
    return this.nextQuestion() === null;
  }

  private shouldSkip(question: Question): boolean {
    if (!question.skipIf) return false;

    return question.skipIf.some((condition) => {
      const answer = this.answers.get(condition.questionId);
      return answer !== undefined && condition.values.includes(answer);
    });
  }
}
