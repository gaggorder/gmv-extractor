import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { AppState, ImageFile } from './types';
import { extractGmvData } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (file: ImageFile) => {
    setSelectedImage(file);
    setAppState(AppState.IDLE);
    setResult('');
    setError(null);
  };

  const handleExtraction = async () => {
    if (!selectedImage) return;

    setAppState(AppState.PROCESSING);
    setError(null);

    try {
      const extractedText = await extractGmvData(selectedImage.base64, selectedImage.mimeType);
      setResult(extractedText);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      setAppState(AppState.ERROR);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">GMV Summary Generator</h2>
          <p className="mt-2 text-slate-600 max-w-3xl">
            Upload your monthly GMV performance screenshot. This tool extracts Total, Elite, Enterprise, and Pro figures and formats them into a standardized bullet-point report including month-over-month and year-over-year comparisons.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[600px]">
          {/* Left Column: Input */}
          <div className="h-full">
            <ImageUploader 
              onImageSelected={handleImageSelected} 
              selectedImage={selectedImage}
              isProcessing={appState === AppState.PROCESSING}
            />
          </div>

          {/* Right Column: Output */}
          <div className="h-full">
            <ResultDisplay 
              appState={appState}
              result={result}
              error={error}
              onExtract={handleExtraction}
              isImageSelected={!!selectedImage}
            />
          </div>
        </div>

        {/* Footer info/Tips */}
        <div className="mt-12 pt-8 border-t border-slate-200">
           <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Tips for Best Results</h3>
           <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
             <li className="flex items-start">
               <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
               Ensure the "Confirmed GMV", "Elite", "Enterprise", and "Pro" rows are visible.
             </li>
             <li className="flex items-start">
               <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
               Include the table header row containing the dates (e.g., "12/1/25 to ...") for accurate title generation.
             </li>
             <li className="flex items-start">
               <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
               Use a clear screenshot with good resolution.
             </li>
           </ul>
        </div>

      </main>
    </div>
  );
};

export default App;