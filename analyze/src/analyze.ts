export interface AnalyzeImage {
  (url: string): any;
}

export interface ImageClassification {}

interface Concept {
  confidence: number;
  concept: string;
}
