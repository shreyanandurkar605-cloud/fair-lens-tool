export type BiasCategory = "gender" | "age" | "culture" | "ability" | "exclusionary";

export interface BiasMatch {
  word: string;
  index: number;
  length: number;
  category: BiasCategory;
  explanation: string;
  suggestion: string;
}

export interface AnalysisResult {
  matches: BiasMatch[];
  score: number;
  totalWords: number;
}

interface BiasRule {
  pattern: RegExp;
  category: BiasCategory;
  explanation: string;
  suggestion: string;
}

const RULES: BiasRule[] = [
  // Gender-coded
  { pattern: /\b(rockstar|ninja|guru|wizard)\b/gi, category: "gender", explanation: "Aggressive/masculine-coded language that may discourage women applicants.", suggestion: "expert, specialist, professional" },
  { pattern: /\b(aggressive|dominant|competitive|fearless)\b/gi, category: "gender", explanation: "Masculine-coded trait shown to reduce female applications.", suggestion: "driven, motivated, results-oriented" },
  { pattern: /\b(he|his|him)\b/gi, category: "gender", explanation: "Gendered pronoun—use neutral language.", suggestion: "they, their, them" },
  { pattern: /\b(she|hers|her)\b/gi, category: "gender", explanation: "Gendered pronoun—use neutral language.", suggestion: "they, their, them" },
  { pattern: /\b(salesman|chairman|foreman|manpower|mankind)\b/gi, category: "gender", explanation: "Gendered job/role term.", suggestion: "salesperson, chairperson, supervisor, workforce, humankind" },
  { pattern: /\b(strong|assertive|decisive|ambitious)\b/gi, category: "gender", explanation: "Masculine-coded word per linguistic studies.", suggestion: "capable, confident, goal-focused" },

  // Age
  { pattern: /\b(young|youthful|energetic|recent grad(uate)?|digital native)\b/gi, category: "age", explanation: "May discriminate against older candidates.", suggestion: "enthusiastic, motivated, tech-savvy" },
  { pattern: /\b(seasoned|mature)\b/gi, category: "age", explanation: "May discourage younger applicants.", suggestion: "experienced, skilled" },

  // Culture / fit
  { pattern: /\b(culture fit|cultural fit)\b/gi, category: "culture", explanation: "Vague and often used to justify biased decisions.", suggestion: "values alignment, culture add" },
  { pattern: /\b(native (english )?speaker)\b/gi, category: "culture", explanation: "Excludes fluent non-native speakers; may violate equal opportunity laws.", suggestion: "strong English communication skills" },
  { pattern: /\b(rock ?star|10x)\b/gi, category: "culture", explanation: "Hype language that signals an exclusionary culture.", suggestion: "high-performing professional" },

  // Ability
  { pattern: /\b(walk|stand|see|hear) (around|all day|clearly)\b/gi, category: "ability", explanation: "May exclude people with disabilities; specify only true essential functions.", suggestion: "describe the actual essential job function" },
  { pattern: /\b(able-bodied|hands-on)\b/gi, category: "ability", explanation: "Ableist phrasing.", suggestion: "actively involved, practical" },

  // Exclusionary
  { pattern: /\b(must have \d+\+? years)\b/gi, category: "exclusionary", explanation: "Rigid year requirements deter qualified candidates.", suggestion: "demonstrated experience in…" },
  { pattern: /\b(overqualified|underqualified)\b/gi, category: "exclusionary", explanation: "Subjective gatekeeping term.", suggestion: "describe specific required skills" },
];

const CATEGORY_WEIGHT: Record<BiasCategory, number> = {
  gender: 6,
  age: 6,
  culture: 5,
  ability: 7,
  exclusionary: 4,
};

export function analyzeText(text: string): AnalysisResult {
  const matches: BiasMatch[] = [];
  const seen = new Set<string>();

  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = rule.pattern.exec(text)) !== null) {
      const key = `${m.index}-${m[0].toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      matches.push({
        word: m[0],
        index: m.index,
        length: m[0].length,
        category: rule.category,
        explanation: rule.explanation,
        suggestion: rule.suggestion,
      });
    }
  }

  matches.sort((a, b) => a.index - b.index);

  const totalWords = text.trim().split(/\s+/).filter(Boolean).length || 1;
  let penalty = 0;
  for (const m of matches) penalty += CATEGORY_WEIGHT[m.category];
  // Normalize penalty against text length so short texts aren't unfairly punished.
  const density = penalty / Math.max(totalWords / 50, 1);
  const score = Math.max(0, Math.min(100, Math.round(100 - density)));

  return { matches, score, totalWords };
}

export const CATEGORY_META: Record<BiasCategory, { label: string; color: string }> = {
  gender: { label: "Gender", color: "google-blue" },
  age: { label: "Age", color: "google-yellow" },
  culture: { label: "Culture", color: "google-red" },
  ability: { label: "Ability", color: "google-green" },
  exclusionary: { label: "Exclusionary", color: "google-red" },
};
