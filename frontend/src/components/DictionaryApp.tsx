import { useState } from 'react';
import { SearchForm } from './SearchForm';
import { DefinitionCard } from './DefinitionCard';
import { dictionaryApi } from '../services/api';
import { DefinitionResponse } from '../types/api';

export function DictionaryApp() {
  const [definition, setDefinition] = useState<DefinitionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (text: string, useMock: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await dictionaryApi.defineText({ text, use_mock: useMock });
      setDefinition(result);
    } catch (err) {
      console.error('Error fetching definition:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to get definition. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDefinition(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-bmw-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-light text-bmw-dark">AI Dictionary</h1>
            <p className="text-bmw-gray">
              Concise definitions via Groq — minimalist, BMW-inspired UI.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-12">
          <SearchForm
            onSubmit={handleSearch}
            isLoading={isLoading}
            onReset={handleReset}
            hasResults={!!definition}
          />

          {/* Error Message */}
          {error && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex-shrink-0 mt-0.5"></div>
                  <div>
                    <h3 className="text-red-800 font-medium">Error</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Definition Result */}
          {definition && !error && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <DefinitionCard definition={definition} />
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="max-w-4xl mx-auto">
              <div className="bmw-card p-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-8 h-8 border-4 border-bmw-blue border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-bmw-gray">Getting definition...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-white border-t border-bmw-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-bmw-gray">
            <p>Powered by Groq LLM • Built with React, TypeScript & Tailwind</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
