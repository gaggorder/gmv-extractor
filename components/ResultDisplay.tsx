import React, { useState } from 'react';
import { AppState } from '../types.ts';

interface ResultDisplayProps {
  appState: AppState;
  result: string;
  error: string | null;
  onExtract: () => void;
  isImageSelected: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  appState, 
  result, 
  error, 
  onExtract,
  isImageSelected
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
        <span className="bg-slate-100 text-slate-500 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border border-slate-200">2</span>
        Generated Summary
      </h2>

      <div className="flex-grow bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col relative overflow-hidden min-h-[300px]">
        {appState === AppState.IDLE && (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="max-w-xs">Upload an image and click "Extract Data" to generate your GMV summary.</p>
            <button
              onClick={onExtract}
              disabled={!isImageSelected}
              className={`mt-6 px-6 py-2.5 rounded-lg font-semibold text-white transition-all shadow-md
                ${isImageSelected 
                  ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg translate-y-0' 
                  : 'bg-slate-300 cursor-not-allowed'}
              `}
            >
              Extract Data
            </button>
          </div>
        )}

        {appState === AppState.PROCESSING && (
          <div className="flex-grow flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-medium animate-pulse">Analyzing financial data...</p>
            <p className="text-slate-400 text-sm mt-2">This may take a few seconds.</p>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-slate-800 font-medium mb-2">Something went wrong</p>
            <p className="text-slate-500 text-sm mb-6 max-w-xs">{error}</p>
            <button
              onClick={onExtract}
              className="px-5 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {appState === AppState.SUCCESS && (
          <>
            <div className="flex-grow p-6 overflow-y-auto custom-scrollbar bg-slate-50">
               {/* We use whitespace-pre-wrap to preserve the formatting from the model */}
               <div className="font-mono text-sm sm:text-base text-slate-800 whitespace-pre-wrap leading-relaxed bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                 {result}
               </div>
            </div>
            <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={onExtract}
                className="text-indigo-600 font-medium text-sm hover:text-indigo-800"
              >
                Regenerate
              </button>
              <button
                onClick={handleCopy}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'}
                `}
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};