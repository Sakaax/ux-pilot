// Discovery
export { QuestionRouter } from "./discovery/question-router";
export { getAllQuestions, getQuestionsByCategory, getQuestionById } from "./discovery/questions";
export { generateBrief } from "./discovery/brief-generator";

// Audit
export { detectFramework } from "./audit/framework-detector";
export { CodeScanner } from "./audit/scanner";
export { generateAuditReport } from "./audit/report-generator";

// Rules
export { RulesLoader } from "./rules/loader";

// Data
export {
  lookupPalette, lookupFontPairings, lookupStyle, lookupProductType,
  getAllPalettes, getAllFontPairings, getAllStyles, getAllProductTypes,
} from "./data/lookup";

// Preview
export { PreviewServer } from "./preview/server";
export { FileWatcher } from "./preview/watcher";
export { findAvailablePort } from "./preview/port-finder";
export { generateToolbarHTML } from "./preview/toolbar";

// Export
export { generateSpec } from "./export/spec-generator";
export { convertToFramework } from "./export/component-converter";

// Types
export type { Question, Choice, Category } from "./discovery/questions";
export type { FrameworkInfo } from "./audit/framework-detector";
export type { Finding, ScanResult, Severity, FindingCategory } from "./audit/scanner";
export type { LoadedRule } from "./rules/loader";
export type { Palette, FontPairing, Style, ProductType } from "./data/lookup";
export type { DesignDecision, ScreenEntry, SpecInput } from "./export/spec-generator";
export type { Screen, ScreenVersion } from "./preview/toolbar";
