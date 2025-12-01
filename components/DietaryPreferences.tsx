import React from 'react';
import { DietaryRestriction } from '../types';
import { DIETARY_OPTIONS } from '../constants';

interface DietaryPreferencesProps {
  selected: DietaryRestriction[];
  onChange: (restrictions: DietaryRestriction[]) => void;
}

const DietaryPreferences: React.FC<DietaryPreferencesProps> = ({ selected, onChange }) => {
  const toggleRestriction = (restriction: DietaryRestriction) => {
    if (selected.includes(restriction)) {
      onChange(selected.filter((r) => r !== restriction));
    } else {
      onChange([...selected, restriction]);
    }
  };

  return (
    <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🚫</span> 飲食禁忌設定
      </h3>
      <div className="space-y-3">
        {DIETARY_OPTIONS.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => toggleRestriction(option.id)}
              className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
            />
            <span className="text-gray-700 font-medium group-hover:text-gray-900">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        * AI 將根據您的選擇，在分析結果中標示避雷指南。
      </p>
    </div>
  );
};

export default DietaryPreferences;