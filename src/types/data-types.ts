export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
}

export interface PricingPlan {
  id: string;
  title: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  isPopular: boolean;
  backgroundColor: string;
}

export interface ParallaxSection {
  id: string;
  title: string;
  backgroundUrl: string;
}

export interface ContactInfo {
  id: string;
  type: 'address' | 'phone' | 'email';
  label: string;
  value: string;
  icon: string;
  isMain: boolean;
}