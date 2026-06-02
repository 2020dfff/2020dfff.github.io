export interface FootprintImage {
  src: string;
  category?: string;
  caption?: string;
}

export interface FootprintPoint {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  image?: string;
  images?: Array<string | FootprintImage>;
  caption?: string;
  category?: string;
  date?: string;
  preview?: boolean;
}

export interface FootprintsConfig {
  points: FootprintPoint[];
}
