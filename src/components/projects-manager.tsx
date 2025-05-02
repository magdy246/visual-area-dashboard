import React from 'react';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Image, Chip } from "@heroui/react";
import { Icon } from '@iconify/react';
import { initialProjects } from '../data/mock-data';
import { Project } from '../types/data-types';

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = React.useState<Project[]>(initialProjects);
  const [currentProject, setCurrentProject] = React.useState<Project | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    videoUrl: '',
  });

  const categories = ["Photography", "Video", "Design", "Animation"];

  const handleAddNew = () => {
    setCurrentProject(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      imageUrl: '',
      videoUrl: '',
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
      videoUrl: project.videoUrl || '',
    });
    onOpen();
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleSubmit = () => {
    if (formData.title && formData.description && formData.category) {
      if (currentProject) {
        // Update existing project
        setProjects(projects.map(project => 
          project.id === currentProject.id ? { 
            ...project, 
            ...formData,
            videoUrl: formData.videoUrl || undefined
          } : project
        ));
      } else {
        // Add new project
        const newProject: Project = {
          id: Date.now().toString(),
          ...formData,
          videoUrl: formData.videoUrl || undefined
        };
        setProjects([...projects, newProject]);
      }
      onClose();
    }
  };

  // Generate a random image URL for the form
  const generateRandomImage = () => {
    const categories = ['places', 'fashion', 'ai', 'album'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomId = Math.floor(Math.random() * 100);
    const imageUrl = `https://img.heroui.chat/image/${randomCategory}?w=800&h=600&u=${randomId}`;
    
    setFormData({
      ...formData,
      imageUrl,
    });
  };

  return (
    <div className="py-5">
      <Card className="bg-beige dark:bg-[#1f1f1f]">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-woodBrown dark:text-lightWood">Projects</h2>
          <Button 
            color="primary" 
            endContent={<Icon icon="lucide:plus" />}
            onPress={handleAddNew}
          >
            Add New Project
          </Button>
        </CardHeader>
        <CardBody>
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
                    <Chip color="primary" variant="flat">{project.category}</Chip>
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
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{currentProject ? 'Edit Project' : 'Add New Project'}</ModalHeader>
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
                    />
                    
                    <Select
                      label="Category"
                      placeholder="Select a category"
                      selectedKeys={formData.category ? [formData.category] : []}
                      onChange={(e) => handleSelectChange(e.target.value)}
                      variant="bordered"
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