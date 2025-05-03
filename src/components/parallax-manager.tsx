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
  const [loading, setLoading] = React.useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
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
    onOpen();
  };

  const handleEdit = (section: ParallaxSection) => {
    setCurrentSection(section);
    setFormData({
      title: section.title,
      imageUrl: section.imageUrl,
    });
    onOpen();
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
      onClose();
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
            <Table aria-label="Parallax sections table">
              <TableHeader>
                <TableColumn>BACKGROUND</TableColumn>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {parallaxSections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell>
                      <Image 
                        src={section.imageUrl} 
                        alt={section.title} 
                        className="w-24 h-16 rounded-md object-cover" 
                      />
                    </TableCell>
                    <TableCell>
                      {section.title}
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
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
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
                        <div className="border rounded-lg overflow-hidden">
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
    </div>
  );
};