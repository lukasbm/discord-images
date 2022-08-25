// export interface AnalyzeImage {
//   (url: string): ImageClassification;
// }

export interface ImageClassification {}

interface Concept {
  confidence: number;
  concept: string;
}

abstract class AnalyzeImage {
  abstract analyzeImage(url: string): ImageClassification;
}
