import type React from "react"
import { Tabs, Tab } from "@heroui/react"
import { Icon } from "@iconify/react"
import { Platform, PLATFORM_CONFIG } from "../types/platforms"

interface PlatformSelectorProps {
  selectedPlatform: Platform
  onPlatformChange: (platform: Platform) => void
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedPlatform, onPlatformChange }) => {
  return (
    <Tabs
      aria-label="Social Media Platforms"
      color="primary"
      variant="bordered"
      classNames={{
        tabList: "gap-2 w-full relative rounded-xl p-1 border border-divider",
        cursor: "w-full bg-primary",
        tab: "max-w-fit px-3 h-10 flex items-center gap-2",
        tabContent: "group-data-[selected=true]:text-primary",
      }}
      selectedKey={selectedPlatform}
      onSelectionChange={(key) => onPlatformChange(key as Platform)}
    >
      {Object.values(Platform).map((platform) => (
        <Tab
          key={platform}
          title={
            <div className="flex items-center gap-2">
              <Icon icon={PLATFORM_CONFIG[platform].icon} className="w-5 h-5" />
              <span>{PLATFORM_CONFIG[platform].name}</span>
            </div>
          }
        />
      ))}
    </Tabs>
  )
}
