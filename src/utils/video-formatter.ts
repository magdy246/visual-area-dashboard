import { Platform, PLATFORM_CONFIG } from "../types/platforms"

export function getEmbedUrl(url: string, platform: Platform): string {
  if (!url) return ""

  // If it's already an embed URL, return as-is
  if (url.includes("embed")) return url

  const platformConfig = PLATFORM_CONFIG[platform]

  if (!platformConfig) {
    console.error(`Platform ${platform} not supported`)
    return url
  }

  // Extract content type and ID based on platform
  const contentInfo = platformConfig.extractContentInfo(url)

  if (!contentInfo) {
    console.warn(`Could not extract content info from URL: ${url}`)
    return url
  }

  // Generate embed URL based on content type and ID
  return platformConfig.embedUrl(contentInfo)
}

export function getThumbnailUrl(url: string, platform: Platform): string | null {
  if (!url) return null

  const platformConfig = PLATFORM_CONFIG[platform]

  if (!platformConfig) {
    console.error(`Platform ${platform} not supported`)
    return null
  }

  // Extract content type and ID based on platform
  const contentInfo = platformConfig.extractContentInfo(url)

  if (!contentInfo) {
    console.warn(`Could not extract content info from URL: ${url}`)
    return null
  }

  // Generate thumbnail URL based on content type and ID
  return platformConfig.thumbnailUrl(contentInfo)
}

export function validateUrl(url: string, platform: Platform): boolean {
  if (!url) return false

  const platformConfig = PLATFORM_CONFIG[platform]

  if (!platformConfig) {
    console.error(`Platform ${platform} not supported`)
    return false
  }

  // Check if URL matches any of the platform's regex patterns
  return platformConfig.regexPatterns.some((pattern) => pattern.test(url))
}

export function getPlatformFromUrl(url: string): Platform | null {
  if (!url) return null;

  const platformOrder: Platform[] = [
    Platform.FACEBOOK,
    Platform.INSTAGRAM,
    Platform.TIKTOK,
    Platform.YOUTUBE,
  ];

  for (const platform of platformOrder) {
    const platformConfig = PLATFORM_CONFIG[platform];
    if (platformConfig.regexPatterns.some((pattern) => pattern.test(url))) {
      return platform;
    }
  }

  return null;
}
