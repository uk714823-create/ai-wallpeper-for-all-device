import React, { useState, useEffect } from 'react';
import { AspectRatio, Wallpaper, WallpaperStyle } from './types';
import { generateWallpaperImage } from './services/geminiService';
import { Controls } from './components/Controls';
import { WallpaperCard } from './components/WallpaperCard';
import { ImageIcon, AlertCircle } from 'lucide-react';

// Storage key
const STORAGE_KEY = 'wallgen_history';

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<WallpaperStyle>(WallpaperStyle.REALISTIC);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWallpapers(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load history", e);
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallpapers));
  }, [wallpapers]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateWallpaperImage(prompt, style, aspectRatio);
      
      const newWallpaper: Wallpaper = {
        id: crypto.randomUUID(),
        url: imageUrl,
        prompt: prompt,
        style: style,
        aspectRatio: aspectRatio,
        createdAt: Date.now()
      };

      setWallpapers(prev => [newWallpaper, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to generate wallpaper. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    setWallpapers(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-purple-500/30">
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-zinc-900 rounded-2xl border border-zinc-800 mb-4 shadow-lg shadow-purple-500/10">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
            WallGen AI
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Turn your imagination into stunning wallpapers. <br className="hidden md:inline"/> 
            Powered by Google Gemini 2.5 Flash.
          </p>
        </header>

        {/* Generator Controls */}
        <section className="mb-24">
          <Controls 
            prompt={prompt} 
            setPrompt={setPrompt} 
            style={style} 
            setStyle={setStyle}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
          
          {error && (
            <div className="mt-6 max-w-xl mx-auto p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-start gap-3 text-red-200">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </section>

        {/* Gallery */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-1 h-8 bg-purple-500 rounded-full"></span>
              Your Creations
            </h2>
            <span className="text-sm text-zinc-500">
              {wallpapers.length} {wallpapers.length === 1 ? 'wallpaper' : 'wallpapers'}
            </span>
          </div>

          {wallpapers.length === 0 ? (
            <div className="text-center py-24 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 mb-4 text-zinc-600">
                <ImageIcon className="w-8 h-8" />
              </div>
              <p className="text-zinc-500 text-lg">No wallpapers generated yet.</p>
              <p className="text-zinc-600 text-sm mt-2">Enter a prompt above to get started.</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {wallpapers.map((wp) => (
                <div key={wp.id} className="break-inside-avoid">
                  <WallpaperCard wallpaper={wp} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="py-8 text-center text-zinc-600 text-sm">
        <p>&copy; {new Date().getFullYear()} WallGen AI. Generated with Gemini API.</p>
      </footer>
    </div>
  );
}