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
  imageUrl: string;
  videoUrl?: string;
};

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
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
        imageUrl: doc.data().imageUrl || '',
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
      imageUrl: '', 
      videoUrl: '' 
    });
    onOpen();
  };

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      imageUrl: project.imageUrl,
      videoUrl: project.videoUrl || ''
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

  const handleSubmit = async () => {
    const { title, description, category, imageUrl, videoUrl } = formData;
    
    if (!title || !description || !category || !imageUrl) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (currentProject) {
        await updateDoc(doc(db, "Projects", currentProject.id), {
          title, 
          description, 
          category, 
          imageUrl, 
          videoUrl
        });
      } else {
        await addDoc(collection(db, "Projects"), {
          title, 
          description, 
          category, 
          imageUrl, 
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

  const generateRandomImage = () => {
    const randomId = Math.floor(Math.random() * 100);
    const imageUrl = `https://img.heroui.chat/image/places?w=800&h=600&u=${randomId}`;
    setFormData(prev => ({ ...prev, imageUrl }));
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
                <TableColumn>PROJECT</TableColumn>
                <TableColumn>CATEGORY</TableColumn>
                <TableColumn>DESCRIPTION</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-12 h-12 rounded-md object-cover" 
                        />
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
                        <Tooltip content="Edit project">
                          <Button 
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {currentProject ? 'Edit Project' : 'Add New Project'}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      label="Video URL (optional)"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/embed/..."
                      variant="bordered"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-end gap-2">
                      <Input
                        label="Image URL"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        variant="bordered"
                        className="flex-1"
                        isRequired
                      />
                      <Button 
                        color="primary" 
                        variant="flat" 
                        onPress={generateRandomImage}
                      >
                        Generate
                      </Button>
                    </div>
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <p className="text-sm mb-2">Preview:</p>
                        <div className="border rounded-lg overflow-hidden">
                          <Image 
                            src={formData.imageUrl} 
                            alt="Preview" 
                            className="w-full h-48 object-cover" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
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
    </div>
  );
};