import React, { useState } from 'react';
import { Wallpaper } from '../types';
import { Download, Maximize2, Trash2, Copy, Check } from 'lucide-react';
import { Button } from './Button';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onDelete: (id: string) => void;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({ wallpaper, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = wallpaper.url;
    link.download = `wallgen-${wallpaper.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(wallpaper.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine aspect ratio class for the card display to avoid weird stretching
  const getAspectRatioClass = () => {
      switch(wallpaper.aspectRatio) {
          case '9:16': return 'aspect-[9/16]';
          case '16:9': return 'aspect-video';
          case '1:1': return 'aspect-square';
          case '4:3': return 'aspect-[4/3]';
          case '3:4': return 'aspect-[3/4]';
          default: return 'aspect-square';
      }
  };

  return (
    <>
      <div 
        className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-lg transition-all hover:shadow-purple-500/10 hover:border-zinc-700"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className={`w-full overflow-hidden bg-zinc-950 relative ${getAspectRatioClass()}`}>
          <img 
            src={wallpaper.url} 
            alt={wallpaper.prompt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Overlay Actions */}
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button variant="primary" onClick={handleDownload} icon={<Download className="w-4 h-4"/>}>
              Download
            </Button>
            <Button variant="secondary" onClick={() => setIsPreviewOpen(true)} icon={<Maximize2 className="w-4 h-4"/>}>
              Preview
            </Button>
          </div>
        </div>

        {/* Info Footer */}
        <div className="p-3 bg-zinc-900 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 truncate mb-2 font-mono">
            {new Date(wallpaper.createdAt).toLocaleDateString()}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              {wallpaper.style}
            </span>
            <div className="flex gap-1">
               <button 
                onClick={handleCopyPrompt}
                className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Copy Prompt"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={() => onDelete(wallpaper.id)}
                className="p-1.5 rounded-md hover:bg-red-900/30 text-zinc-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setIsPreviewOpen(false)}>
           <button 
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              onClick={() => setIsPreviewOpen(false)}
           >
              <Maximize2 className="w-8 h-8 rotate-45" /> {/* Use rotate to simulate close X if needed, or import X */}
           </button>
           <img 
             src={wallpaper.url} 
             alt={wallpaper.prompt} 
             className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
             onClick={(e) => e.stopPropagation()} 
           />
        </div>
      )}
    </>
  );
};