import React from 'react';
import { AnalysisResponse } from '../types';

interface AnalysisResultsProps {
  data: AnalysisResponse;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  const renderStars = (score: number) => {
    return '⭐'.repeat(score);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="bg-orange-600 text-white p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </span>
          數位中文菜單
        </h2>
        <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase border border-gray-200">
          {data.cuisineType}
        </span>
      </div>

      {/* Digital Menu Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-500 font-semibold tracking-wider">
                <th className="p-4 w-1/4">原菜名 / 價格</th>
                <th className="p-4 w-1/4">中文菜名</th>
                <th className="p-4 w-1/3">內容物 / 口感解析</th>
                <th className="p-4 w-1/6 text-center">推薦</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.menuItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-orange-50/30 transition-colors group">
                  <td className="p-4 align-top">
                    <div className="font-bold text-gray-900">{item.originalName}</div>
                    <div className="text-sm font-mono text-orange-600 font-bold mt-1">{item.price}</div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="text-gray-900 font-medium">{item.translatedName}</div>
                  </td>
                  <td className="p-4 align-top">
                    <div className={`text-sm leading-relaxed ${item.ingredients.includes('🚫') ? 'text-red-600 font-medium bg-red-50 p-2 rounded-lg' : 'text-gray-600'}`}>
                      {item.ingredients}
                    </div>
                  </td>
                  <td className="p-4 align-top text-center whitespace-nowrap">
                    <span className="text-sm" title={`${item.score} / 5`}>
                      {renderStars(item.score)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.menuItems.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            無法辨識出特定菜色，請嘗試上傳更清晰的照片。
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 text-center">
        * 價格與翻譯僅供參考，請以現場菜單為準。推薦指數由 AI 生成。
      </div>
    </div>
  );
};

export default AnalysisResults;
