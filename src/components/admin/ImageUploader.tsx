'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Image as ImageIcon, X, Link as LinkIcon, Check, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'banner' | 'auto';
  required?: boolean;
}

// Client-side image compression helper
async function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
    };
    reader.onerror = (err) => reject(err);
  });
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'صورة (Image)',
  helperText,
  aspectRatio = 'auto',
  required = false,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    setIsProcessing(true);
    try {
      const compressedDataUrl = await compressImage(file);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Error processing image:', err);
      // Fallback to raw data url
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    setIsProcessing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlApply = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="font-bold text-gray-700 text-xs block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              mode === 'upload' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            اختيار من الجهاز / موبايل
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              mode === 'url' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            رابط مباشر (URL)
          </button>
        </div>
      </div>

      {value ? (
        // Preview State
        <div className="relative group border-2 border-dashed border-gray-200 hover:border-brand-400 bg-gray-50 rounded-2xl p-2 transition-all">
          <div
            className={`relative w-full rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center ${
              aspectRatio === 'banner' ? 'h-36' : aspectRatio === 'square' ? 'h-36 max-w-36 mx-auto' : 'h-36'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-contain"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold gap-2 backdrop-blur-xs">
                <RefreshCw className="w-4 h-4 animate-spin" /> جاري معالجة الصورة...
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 px-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] font-bold text-[#0066b2] hover:text-[#005594] flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> تغيير الصورة
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="text-[11px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> إزالة الصورة
            </button>
          </div>
        </div>
      ) : mode === 'upload' ? (
        // Drag & Drop / File Pick Zone
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#0066b2] bg-blue-50/50 scale-[1.01]'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50/80 hover:bg-gray-100/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center text-[#0066b2]">
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-extrabold text-gray-800">
                اضغط هنا لاختيار الصورة من الموبايل أو الكمبيوتر
              </p>
              <p className="text-[10px] text-gray-400">
                أو اسحب الصورة وأفلتها هنا (يدعم JPG, PNG, WebP)
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Direct URL Input Mode
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="مثال: /images/uploads/product.jpg أو رابط https://..."
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="bg-black text-white hover:bg-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl shrink-0 transition-colors"
          >
            تطبيق
          </button>
        </div>
      )}

      {helperText && <p className="text-[9px] text-gray-400 mt-0.5">{helperText}</p>}
    </div>
  );
};
