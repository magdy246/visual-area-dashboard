import React, { useEffect, useState } from 'react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Card, CardBody, CardHeader, Button, Input, Textarea,
  Select, SelectItem, Table, TableHeader, TableColumn,
  TableBody, TableRow, TableCell, Tooltip, Modal,
  ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Image, Chip, Spinner
} from "@heroui/react";
import { Icon } from '@iconify/react';

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
};

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onOpenChange: onViewOpenChange,
  } = useDisclosure();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    videoUrl: '',
  });

  const categories = ["Video", "Real"];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Projects"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || '',
        description: doc.data().description || '',
        category: doc.data().category || '',
        videoUrl: doc.data().videoUrl || ''
      })) as Project[];
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddNew = () => {
    setCurrentProject(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      videoUrl: ''
    });
    onOpen();
  };

  const handleView = (project: Project) => {
    setCurrentProject(project);
    onViewOpen();
  };

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      videoUrl: project.videoUrl
    });
    onOpen();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "Projects", id));
        fetchProjects();
      } catch (err) {
        console.error("Error deleting project:", err);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
  };

  const convertToEmbedUrl = (url: string): string => {
    if (!url) return '';
    // If it's already an embed URL, return as-is
    if (url.includes('embed')) return url;
    
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // For other video URLs, try to return them directly
    return url;
  };

  const getThumbnailUrl = (videoUrl: string): string => {
    if (!videoUrl) return '';
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = videoUrl.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    return '';
  };

  const handleSubmit = async () => {
    const { title, description, category, videoUrl } = formData;

    if (!title || !description || !category || !videoUrl) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (currentProject) {
        await updateDoc(doc(db, "Projects", currentProject.id), {
          title,
          description,
          category,
          videoUrl
        });
      } else {
        await addDoc(collection(db, "Projects"), {
          title,
          description,
          category,
          videoUrl
        });
      }
      onClose();
      fetchProjects();
    } catch (err) {
      console.error("Error submitting project:", err);
      alert("Error saving project. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="py-5">
      <Card className="bg-beige dark:bg-[#1f1f1f]">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-woodBrown dark:text-lightWood">Projects</h2>
          <Button color="primary" endContent={<Icon icon="lucide:plus" />} onPress={handleAddNew}>
            Add New Project
          </Button>
        </CardHeader>
        <CardBody>
          {projects.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No projects found. Add your first project!
            </div>
          ) : (
            <Table aria-label="Projects table">
              <TableHeader>
                <TableColumn>THUMBNAIL</TableColumn>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>CATEGORY</TableColumn>
                <TableColumn>DESCRIPTION</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Image
                          src={getThumbnailUrl(project.videoUrl)}
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
                      <Chip
                        color={project.category === 'Video' ? 'primary' : 'success'}
                        variant="flat"
                      >
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
                            className='text-blue-600 dark:text-blue-400'
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
                            className='text-yellow-600 dark:text-yellow-400'
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
          )}
        </CardBody>
      </Card>

      {/* Edit/Add Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {currentProject ? 'Edit Project' : 'Add New Project'}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-4">
                    <Input
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Project title"
                      variant="bordered"
                      isRequired
                    />
                    <Select
                      label="Category"
                      placeholder="Select a category"
                      selectedKeys={formData.category ? [formData.category] : []}
                      onChange={handleSelectChange}
                      variant="bordered"
                      isRequired
                    >
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </Select>
                    <Textarea
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Project description"
                      variant="bordered"
                      minRows={3}
                      isRequired
                    />
                    <Input
                      label="Video URL"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                      variant="bordered"
                      isRequired
                    />
                  </div>
                  {formData.videoUrl && (
                    <div className="mt-4">
                      <p className="text-sm mb-2">Preview:</p>
                      <div className="rounded-lg overflow-hidden">
                        <Image
                          src={getThumbnailUrl(formData.videoUrl)}
                          alt="Video thumbnail"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  {currentProject ? 'Update' : 'Add'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange} size="2xl">
        <ModalContent>
          {(onViewClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {currentProject?.title}
                <Chip
                  color={currentProject?.category === 'Video' ? 'primary' : 'success'}
                  variant="flat"
                  size="sm"
                >
                  {currentProject?.category}
                </Chip>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 gap-6">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={convertToEmbedUrl(currentProject?.videoUrl || '')}
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
  );
};