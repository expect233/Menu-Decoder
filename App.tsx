import React, { useState, useEffect } from 'react';
import DietaryPreferences from './components/DietaryPreferences';
import MenuUploader from './components/MenuUploader';
import AnalysisResults from './components/AnalysisResults';
import { analyzeMenu } from './services/geminiService';
import { DietaryRestriction, AnalysisState } from './types';
import { MOCK_LOADING_STEPS } from './constants';

const App: React.FC = () => {
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
  });

  // Handle image selection
  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
    setAnalysis({ isLoading: false, result: null, error: null }); // Reset previous results

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Loading animation logic
  useEffect(() => {
    let interval: number;
    if (analysis.isLoading) {
      setLoadingStep(0);
      interval = window.setInterval(() => {
        setLoadingStep((prev) => (prev < MOCK_LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [analysis.isLoading]);

  // Trigger Analysis
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalysis({ isLoading: true, result: null, error: null });

    try {
      const result = await analyzeMenu(selectedFile, restrictions);
      setAnalysis({ isLoading: false, result, error: null });
    } catch (err: any) {
      setAnalysis({
        isLoading: false,
        result: null,
        error: err.message || "無法分析菜單，請稍後再試。",
      });
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setAnalysis({ isLoading: false, result: null, error: null });
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-orange-100 selection:text-orange-900 pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🍜</span>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">異國菜單點餐顧問</h1>
          </div>
          <div className="text-xs text-gray-400 font-mono hidden sm:block">
            Powered by Gemini
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Input & Settings */}
        <div className="md:col-span-5 space-y-6">
          <MenuUploader 
            imagePreview={imagePreview} 
            onImageSelected={handleImageSelected}
            onClear={handleClear}
          />
          
          <DietaryPreferences 
            selected={restrictions} 
            onChange={setRestrictions} 
          />

          {/* Action Button */}
          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || analysis.isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
              !selectedFile || analysis.isLoading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-500/30'
            }`}
          >
            {analysis.isLoading ? '分析中...' : '🔍 分析菜單並推薦'}
          </button>

          {/* Loading Indicator */}
          {analysis.isLoading && (
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100 animate-pulse">
              <div className="flex justify-center mb-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
              <p className="text-orange-800 font-medium">{MOCK_LOADING_STEPS[loadingStep]}</p>
            </div>
          )}

          {/* Error Message */}
          {analysis.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <p className="font-bold">發生錯誤</p>
              <p className="text-sm">{analysis.error}</p>
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="md:col-span-7">
          {!analysis.result && !analysis.isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-100 rounded-xl min-h-[400px]">
              <div className="text-6xl mb-4 opacity-20">🍽️</div>
              <p className="text-center">
                上傳菜單照片並點擊分析<br/>
                AI 將為您翻譯、避雷並推薦美食
              </p>
            </div>
          )}

          {analysis.result && (
            <AnalysisResults data={analysis.result} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;