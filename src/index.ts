export { QuestionRouter } from "./discovery/question-router";
export { getAllQuestions, getQuestionsByCategory, getQuestionById } from "./discovery/questions";
export { generateBrief } from "./discovery/brief-generator";
export { RulesLoader } from "./rules/loader";
export { PreviewServer } from "./preview/server";
export { FileWatcher } from "./preview/watcher";
export { findAvailablePort } from "./preview/port-finder";
export { generateToolbarHTML } from "./preview/toolbar";
export { generateSpec } from "./export/spec-generator";

export type { Question, Choice, Category } from "./discovery/questions";
export type { LoadedRule } from "./rules/loader";
export type { DesignDecision, ScreenEntry, SpecInput } from "./export/spec-generator";
export type { Screen, ScreenVersion } from "./preview/toolbar";
