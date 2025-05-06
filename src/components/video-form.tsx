"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input, Textarea, Select, SelectItem, Button, Card, CardBody, Image } from "@heroui/react"
import { Icon } from "@iconify/react"
import { Platform, type VideoContent, PLATFORM_CONFIG } from "../types/platforms"
import { PlatformGridSelector } from "./platform-grid-selector"
import { getThumbnailUrl, validateUrl, getPlatformFromUrl } from "../utils/video-formatter"

interface VideoFormProps {
  initialData?: Partial<VideoContent>
  onSubmit: (data: Omit<VideoContent, "id">) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const VideoForm: React.FC<VideoFormProps> = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<Omit<VideoContent, "id">>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "Video",
    platform: initialData?.platform || Platform.YOUTUBE,
    videoUrl: initialData?.videoUrl || "",
  })

  const [urlError, setUrlError] = useState<string | null>(null)

  // Auto-detect platform from URL
  useEffect(() => {
    if (formData.videoUrl) {
      const detectedPlatform = getPlatformFromUrl(formData.videoUrl)
      if (detectedPlatform && detectedPlatform !== formData.platform) {
        setFormData((prev) => ({ ...prev, platform: detectedPlatform }))
      }
    }
  }, [formData.videoUrl])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear URL error when user types
    if (name === "videoUrl") {
      setUrlError(null)
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }))
  }

  const handlePlatformChange = (platform: Platform) => {
    setFormData((prev) => ({ ...prev, platform }))

    // Validate URL for the new platform
    if (formData.videoUrl) {
      if (!validateUrl(formData.videoUrl, platform)) {
        setUrlError(`This URL doesn't appear to be a valid ${PLATFORM_CONFIG[platform].name} URL`)
      } else {
        setUrlError(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.description || !formData.videoUrl) {
      alert("Please fill in all required fields")
      return
    }

    // Validate URL for the selected platform
    if (!validateUrl(formData.videoUrl, formData.platform)) {
      setUrlError(`This URL doesn't appear to be a valid ${PLATFORM_CONFIG[formData.platform].name} URL`)
      return
    }

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Video title"
          variant="bordered"
          isRequired
          className="w-full"
        />

        <Select
          label="Category"
          placeholder="Select a category"
          selectedKeys={formData.category ? [formData.category] : []}
          onChange={handleSelectChange}
          variant="bordered"
          isRequired
          className="w-full"
        >
          <SelectItem key="Video" value="Video">
            Video
          </SelectItem>
          <SelectItem key="Real" value="Real">
            Real
          </SelectItem>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Platform</label>
        <PlatformGridSelector selectedPlatform={formData.platform} onPlatformChange={handlePlatformChange} />
      </div>

      <Input
        label="Video URL"
        name="videoUrl"
        value={formData.videoUrl}
        onChange={handleInputChange}
        placeholder={`Paste ${PLATFORM_CONFIG[formData.platform].name} URL here`}
        variant="bordered"
        isRequired
        color={urlError ? "danger" : "default"}
        errorMessage={urlError}
        startContent={<Icon icon={PLATFORM_CONFIG[formData.platform].icon} className="text-default-400 w-5 h-5" />}
        className="w-full"
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Video description"
        variant="bordered"
        minRows={3}
        isRequired
        className="w-full"
      />

      {formData.videoUrl && !urlError && (
        <Card>
          <CardBody>
            <div className="space-y-2">
              <p className="text-sm font-medium">Preview:</p>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src={getThumbnailUrl(formData.videoUrl, formData.platform) || "/placeholder.svg"}
                  alt="Video thumbnail"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="flat" onPress={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button color="primary" type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          {initialData?.id ? "Update" : "Add"} Video
        </Button>
      </div>
    </form>
  )
}
