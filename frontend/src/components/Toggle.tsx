import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="bmw-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          id="toggle"
        />
        <label htmlFor="toggle" className="flex items-center cursor-pointer">
          <div className="relative">
            <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ${
              checked ? 'bg-bmw-dark' : 'bg-gray-300'
            }`}>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ${
                checked ? 'transform translate-x-6' : ''
              }`}></div>
            </div>
          </div>
        </label>
      </div>
      <span className="text-sm text-bmw-gray">{label}</span>
    </div>
  );
};
