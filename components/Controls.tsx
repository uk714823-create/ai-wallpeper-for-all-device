import React from 'react';
import { AspectRatio, WallpaperStyle } from '../types';
import { Wand2, Smartphone, Monitor, Square, Tablet, BoxSelect } from 'lucide-react';

interface ControlsProps {
  prompt: string;
  setPrompt: (value: string) => void;
  style: WallpaperStyle;
  setStyle: (value: WallpaperStyle) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (value: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  prompt,
  setPrompt,
  style,
  setStyle,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isGenerating
}) => {

  const aspectRatioOptions = [
    { value: AspectRatio.PORTRAIT, label: 'Phone', icon: <Smartphone className="w-4 h-4" /> },
    { value: AspectRatio.LANDSCAPE, label: 'Desktop', icon: <Monitor className="w-4 h-4" /> },
    { value: AspectRatio.SQUARE, label: 'Square', icon: <Square className="w-4 h-4" /> },
    { value: AspectRatio.TALL, label: 'Tablet (P)', icon: <Tablet className="w-4 h-4" /> },
    { value: AspectRatio.WIDE, label: 'Tablet (L)', icon: <BoxSelect className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Prompt Input */}
      <div className="space-y-2">
        <label htmlFor="prompt" className="block text-sm font-medium text-zinc-400">
          Describe your wallpaper
        </label>
        <div className="relative">
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic neon city with flying cars in the rain..."
            className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
            disabled={isGenerating}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Style Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-400">
            Art Style
          </label>
          <div className="relative">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as WallpaperStyle)}
              disabled={isGenerating}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none cursor-pointer"
            >
              {Object.values(WallpaperStyle).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-400">
            Size & Shape
          </label>
          <div className="grid grid-cols-5 gap-2">
            {aspectRatioOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setAspectRatio(option.value)}
                disabled={isGenerating}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                  aspectRatio === option.value
                    ? 'bg-zinc-800 border-purple-500 text-purple-400'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }`}
                title={option.label}
              >
                {option.icon}
                <span className="text-[10px] mt-1 font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-[1px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all bg-zinc-900 rounded-xl group-hover:bg-opacity-0">
          {isGenerating ? (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-white rounded-full animate-bounce mr-1"></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce mr-1 delay-75"></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
            </span>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Wallpaper
            </>
          )}
        </span>
      </button>

    </div>
  );
};