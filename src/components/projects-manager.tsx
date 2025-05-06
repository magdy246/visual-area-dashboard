"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "../firebase"
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Spinner,
} from "@heroui/react"
import { Icon } from "@iconify/react"
import { Platform, type VideoContent } from "../types/platforms"
import { VideoForm } from "./video-form"
import { PlatformIcon } from "./platform-icon"
import { getEmbedUrl, getThumbnailUrl } from "../utils/video-formatter"

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<VideoContent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentProject, setCurrentProject] = useState<VideoContent | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const { isOpen: isViewOpen, onOpen: onViewOpen, onOpenChange: onViewOpenChange } = useDisclosure()

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, "Projects"))
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "",
        description: doc.data().description || "",
        category: doc.data().category || "Video",
        platform: doc.data().platform || Platform.YOUTUBE,
        videoUrl: doc.data().videoUrl || "",
      })) as VideoContent[]
      setProjects(data)
    } catch (err) {
      console.error("Error fetching projects:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleAddNew = () => {
    setCurrentProject(null)
    onOpen()
  }

  const handleView = (project: VideoContent) => {
    setCurrentProject(project)
    onViewOpen()
  }

  const handleEdit = (project: VideoContent) => {
    setCurrentProject(project)
    onOpen()
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "Projects", id))
        fetchProjects()
      } catch (err) {
        console.error("Error deleting project:", err)
      }
    }
  }

  const handleSubmit = async (formData: Omit<VideoContent, "id">) => {
    setFormLoading(true)
    try {
      if (currentProject) {
        await updateDoc(doc(db, "Projects", currentProject.id), {
          ...formData,
        })
      } else {
        await addDoc(collection(db, "Projects"), {
          ...formData,
        })
      }
      onClose()
      fetchProjects()
    } catch (err) {
      console.error("Error submitting project:", err)
      alert("Error saving project. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="py-5">
      <Card className="bg-beige dark:bg-[#1f1f1f] w-full">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-woodBrown dark:text-lightWood">Projects</h2>
          <Button color="primary" endContent={<Icon icon="lucide:plus" />} onPress={handleAddNew}>
            Add New Project
          </Button>
        </CardHeader>
        <CardBody>
          {projects.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No projects found. Add your first project!</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table aria-label="Projects table">
                <TableHeader>
                  <TableColumn>THUMBNAIL</TableColumn>
                  <TableColumn>TITLE</TableColumn>
                  <TableColumn>PLATFORM</TableColumn>
                  <TableColumn>CATEGORY</TableColumn>
                  <TableColumn>DESCRIPTION</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <img
                            src={getThumbnailUrl(project.videoUrl, project.platform) || "/placeholder.svg"}
                            alt={project.title}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">{project.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PlatformIcon platform={project.platform} withBackground />
                          <span>{project.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip color={project.category === "Video" ? "primary" : "success"} variant="flat">
                          {project.category}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <p className="truncate max-w-xs">{project.description}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Tooltip content="View project">
                            <Button
                              className="text-blue-600 dark:text-blue-400"
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => handleView(project)}
                            >
                              <Icon icon="lucide:eye" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Edit project">
                            <Button
                              className="text-yellow-600 dark:text-yellow-400"
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => handleEdit(project)}
                            >
                              <Icon icon="lucide:edit" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete project" color="danger">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="danger"
                              onPress={() => handleDelete(project.id)}
                            >
                              <Icon icon="lucide:trash" />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={{
          "@initial": "full",
          "@sm": "2xl",
        }}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{currentProject ? "Edit Project" : "Add New Project"}</ModalHeader>
              <ModalBody>
                <VideoForm
                  initialData={currentProject || undefined}
                  onSubmit={handleSubmit}
                  onCancel={onClose}
                  isLoading={formLoading}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onOpenChange={onViewOpenChange}
        size={{
          "@initial": "full",
          "@sm": "5xl",
        }}
      >
        <ModalContent>
          {(onViewClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={currentProject?.platform || Platform.YOUTUBE} withBackground />
                  <h3 className="text-xl font-semibold">{currentProject?.title}</h3>
                </div>
                <Chip color={currentProject?.category === "Video" ? "primary" : "success"} variant="flat" size="sm">
                  {currentProject?.category}
                </Chip>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 gap-6">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={currentProject ? getEmbedUrl(currentProject.videoUrl, currentProject.platform) : ""}
                      className="w-full h-96 rounded-lg"
                      title="Project video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="whitespace-pre-line">{currentProject?.description}</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onViewClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
