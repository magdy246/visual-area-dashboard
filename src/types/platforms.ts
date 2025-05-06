export enum Platform {
  YOUTUBE = "youtube",
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  TIKTOK = "tiktok",
}

export enum ContentType {
  VIDEO = "video",
  SHORT = "short",
  REEL = "reel",
  POST = "post",
  STORY = "story",
}

export interface ContentInfo {
  id: string
  type: ContentType
  channelId?: string
}

export interface VideoContent {
  id: string
  title: string
  description: string
  category: string
  platform: Platform
  videoUrl: string
}

// Platform configuration with icons and URL patterns
export const PLATFORM_CONFIG = {
  [Platform.YOUTUBE]: {
    name: "YouTube",
    icon: "logos:youtube-icon",
    color: "text-red-600",
    bgColor: "bg-red-100",
    brandColor: "#FF0000",
    regexPatterns: [
      // Standard YouTube video
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      // YouTube Shorts
      /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ],
    embedUrl: (contentInfo: ContentInfo) => {
      if (contentInfo.type === ContentType.SHORT) {
        return `https://www.youtube.com/embed/${contentInfo.id}?loop=1&playlist=${contentInfo.id}`;
      }
      return `https://www.youtube.com/embed/${contentInfo.id}`;
    },
    thumbnailUrl: (contentInfo: ContentInfo) => {
      return `https://img.youtube.com/vi/${contentInfo.id}/hqdefault.jpg`;
    },
    extractContentInfo: (url: string): ContentInfo | null => {
      const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch && shortsMatch[1]) {
        return {
          id: shortsMatch[1],
          type: ContentType.SHORT,
        };
      }

      const videoMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (videoMatch && videoMatch[1]) {
        return {
          id: videoMatch[1],
          type: ContentType.VIDEO,
        };
      }

      return null;
    },
  },
  [Platform.FACEBOOK]: {
    name: "Facebook",
    icon: "logos:facebook",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    brandColor: "#1877F2",
    previewImage: "/platform-previews/facebook-preview.jpg",
    regexPatterns: [
      // Facebook Reels (ID only)
      /(?:web\.|m\.)?facebook\.com\/reel\/(\d+)/,
      // Facebook Watch (video ID only)
      /(?:web\.|m\.)?facebook\.com\/watch\/?\?v=(\d+)/,
      // Facebook videos with username
      /(?:web\.|m\.)?facebook\.com\/([^/]+)\/videos\/(\d+)/,
      // Facebook share video links
      /(?:web\.|m\.)?facebook\.com\/share\/v\/([a-zA-Z0-9]+)/,
      // Facebook share reel links
      /(?:web\.|m\.)?facebook\.com\/share\/r\/([a-zA-Z0-9]+)/,
    ],
    // Update the Facebook platform config
    embedUrl: (contentInfo: ContentInfo) => {
      if (contentInfo.type === ContentType.REEL) {
        return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/${contentInfo.id}`;
      }
      return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch/?v=${contentInfo.id}`;
    },
    thumbnailUrl: () => null, // Facebook doesn't provide public thumbnails
    extractContentInfo: (url: string): ContentInfo | null => {
      const reelMatch = url.match(/facebook\.com\/reel\/(\d+)/);
      if (reelMatch) {
        return {
          id: reelMatch[1],
          type: ContentType.REEL,
        };
      }

      const watchMatch = url.match(/facebook\.com\/watch\/?\?v=(\d+)/);
      if (watchMatch) {
        return {
          id: watchMatch[1],
          type: ContentType.VIDEO,
        };
      }

      const videoMatch = url.match(/facebook\.com\/([^/]+)\/videos\/(\d+)/);
      if (videoMatch) {
        return {
          id: videoMatch[2],
          type: ContentType.VIDEO,
          channelId: videoMatch[1],
        };
      }

      const shareVideoMatch = url.match(/facebook\.com\/share\/v\/([a-zA-Z0-9]+)/);
      if (shareVideoMatch) {
        return {
          id: shareVideoMatch[1],
          type: ContentType.VIDEO,
        };
      }

      const shareReelMatch = url.match(/facebook\.com\/share\/r\/([a-zA-Z0-9]+)/);
      if (shareReelMatch) {
        return {
          id: shareReelMatch[1],
          type: ContentType.REEL,
        };
      }

      return null;
    },
  },
  [Platform.INSTAGRAM]: {
    name: "Instagram",
    icon: "skill-icons:instagram",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    brandColor: "#E4405F",
    regexPatterns: [
      // Instagram posts
      /instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
      // Instagram reels
      /instagram\.com\/reels?\/([a-zA-Z0-9_-]+)/,
    ],
    embedUrl: (contentInfo: ContentInfo) => {
      if (contentInfo.type === ContentType.REEL) {
        return `https://www.instagram.com/reel/${contentInfo.id}/embed/`
      }
      return `https://www.instagram.com/p/${contentInfo.id}/embed/`
    },
    thumbnailUrl: () => null, // Instagram doesn't provide easy access to thumbnails
    extractContentInfo: (url: string): ContentInfo | null => {
      // Check for Instagram Reels
      const reelsMatch = url.match(/instagram\.com\/reels?\/([a-zA-Z0-9_-]+)/)
      if (reelsMatch && reelsMatch[1]) {
        return {
          id: reelsMatch[1],
          type: ContentType.REEL,
        }
      }

      // Check for Instagram Posts
      const postMatch = url.match(/instagram\.com\/p\/([a-zA-Z0-9_-]+)/)
      if (postMatch && postMatch[1]) {
        return {
          id: postMatch[1],
          type: ContentType.POST,
        }
      }

      return null
    },
  },
  [Platform.TIKTOK]: {
    name: "TikTok",
    icon: "logos:tiktok-icon",
    color: "text-black",
    bgColor: "bg-gray-100",
    brandColor: "#000000",
    regexPatterns: [
      // TikTok videos
      /tiktok\.com\/@([^/]+)\/video\/(\d+)/,
      // TikTok short links
      /vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
    ],
    embedUrl: (contentInfo: ContentInfo) => {
      return `https://www.tiktok.com/embed/v2/${contentInfo.id}`
    },
    thumbnailUrl: () => null, // TikTok doesn't provide easy access to thumbnails
    extractContentInfo: (url: string): ContentInfo | null => {
      // Check for TikTok videos
      const videoMatch = url.match(/tiktok\.com\/@([^/]+)\/video\/(\d+)/)
      if (videoMatch && videoMatch[1] && videoMatch[2]) {
        return {
          id: videoMatch[2],
          type: ContentType.VIDEO,
          channelId: videoMatch[1],
        }
      }


      return null
    },
  },
}
