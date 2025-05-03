import React, { useEffect } from 'react';
import { 
  Card, CardBody, CardHeader, Button, Input, Table, TableHeader, TableColumn, 
  TableBody, TableRow, TableCell, Tooltip, Modal, ModalContent, ModalHeader, 
  ModalBody, ModalFooter, useDisclosure, Select, SelectItem, Checkbox, Spinner,
  Chip, Divider
} from "@heroui/react";
import { Icon } from '@iconify/react';
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc 
} from 'firebase/firestore';
import { db } from '../firebase';

interface ContactInfo {
  id: string;
  contactType: 'address' | 'phone' | 'email';
  label: string;
  content: string;
  isMain: boolean;
}

export const ContactManager: React.FC = () => {
  const [contacts, setContacts] = React.useState<ContactInfo[]>([]);
  const [currentContact, setCurrentContact] = React.useState<ContactInfo | null>(null);
  const [viewingContact, setViewingContact] = React.useState<ContactInfo | null>(null);
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
    contactType: 'address' as 'address' | 'phone' | 'email',
    label: '',
    content: '',
    isMain: false,
  });

  // Fetch contacts from Firebase
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contactUs'));
        const contactsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          contactType: doc.data().contactType || 'address',
          label: doc.data().label || '',
          content: doc.data().content || '',
          isMain: doc.data().isMain || false,
        })) as ContactInfo[];
        setContacts(contactsData);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleAddNew = () => {
    setCurrentContact(null);
    setFormData({
      contactType: 'address',
      label: '',
      content: '',
      isMain: false,
    });
    onEditModalOpen();
  };

  const handleEdit = (contact: ContactInfo) => {
    setCurrentContact(contact);
    setFormData({
      contactType: contact.contactType,
      label: contact.label,
      content: contact.content,
      isMain: contact.isMain,
    });
    onEditModalOpen();
  };

  const handleView = (contact: ContactInfo) => {
    setViewingContact(contact);
    onViewModalOpen();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteDoc(doc(db, 'contactUs', id));
        setContacts(contacts.filter(contact => contact.id !== id));
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      contactType: value as 'address' | 'phone' | 'email',
    });
  };

  const handleMainChange = (isSelected: boolean) => {
    setFormData({
      ...formData,
      isMain: isSelected,
    });
  };

  const handleSubmit = async () => {
    if (!formData.label || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (currentContact) {
        // Update existing contact
        await updateDoc(doc(db, 'contactUs', currentContact.id), {
          contactType: formData.contactType,
          label: formData.label,
          content: formData.content,
          isMain: formData.isMain,
        });
        setContacts(contacts.map(contact => 
          contact.id === currentContact.id ? { 
            ...contact, 
            ...formData 
          } : contact
        ));
      } else {
        // Add new contact
        const docRef = await addDoc(collection(db, 'contactUs'), {
          contactType: formData.contactType,
          label: formData.label,
          content: formData.content,
          isMain: formData.isMain,
        });
        setContacts([...contacts, { 
          id: docRef.id, 
          ...formData 
        }]);
      }
      onEditModalClose();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const getIconByType = (type: string) => {
    switch(type) {
      case 'address': return 'lucide:map-pin';
      case 'phone': return 'lucide:phone';
      case 'email': return 'lucide:mail';
      default: return 'lucide:info';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'address': return 'Address';
      case 'phone': return 'Phone';
      case 'email': return 'Email';
      default: return 'Other';
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
          <h2 className="text-xl font-semibold text-woodBrown dark:text-lightWood">Contact Information</h2>
          <Button 
            color="primary" 
            endContent={<Icon icon="lucide:plus" />}
            onPress={handleAddNew}
          >
            Add New Contact
          </Button>
        </CardHeader>
        <CardBody>
          {contacts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No contact information found. Add your first contact!
            </div>
          ) : (
            <Table 
              aria-label="Contact information table"
              className="border-collapse w-full"
              removeWrapper
            >
              <TableHeader className="[&>tr]:first:shadow-sm">
                <TableColumn className="text-left py-3 px-4 font-semibold text-sm">
                  TYPE
                </TableColumn>
                <TableColumn className="text-left py-3 px-4 font-semibold text-sm">
                  LABEL
                </TableColumn>
                <TableColumn className="text-left py-3 px-4 font-semibold text-sm">
                  CONTACT INFO
                </TableColumn>
                <TableColumn className="text-center py-3 px-4 font-semibold text-sm">
                  PRIMARY
                </TableColumn>
                <TableColumn className="text-right py-3 px-4 font-semibold text-sm">
                  ACTIONS
                </TableColumn>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                {contacts.map((contact) => (
                  <TableRow key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Icon 
                          icon={getIconByType(contact.contactType)} 
                          className="text-primary" 
                        />
                        {getTypeLabel(contact.contactType)}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="font-medium">{contact.label}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {contact.contactType === 'email' ? (
                        <a 
                          href={`mailto:${contact.content}`} 
                          className="text-primary underline hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          {contact.content}
                        </a>
                      ) : contact.contactType === 'phone' ? (
                        <a 
                          href={`tel:${contact.content}`} 
                          className="text-primary underline hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          {contact.content}
                        </a>
                      ) : (
                        <span>{contact.content}</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      {contact.isMain ? (
                        <Chip 
                          color="primary" 
                          variant="flat" 
                          size="sm"
                          startContent={<Icon icon="lucide:check-circle" className="text-lg" />}
                        >
                          Primary
                        </Chip>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Tooltip content="View details">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            onPress={() => handleView(contact)}
                            className="text-blue-600 dark:text-blue-400"
                          >
                            <Icon icon="lucide:eye" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Edit contact">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            onPress={() => handleEdit(contact)}
                            className="text-yellow-600 dark:text-yellow-400"
                          >
                            <Icon icon="lucide:edit" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete contact" color="danger">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            color="danger" 
                            onPress={() => handleDelete(contact.id)}
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
      <Modal isOpen={isEditModalOpen} onOpenChange={onEditModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {currentContact ? 'Edit Contact Information' : 'Add New Contact Information'}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Select
                    label="Contact Type"
                    placeholder="Select contact type"
                    selectedKeys={[formData.contactType]}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    variant="bordered"
                  >
                    <SelectItem key="address" value="address" startContent={<Icon icon="lucide:map-pin" />}>
                      Address
                    </SelectItem>
                    <SelectItem key="phone" value="phone" startContent={<Icon icon="lucide:phone" />}>
                      Phone
                    </SelectItem>
                    <SelectItem key="email" value="email" startContent={<Icon icon="lucide:mail" />}>
                      Email
                    </SelectItem>
                  </Select>
                  
                  <Input
                    label="Label"
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    placeholder="e.g. Main Office, Customer Support"
                    variant="bordered"
                  />
                  
                  {formData.contactType === 'address' && (
                    <Input
                      label="Address"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Full address"
                      variant="bordered"
                    />
                  )}
                  
                  {formData.contactType === 'phone' && (
                    <Input
                      label="Phone Number"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      variant="bordered"
                    />
                  )}
                  
                  {formData.contactType === 'email' && (
                    <Input
                      label="Email Address"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="example@visualarea.com"
                      variant="bordered"
                      type="email"
                    />
                  )}
                  
                  <Checkbox
                    isSelected={formData.isMain}
                    onValueChange={handleMainChange}
                  >
                    Set as primary {getTypeLabel(formData.contactType).toLowerCase()}
                  </Checkbox>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  {currentContact ? 'Update' : 'Add'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onOpenChange={onViewModalOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Icon icon={viewingContact ? getIconByType(viewingContact.contactType) : 'lucide:info'} 
                  className="text-primary text-xl" />
                <span>Contact Details</span>
              </ModalHeader>
              <ModalBody>
                {viewingContact && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Type</h4>
                        <p className="text-lg font-medium flex items-center gap-2">
                          <Icon icon={getIconByType(viewingContact.contactType)} />
                          {getTypeLabel(viewingContact.contactType)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Label</h4>
                        <p className="text-lg font-medium">{viewingContact.label}</p>
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contact Information</h4>
                      {viewingContact.contactType === 'email' ? (
                        <a 
                          href={`mailto:${viewingContact.content}`} 
                          className="text-lg text-primary hover:underline flex items-center gap-2"
                        >
                          <Icon icon="lucide:mail" />
                          {viewingContact.content}
                        </a>
                      ) : viewingContact.contactType === 'phone' ? (
                        <a 
                          href={`tel:${viewingContact.content}`} 
                          className="text-lg text-primary hover:underline flex items-center gap-2"
                        >
                          <Icon icon="lucide:phone" />
                          {viewingContact.content}
                        </a>
                      ) : (
                        <p className="text-lg flex items-start gap-2">
                          <Icon icon="lucide:map-pin" className="mt-1 flex-shrink-0" />
                          <span>{viewingContact.content}</span>
                        </p>
                      )}
                    </div>

                    <Divider />

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h4>
                      {viewingContact.isMain ? (
                        <Chip 
                          color="primary" 
                          variant="flat" 
                          size="lg"
                          startContent={<Icon icon="lucide:check-circle" className="text-xl" />}
                        >
                          Primary Contact
                        </Chip>
                      ) : (
                        <Chip 
                          variant="flat" 
                          size="lg"
                          startContent={<Icon icon="lucide:info" className="text-xl" />}
                        >
                          Secondary Contact
                        </Chip>
                      )}
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