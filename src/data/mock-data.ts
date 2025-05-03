import { SocialLink, Project, PricingPlan, ParallaxSection, ContactInfo } from '../types/data-types';

export const initialSocialLinks: SocialLink[] = [
  {
    id: '1',
    platform: 'Instagram',
    url: 'https://instagram.com/visualarea',
    icon: 'logos:instagram-icon',
  },
  {
    id: '2',
    platform: 'Facebook',
    url: 'https://facebook.com/visualarea',
    icon: 'logos:facebook',
  },
  {
    id: '3',
    platform: 'Twitter',
    url: 'https://twitter.com/visualarea',
    icon: 'logos:twitter',
  },
  {
    id: '4',
    platform: 'YouTube',
    url: 'https://youtube.com/visualarea',
    icon: 'logos:youtube-icon',
  },
];

export const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Wedding Photography',
    description: 'Capturing beautiful moments on your special day',
    category: 'Photography',
    imageUrl: 'https://img.heroui.chat/image/places?w=800&h=600&u=1',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'Corporate Video',
    description: 'Professional video production for businesses',
    category: 'Video',
    imageUrl: 'https://img.heroui.chat/image/ai?w=800&h=600&u=2',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '3',
    title: 'Product Photography',
    description: 'Showcase your products with stunning visuals',
    category: 'Photography',
    imageUrl: 'https://img.heroui.chat/image/fashion?w=800&h=600&u=3',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '4',
    title: 'Music Video',
    description: 'Creative music video production',
    category: 'Video',
    imageUrl: 'https://img.heroui.chat/image/album?w=800&h=600&u=4',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];

export const initialPricingPlans: PricingPlan[] = [
  {
    id: '1',
    title: 'Basic Package',
    price: 499,
    currency: '$',
    period: 'per project',
    features: [
      '4 Hours of Coverage',
      '100 Digital Images',
      'Online Gallery',
      'Basic Editing',
    ],
    isPopular: false,
    backgroundColor: '#f9eadb',
  },
  {
    id: '2',
    title: 'Standard Package',
    price: 999,
    currency: '$',
    period: 'per project',
    features: [
      '8 Hours of Coverage',
      '300 Digital Images',
      'Online Gallery',
      'Advanced Editing',
      'One Photographer',
    ],
    isPopular: true,
    backgroundColor: '#ebc08f',
  },
  {
    id: '3',
    title: 'Premium Package',
    price: 1999,
    currency: '$',
    period: 'per project',
    features: [
      'Full Day Coverage',
      'Unlimited Digital Images',
      'Online Gallery',
      'Premium Editing',
      'Two Photographers',
      'Printed Photo Album',
    ],
    isPopular: false,
    backgroundColor: '#deb887',
  },
];

export const initialParallaxSection: ParallaxSection = {
  id: '1',
  title: 'Capture Your Moments',
  backgroundUrl: 'https://img.heroui.chat/image/landscape?w=1920&h=1080&u=5',
};

export const initialContactInfo: ContactInfo[] = [
  {
    id: '1',
    type: 'address',
    label: 'Main Office',
    value: '123 Photography Lane, Visual City, VC 12345',
    icon: 'lucide:map-pin',
    isMain: true,
  },
  {
    id: '2',
    type: 'phone',
    label: 'Customer Support',
    value: '+1 (555) 123-4567',
    icon: 'lucide:phone',
    isMain: true,
  },
  {
    id: '3',
    type: 'email',
    label: 'General Inquiries',
    value: 'info@visualarea.com',
    icon: 'lucide:mail',
    isMain: true,
  }
];