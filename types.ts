export interface Wallpaper {
  id: string;
  url: string;
  prompt: string;
  style: WallpaperStyle;
  aspectRatio: AspectRatio;
  createdAt: number;
}

export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT = "9:16",
  LANDSCAPE = "16:9",
  WIDE = "4:3", // Tablet landscape
  TALL = "3:4"  // Tablet portrait
}

export enum WallpaperStyle {
  REALISTIC = "Realistic",
  ANIME = "Anime",
  CYBERPUNK = "Cyberpunk",
  FANTASY = "Fantasy",
  ABSTRACT = "Abstract",
  OIL_PAINTING = "Oil Painting",
  MINIMALIST = "Minimalist",
  VAPORWAVE = "Vaporwave",
  NATURE = "Nature",
  SCI_FI = "Sci-Fi"
}

export interface GenerationParams {
  prompt: string;
  style: WallpaperStyle;
  aspectRatio: AspectRatio;
}