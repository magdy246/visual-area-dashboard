"use client"

import type React from "react"
import { Icon } from "@iconify/react"
import { Platform, PLATFORM_CONFIG } from "../types/platforms"

interface PlatformGridSelectorProps {
  selectedPlatform: Platform
  onPlatformChange: (platform: Platform) => void
}

export const PlatformGridSelector: React.FC<PlatformGridSelectorProps> = ({ selectedPlatform, onPlatformChange }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
      {Object.values(Platform).map((platform) => {
        const isSelected = platform === selectedPlatform
        const config = PLATFORM_CONFIG[platform]

        return (
          <button
            key={platform}
            onClick={() => onPlatformChange(platform)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-lg transition-all
              ${
                isSelected
                  ? "bg-gray-600 border-2 border-gray-600 shadow-lg scale-105"
                  : "bg-gray-900 border border-gray-800 hover:bg-gray-800"
              }
            `}
          >
            <Icon icon={config.icon} className="w-8 h-8 mb-2" style={{ color: config.brandColor }} />
            <span className="text-sm text-gray-200">{config.name}</span>
          </button>
        )
      })}
    </div>
  )
}
