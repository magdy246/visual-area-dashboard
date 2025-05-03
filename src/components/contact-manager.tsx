import React, { useEffect } from 'react';
import { 
  Card, CardBody, CardHeader, Button, Input, Table, TableHeader, TableColumn, 
  TableBody, TableRow, TableCell, Tooltip, Modal, ModalContent, ModalHeader, 
  ModalBody, ModalFooter, useDisclosure, Select, SelectItem, Checkbox, Spinner 
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
  const [loading, setLoading] = React.useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
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
    onOpen();
  };

  const handleEdit = (contact: ContactInfo) => {
    setCurrentContact(contact);
    setFormData({
      contactType: contact.contactType,
      label: contact.label,
      content: contact.content,
      isMain: contact.isMain,
    });
    onOpen();
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
      onClose();
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
            <Table aria-label="Contact information table">
              <TableHeader>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>LABEL</TableColumn>
                <TableColumn>CONTACT INFO</TableColumn>
                <TableColumn>PRIMARY</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon icon={getIconByType(contact.contactType)} className="text-primary" />
                        {getTypeLabel(contact.contactType)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{contact.label}</span>
                    </TableCell>
                    <TableCell>
                      {contact.contactType === 'email' ? (
                        <a 
                          href={`mailto:${contact.content}`} 
                          className="text-primary underline"
                        >
                          {contact.content}
                        </a>
                      ) : contact.contactType === 'phone' ? (
                        <a 
                          href={`tel:${contact.content}`} 
                          className="text-primary underline"
                        >
                          {contact.content}
                        </a>
                      ) : (
                        <span>{contact.content}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contact.isMain ? (
                        <div className="flex items-center gap-1 text-primary">
                          <Icon icon="lucide:check-circle" />
                          <span className="text-xs">Primary</span>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip content="Edit contact">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            onPress={() => handleEdit(contact)}
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
    </div>
  );
};