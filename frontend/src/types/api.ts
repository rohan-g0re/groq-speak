export interface DefinitionRequest {
  text: string;
  use_mock?: boolean;
}

export interface Example {
  sentence: string;
  context: string;
}

export interface Synonym {
  word: string;
  similarity: string;
}

export interface DefinitionResponse {
  word: string;
  part_of_speech: string;
  definition: string;
  examples: Example[];
  synonyms: Synonym[];
  confidence: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}
