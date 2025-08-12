import React, { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Toggle } from './Toggle';

interface SearchFormProps {
  onSubmit: (text: string, useMock: boolean) => void;
  isLoading: boolean;
  onReset: () => void;
  hasResults: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSubmit,
  isLoading,
  onReset,
  hasResults
}) => {
  const [text, setText] = useState('');
  const [useMock, setUseMock] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim(), useMock);
    }
  };

  const handleReset = () => {
    setText('');
    setUseMock(false);
    onReset();
  };

  const characterCount = text.length;
  const maxCharacters = 500;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="search-input" className="text-lg text-bmw-gray">
            Enter a word, phrase, or short text (max 500 characters)
          </label>
          <div className="relative">
            <textarea
              id="search-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="what next brotha"
              maxLength={maxCharacters}
              rows={4}
              className="bmw-input resize-none pr-12"
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3 text-sm text-bmw-gray">
              {characterCount} / {maxCharacters}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Toggle
            checked={useMock}
            onChange={setUseMock}
            label="Use mock response (dev default)"
          />
          
          <div className="flex gap-3">
            {hasResults && (
              <button
                type="button"
                onClick={handleReset}
                className="bmw-button-secondary flex items-center gap-2"
                disabled={isLoading}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className="bmw-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Defining...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Define
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
