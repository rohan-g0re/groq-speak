import React from 'react';
import { DefinitionResponse } from '@/types/api';

interface DefinitionCardProps {
  definition: DefinitionResponse;
}

export const DefinitionCard: React.FC<DefinitionCardProps> = ({ definition }) => {
  const getSimilarityColor = (similarity: string) => {
    switch (similarity.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bmw-card p-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Word and Part of Speech */}
        <div className="flex items-baseline gap-4">
          <h2 className="text-3xl font-light text-bmw-dark">{definition.word}</h2>
          <span className="px-3 py-1 bg-bmw-light text-bmw-blue text-sm rounded-full font-medium">
            {definition.part_of_speech}
          </span>
        </div>

        {/* Definition */}
        <div className="space-y-2">
          <p className="text-lg text-bmw-dark leading-relaxed">{definition.definition}</p>
        </div>

        {/* Examples */}
        {definition.examples && definition.examples.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-bmw-gray">Examples</h3>
            <ul className="space-y-2">
              {definition.examples.map((example, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-bmw-blue text-xl leading-none">•</span>
                  <span className="text-bmw-dark">{example.sentence}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Synonyms */}
        {definition.synonyms && definition.synonyms.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-bmw-gray">Synonyms</h3>
            <div className="flex flex-wrap gap-2">
              {definition.synonyms.map((synonym, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getSimilarityColor(synonym.similarity)}`}
                >
                  {synonym.word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Confidence */}
        <div className="pt-4 border-t border-bmw-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-bmw-gray">Confidence</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-bmw-blue rounded-full transition-all duration-300"
                  style={{ width: `${definition.confidence * 100}%` }}
                />
              </div>
              <span className="text-bmw-dark font-medium">
                {Math.round(definition.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
