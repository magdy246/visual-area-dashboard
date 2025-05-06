import type React from "react"
import { Card, CardBody, Button } from "@heroui/react"
import { Icon } from "@iconify/react"
import type { VideoContent } from "../types/platforms"
import { getThumbnailUrl } from "../utils/video-formatter"
import { PlatformIcon } from "./platform-icon"
import { PLATFORM_CONFIG } from "../types/platforms"

interface VideoCardProps {
  video: VideoContent
  onClick: (video: VideoContent) => void
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const thumbnailUrl = getThumbnailUrl(video.videoUrl, video.platform)

  return (
    <Card isPressable onPress={() => onClick(video)} className="overflow-hidden">
      <CardBody className="p-0 overflow-hidden aspect-video">
        <div className="group relative w-full h-full overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl || "/placeholder.svg"}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="flex flex-col items-center justify-center">
                <Icon
                  icon={PLATFORM_CONFIG[video.platform].icon}
                  className="w-16 h-16 opacity-50"
                  style={{ color: PLATFORM_CONFIG[video.platform].brandColor }}
                />
                <p className="mt-2 text-sm text-gray-500">{video.title}</p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onPress={() => onClick(video)}
              isIconOnly
              color="primary"
              variant="shadow"
              radius="full"
              size="lg"
              className="scale-75 group-hover:scale-100 transition-transform duration-300"
            >
              <Icon icon="lucide:play" width={24} />
            </Button>
          </div>

          <div className="absolute top-2 right-2">
            <PlatformIcon platform={video.platform} withBackground size="sm" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white font-semibold">{video.title}</p>
            <div className="flex items-center gap-2">
              <p className="text-white/70 text-sm capitalize">{video.category}</p>
              <PlatformIcon platform={video.platform} size="sm" />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
