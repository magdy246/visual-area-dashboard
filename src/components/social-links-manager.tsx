import React from 'react';
import { Card, CardBody, CardHeader, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Divider } from "@heroui/react";
import { Icon } from '@iconify/react';
import { initialSocialLinks } from '../data/mock-data';
import { SocialLink } from '../types/data-types';

export const SocialLinksManager: React.FC = () => {
  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>(initialSocialLinks);
  const [currentLink, setCurrentLink] = React.useState<SocialLink | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [formData, setFormData] = React.useState({
    platform: '',
    url: '',
    icon: '',
  });

  const handleAddNew = () => {
    setCurrentLink(null);
    setFormData({
      platform: '',
      url: '',
      icon: '',
    });
    onOpen();
  };

  const handleEdit = (link: SocialLink) => {
    setCurrentLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
    });
    onOpen();
  };

  const handleDelete = (id: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (formData.platform && formData.url) {
      if (currentLink) {
        // Update existing link
        setSocialLinks(socialLinks.map(link => 
          link.id === currentLink.id ? { ...link, ...formData } : link
        ));
      } else {
        // Add new link
        const newLink: SocialLink = {
          id: Date.now().toString(),
          ...formData,
        };
        setSocialLinks([...socialLinks, newLink]);
      }
      onClose();
    }
  };

  const platformIcons: Record<string, string> = {
    'Instagram': 'logos:instagram-icon',
    'Facebook': 'logos:facebook',
    'Twitter': 'logos:twitter',
    'YouTube': 'logos:youtube-icon',
    'LinkedIn': 'logos:linkedin-icon',
    'Pinterest': 'logos:pinterest',
    'TikTok': 'logos:tiktok-icon',
    'Behance': 'logos:behance',
    'Dribbble': 'logos:dribbble-icon',
  };

  return (
    <div className="py-5">
      <Card className="bg-beige dark:bg-[#1f1f1f]">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-woodBrown dark:text-lightWood">Social Media Links</h2>
          <Button 
            color="primary" 
            endContent={<Icon icon="lucide:plus" />}
            onPress={handleAddNew}
          >
            Add New Link
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="Social links table">
            <TableHeader>
              <TableColumn>PLATFORM</TableColumn>
              <TableColumn>URL</TableColumn>
              <TableColumn>ICON</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {socialLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon icon={link.icon} width={24} height={24} />
                      {link.platform}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      {link.url}
                    </a>
                  </TableCell>
                  <TableCell>{link.icon}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Tooltip content="Edit link">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          onPress={() => handleEdit(link)}
                        >
                          <Icon icon="lucide:edit" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete link" color="danger">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          color="danger"
                          onPress={() => handleDelete(link.id)}
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{currentLink ? 'Edit Social Link' : 'Add New Social Link'}</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <Input
                      label="Platform"
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      placeholder="e.g. Instagram, Facebook, etc."
                      variant="bordered"
                    />
                  </div>
                  <div>
                    <Input
                      label="URL"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      variant="bordered"
                    />
                  </div>
                  <div>
                    <p className="text-sm mb-2">Select Icon:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(platformIcons).map(([platform, icon]) => (
                        <Button
                          key={platform}
                          variant={formData.icon === icon ? "solid" : "bordered"}
                          color={formData.icon === icon ? "primary" : "default"}
                          className="flex flex-col items-center p-2 h-auto"
                          onPress={() => setFormData({...formData, icon})}
                        >
                          <Icon icon={icon} width={24} height={24} />
                          <span className="text-xs mt-1">{platform}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  {currentLink ? 'Update' : 'Add'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};