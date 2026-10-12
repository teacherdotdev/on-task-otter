import { useSyncExternalStore } from "react";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";

// Every language On-task Otter can speak. English is the fallback: if a phrase
// is missing from another language, the English one is shown instead.
const languages = { en, es, fr };

const STORAGE_KEY = "on-task-otter-language";

export const availableLanguages = Object.entries(languages)
  .map(([code, language]) => ({ code, name: language.name }));

// The language to open with: the one chosen last time, otherwise the one the
// computer is set to, otherwise English.
const savedLanguage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && languages[saved]) return saved;
  } catch {
    // Some browsers block storage. The language simply is not remembered.
  }
  return null;
};

const computerLanguage = () => {
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of preferred) {
    const code = String(tag ?? "").toLowerCase().split("-")[0];
    if (languages[code]) return code;
  }
  return null;
};

let currentCode = savedLanguage() ?? computerLanguage() ?? "en";

const listeners = new Set();
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getCode = () => currentCode;

const applyToDocument = () => {
  const language = languages[currentCode] ?? en;
  document.documentElement.lang = currentCode;
  document.documentElement.dir = language.dir ?? "ltr";
};

export const setLanguage = (code) => {
  if (!languages[code] || code === currentCode) return;
  currentCode = code;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Not remembering the choice is fine; this session still switches.
  }
  applyToDocument();
  listeners.forEach((listener) => listener());
};

const chosenLanguage = () => languages[currentCode] ?? en;

/** One phrase, with any {placeholders} filled in. */
export const t = (key, values = {}) =>
  String(chosenLanguage().ui[key] ?? en.ui[key] ?? key)
    .replace(/\{(\w+)\}/g, (whole, name) => values[name] ?? whole);

/** A list of phrases, such as the encouragement messages. */
export const tList = (key) => {
  const list = chosenLanguage().ui[key] ?? en.ui[key];
  return Array.isArray(list) ? list : [];
};

// Links and bold words inside a phrase are written the way they are in a
// Markdown file: "Read more at [teacher.dev](teacherdev)" and "press
// *Command + L*". The name in brackets is looked up in the links given to the
// component showing the phrase.
const RICH_PATTERN = /\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*/g;

/** Splits a phrase into plain pieces, link pieces, and bold pieces. */
export const tSegments = (key, values = {}) => {
  const phrase = t(key, values);
  const segments = [];
  let position = 0;
  for (const match of phrase.matchAll(RICH_PATTERN)) {
    if (match.index > position) segments.push({ text: phrase.slice(position, match.index) });
    if (match[3]) segments.push({ text: match[3], bold: true });
    else segments.push({ text: match[1], link: match[2] });
    position = match.index + match[0].length;
  }
  if (position < phrase.length) segments.push({ text: phrase.slice(position) });
  return segments;
};

/** Lets a component show phrases and follow along when the language changes. */
export const useTranslation = () => {
  const code = useSyncExternalStore(subscribe, getCode, getCode);
  return { code, t, tList, tSegments, setLanguage, availableLanguages };
};

applyToDocument();
