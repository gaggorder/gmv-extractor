import React, { useRef, useState, useCallback } from 'react';
import { ImageFile } from '../types.ts';

interface ImageUploaderProps {
  onImageSelected: (file: ImageFile) => void;
  selectedImage: ImageFile | null;
  isProcessing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const resultStr = e.target.result as string;
        // Extract base64 part and mime type
        const base64Data = resultStr.split(',')[1];
        const mimeType = resultStr.split(';')[0].split(':')[1];
        
        onImageSelected({
          base64: base64Data,
          mimeType: mimeType,
          previewUrl: resultStr
        });
      }
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
        <span className="bg-slate-100 text-slate-500 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border border-slate-200">1</span>
        Upload Source Image
      </h2>
      
      <div 
        className={`
          flex-grow border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out relative overflow-hidden min-h-[300px]
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-slate-400'}
          ${selectedImage ? 'border-solid border-slate-200' : ''}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onInputChange} 
          className="hidden" 
          accept="image/*"
        />

        {selectedImage ? (
          <div className="w-full h-full relative group">
            <img 
              src={selectedImage.previewUrl} 
              alt="Preview" 
              className="w-full h-full object-contain p-4"
            />
            {/* Overlay for change image */}
            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
               <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="bg-white text-slate-900 px-6 py-2 rounded-full font-medium shadow-lg hover:bg-slate-50 disabled:opacity-50 transform hover:scale-105 transition-all"
              >
                Change Image
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center h-full cursor-pointer p-8 text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-900 font-medium text-lg mb-1">Click to upload or drag and drop</p>
            <p className="text-slate-500 text-sm">Supports PNG, JPG, WEBP (Max 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};