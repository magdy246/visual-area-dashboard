import type React from "react"
import { Icon } from "@iconify/react"
import { type Platform, PLATFORM_CONFIG } from "../types/platforms"

interface PlatformIconProps {
  platform: Platform
  size?: "sm" | "md" | "lg"
  withBackground?: boolean
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = "md", withBackground = false }) => {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size]

  const platformConfig = PLATFORM_CONFIG[platform]

  if (!platformConfig) {
    return null
  }

  if (withBackground) {
    return (
      <div className={`flex items-center justify-center rounded-full ${platformConfig.bgColor} p-2`}>
        <Icon icon={platformConfig.icon} className={`${sizeClass} ${platformConfig.color}`} />
      </div>
    )
  }

  return <Icon icon={platformConfig.icon} className={`${sizeClass} ${platformConfig.color}`} />
}
