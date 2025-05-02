import React from 'react';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Image } from "@heroui/react";
import { Icon } from '@iconify/react';
import { initialParallaxSection } from '../data/mock-data';
import { ParallaxSection } from '../types/data-types';

export const ParallaxManager: React.FC = () => {
  const [parallaxSections, setParallaxSections] = React.useState<ParallaxSection[]>([initialParallaxSection]);
  const [currentSection, setCurrentSection] = React.useState<ParallaxSection | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [formData, setFormData] = React.useState({
    title: '',
    subtitle: '',
    description: '',
    backgroundUrl: '',
    buttonText: '',
    buttonUrl: '',
  });

  const handleAddNew = () => {
    setCurrentSection(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      backgroundUrl: '',
      buttonText: '',
      buttonUrl: '',
    });
    onOpen();
  };

  const handleEdit = (section: ParallaxSection) => {
    setCurrentSection(section);
    setFormData({
      title: section.title,
      subtitle: section.subtitle,
      description: section.description,
      backgroundUrl: section.backgroundUrl,
      buttonText: section.buttonText,
      buttonUrl: section.buttonUrl,
    });
    onOpen();
  };

  const handleDelete = (id: string) => {
    setParallaxSections(parallaxSections.filter(section => section.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (formData.title && formData.description && formData.backgroundUrl) {
      if (currentSection) {
        // Update existing section
        setParallaxSections(parallaxSections.map(section => 
          section.id === currentSection.id ? { 
            ...section, 
            ...formData,
          } : section
        ));
      } else {
        // Add new section
        const newSection: ParallaxSection = {
          id: Date.now().toString(),
          ...formData,
        };
        setParallaxSections([...parallaxSections, newSection]);
      }
      onClose();
    }
  };

  // Generate a random background image URL for the form
  const generateRandomBackground = () => {
    const categories = ['landscape', 'places', 'ai'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomId = Math.floor(Math.random() * 100);
    const imageUrl = `https://img.heroui.chat/image/${randomCategory}?w=1920&h=1080&u=${randomId}`;
    
    setFormData({
      ...formData,
      backgroundUrl: imageUrl,
    });
  };

  return (
    <div className="py-5">
      <Card className="bg-beige dark:bg-[#1f1f1f]">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-woodBrown dark:text-lightWood">Parallax Sections</h2>
          <Button 
            color="primary" 
            endContent={<Icon icon="lucide:plus" />}
            onPress={handleAddNew}
          >
            Add New Section
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="Parallax sections table">
            <TableHeader>
              <TableColumn>BACKGROUND</TableColumn>
              <TableColumn>TITLE</TableColumn>
              <TableColumn>CONTENT</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {parallaxSections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell>
                    <Image
                      src={section.backgroundUrl}
                      alt={section.title}
                      className="w-24 h-16 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{section.title}</p>
                      <p className="text-sm text-default-500">{section.subtitle}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="truncate max-w-xs">{section.description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Tooltip content="Edit section">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          onPress={() => handleEdit(section)}
                        >
                          <Icon icon="lucide:edit" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete section" color="danger">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          color="danger"
                          onPress={() => handleDelete(section.id)}
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
              <ModalHeader>{currentSection ? 'Edit Parallax Section' : 'Add New Parallax Section'}</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Input
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Section title"
                      variant="bordered"
                    />
                    
                    <Input
                      label="Subtitle"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      placeholder="Section subtitle"
                      variant="bordered"
                    />
                    
                    <Textarea
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Section description"
                      variant="bordered"
                      minRows={3}
                    />
                    
                    <div className="flex gap-2">
                      <Input
                        label="Button Text"
                        name="buttonText"
                        value={formData.buttonText}
                        onChange={handleInputChange}
                        placeholder="e.g. Learn More"
                        variant="bordered"
                        className="flex-1"
                      />
                      
                      <Input
                        label="Button URL"
                        name="buttonUrl"
                        value={formData.buttonUrl}
                        onChange={handleInputChange}
                        placeholder="#section or https://..."
                        variant="bordered"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-end gap-2">
                      <Input
                        label="Background Image URL"
                        name="backgroundUrl"
                        value={formData.backgroundUrl}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        variant="bordered"
                        className="flex-1"
                      />
                      <Button 
                        color="primary" 
                        variant="flat"
                        onPress={generateRandomBackground}
                      >
                        Generate
                      </Button>
                    </div>
                    
                    {formData.backgroundUrl && (
                      <div className="mt-2">
                        <p className="text-sm mb-2">Preview:</p>
                        <div className="border rounded-lg overflow-hidden">
                          <Image
                            src={formData.backgroundUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Preview of Parallax Effect:</p>
                      <div 
                        className="h-40 rounded-lg overflow-hidden relative flex items-center justify-center"
                        style={{
                          backgroundImage: `url(${formData.backgroundUrl || 'https://img.heroui.chat/image/landscape?w=1920&h=1080&u=1'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                        <div className="relative text-center text-white p-4">
                          <h3 className="text-xl font-bold">{formData.title || 'Section Title'}</h3>
                          <p className="text-sm mt-1">{formData.subtitle || 'Section Subtitle'}</p>
                          {formData.buttonText && (
                            <Button 
                              size="sm" 
                              color="primary" 
                              className="mt-2"
                            >
                              {formData.buttonText}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  {currentSection ? 'Update' : 'Add'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};