export interface AnalyzeImage {
  (url: string): ImageAnalysis;
}

interface Classification {
  label: string;
  confidence: number;
}

export type ImageAnalysis = Classification[];
