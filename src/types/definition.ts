export type Definition = {
  term: string;
  definition: string;
  partOfSpeech: string;
  examples: string[];
  synonyms: string[];
};

export type DefineResponse = {
  success: boolean;
  data: Definition;
};
