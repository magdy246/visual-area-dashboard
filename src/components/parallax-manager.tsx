import React, { useEffect } from 'react';
import {
  Card, CardBody, CardHeader, Button, Input, Table, TableHeader, TableColumn,
  TableBody, TableRow, TableCell, Tooltip, Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, useDisclosure, Image, Spinner
} from "@heroui/react";
import { Icon } from '@iconify/react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

interface ParallaxSection {
  id: string;
  title: string;
  imageUrl: string;
}

export const ParallaxManager: React.FC = () => {
  const [parallaxSections, setParallaxSections] = React.useState<ParallaxSection[]>([]);
  const [currentSection, setCurrentSection] = React.useState<ParallaxSection | null>(null);
  const [viewingSection, setViewingSection] = React.useState<ParallaxSection | null>(null);
  const [loading, setLoading] = React.useState(true);
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditModalOpenChange,
    onClose: onEditModalClose
  } = useDisclosure();
  const {
    isOpen: isViewModalOpen,
    onOpen: onViewModalOpen,
    onOpenChange: onViewModalOpenChange,
    onClose: onViewModalClose
  } = useDisclosure();
  const [formData, setFormData] = React.useState({
    title: '',
    imageUrl: '',
  });

  const collectionRef = collection(db, "parallaxSection");

  // Fetch data from Firebase on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collectionRef);
        const data: ParallaxSection[] = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || '',
          imageUrl: doc.data().imageUrl || '',
        }));
        setParallaxSections(data);
      } catch (error) {
        console.error("Error fetching parallax sections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddNew = () => {
    setCurrentSection(null);
    setFormData({ title: '', imageUrl: '' });
    onEditModalOpen();
  };

  const handleEdit = (section: ParallaxSection) => {
    setCurrentSection(section);
    setFormData({
      title: section.title,
      imageUrl: section.imageUrl,
    });
    onEditModalOpen();
  };

  const handleView = (section: ParallaxSection) => {
    setViewingSection(section);
    onViewModalOpen();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "parallaxSection", id));
      setParallaxSections(prev => prev.filter(section => section.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.imageUrl) return;

    try {
      if (currentSection) {
        // Update existing document
        const docRef = doc(db, "parallaxSection", currentSection.id);
        await updateDoc(docRef, {
          title: formData.title,
          imageUrl: formData.imageUrl,
        });
        setParallaxSections(prev =>
          prev.map(s => s.id === currentSection.id ? {
            ...s,
            title: formData.title,
            imageUrl: formData.imageUrl
          } : s)
        );
      } else {
        // Add new document
        const newDoc = await addDoc(collectionRef, {
          title: formData.title,
          imageUrl: formData.imageUrl,
        });
        setParallaxSections(prev => [
          ...prev,
          {
            id: newDoc.id,
            title: formData.title,
            imageUrl: formData.imageUrl
          },
        ]);
      }
      onEditModalClose();
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  const generateRandomBackground = () => {
    const categories = ['landscape', 'places', 'ai'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomId = Math.floor(Math.random() * 100);
    const imageUrl = `https://img.heroui.chat/image/${randomCategory}?w=1920&h=1080&u=${randomId}`;
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
          <h2 className="text-xl font-semibold text-woodBrown dark:text-lightWood">Parallax Sections</h2>
          <Button color="primary" endContent={<Icon icon="lucide:plus" />} onPress={handleAddNew}>
            Add New Section
          </Button>
        </CardHeader>
        <CardBody>
          {parallaxSections.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No parallax sections found. Add your first section!
            </div>
          ) : (
            <Table
              aria-label="Parallax sections table"
              className="border-collapse w-full"
              removeWrapper
            >
              <TableHeader className="[&>tr]:first:shadow-sm">
                <TableColumn className="text-left py-3 px-4 font-semibold text-sm">
                  BACKGROUND
                </TableColumn>
                <TableColumn className="text-left py-3 px-4 font-semibold text-sm">
                  TITLE
                </TableColumn>
                <TableColumn className="text-right py-3 px-4 font-semibold text-sm">
                  ACTIONS
                </TableColumn>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                {parallaxSections.map((section) => (
                  <TableRow key={section.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center">
                        <Image
                          src={section.imageUrl}
                          alt={section.title}
                          className="w-24 h-16 rounded-md object-cover shadow-sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{section.title}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {section.imageUrl.length > 50
                            ? `${section.imageUrl.substring(0, 50)}...`
                            : section.imageUrl}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Tooltip content="View section">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleView(section)}
                            className="text-blue-600 dark:text-blue-400"
                          >
                            <Icon icon="lucide:eye" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Edit section">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleEdit(section)}
                            className="text-yellow-600 dark:text-yellow-400"
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
          )}
        </CardBody>
      </Card>

      {/* Edit/Add Modal */}
      <Modal isOpen={isEditModalOpen} onOpenChange={onEditModalOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {currentSection ? 'Edit Parallax Section' : 'Add New Parallax Section'}
              </ModalHeader>
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
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-end gap-2">
                      <Input
                        label="Background Image URL"
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
                        onPress={generateRandomBackground}
                      >
                        Generate
                      </Button>
                    </div>
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <p className="text-sm mb-2">Preview:</p>
                        <div className="rounded-lg overflow-hidden">
                          <Image
                            src={formData.imageUrl}
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
                          backgroundImage: `url(${formData.imageUrl || 'https://img.heroui.chat/image/landscape?w=1920&h=1080&u=1'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                        <div className="relative text-center text-white p-4">
                          <h3 className="text-xl font-bold">{formData.title || 'Section Title'}</h3>
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

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onOpenChange={onViewModalOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Icon icon="lucide:eye" className="text-blue-500" />
                View Parallax Section
              </ModalHeader>
              <ModalBody>
                {viewingSection && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Title</h4>
                        <p className="text-lg font-medium">{viewingSection.title}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Image URL</h4>
                        <p className="text-sm break-all">{viewingSection.imageUrl}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Image Preview</h4>
                      <div className="rounded-lg overflow-hidden">
                        <Image
                          src={viewingSection.imageUrl}
                          alt={viewingSection.title}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Parallax Effect Preview</h4>
                      <div
                        className="h-64 rounded-lg overflow-hidden relative flex items-center justify-center"
                        style={{
                          backgroundImage: `url(${viewingSection.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundAttachment: 'fixed',
                        }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                        <div className="relative text-center text-white p-4">
                          <h3 className="text-2xl font-bold">{viewingSection.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
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