import React, { useEffect } from 'react';
import {
  Card, CardBody, CardHeader, Button, Input, Textarea, Table,
  TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Checkbox, Chip, Divider, Spinner
} from "@heroui/react";
import { Icon } from '@iconify/react';
import { db } from '../firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import { PricingPlan } from '../types/data-types';

export const PricingManager: React.FC = () => {
  const [pricingPlans, setPricingPlans] = React.useState<PricingPlan[]>([]);
  const [currentPlan, setCurrentPlan] = React.useState<PricingPlan | null>(null);
  const [viewingPlan, setViewingPlan] = React.useState<PricingPlan | null>(null);
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
    price: 0,
    currency: '$',
    period: '',
    features: '',
    isPopular: false,
    backgroundColor: '#f9eadb',
  });

  const pricingRef = collection(db, "pricingPlans");

  const fetchPricingPlans = async () => {
    try {
      const data = await getDocs(pricingRef);
      const plans = data.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        price: parseFloat(doc.data().price),
        features: doc.data().features || []
      })) as PricingPlan[];
      setPricingPlans(plans);
    } catch (error) {
      console.error("Error fetching pricing plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const handleAddNew = () => {
    setCurrentPlan(null);
    setFormData({
      title: '',
      price: 0,
      currency: '$',
      period: 'per project',
      features: '',
      isPopular: false,
      backgroundColor: '#f9eadb',
    });
    onEditModalOpen();
  };

  const handleEdit = (plan: PricingPlan) => {
    setCurrentPlan(plan);
    setFormData({
      title: plan.title,
      price: plan.price,
      currency: plan.currency,
      period: plan.period,
      features: plan.features.join('\n'),
      isPopular: plan.isPopular,
      backgroundColor: plan.backgroundColor,
    });
    onEditModalOpen();
  };

  const handleView = (plan: PricingPlan) => {
    setViewingPlan(plan);
    onViewModalOpen();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this pricing plan?')) {
      try {
        await deleteDoc(doc(db, "pricingPlans", id));
        fetchPricingPlans();
      } catch (error) {
        console.error("Error deleting pricing plan:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    });
  };

  const handleCheckboxChange = (isSelected: boolean) => {
    setFormData({
      ...formData,
      isPopular: isSelected,
    });
  };

  const handleSubmit = async () => {
    if (formData.title && formData.price > 0) {
      const features = formData.features
        .split('\n')
        .map(feature => feature.trim())
        .filter(feature => feature !== '');

      const payload = {
        title: formData.title,
        price: formData.price.toString(),
        currency: formData.currency,
        period: formData.period,
        features,
        isPopular: formData.isPopular,
        backgroundColor: formData.backgroundColor,
      };

      try {
        if (currentPlan) {
          const planDoc = doc(db, "pricingPlans", currentPlan.id);
          await updateDoc(planDoc, payload);
        } else {
          await addDoc(pricingRef, payload);
        }
        onEditModalClose();
        fetchPricingPlans();
      } catch (error) {
        console.error("Error saving pricing plan:", error);
      }
    }
  };

  const colorOptions = [
    { name: 'Light Wood', value: '#f9eadb' },
    { name: 'Medium Wood', value: '#ebc08f' },
    { name: 'Dark Wood', value: '#deb887' },
    { name: 'Brown', value: '#b5651d' },
    { name: 'Deep Brown', value: '#8b4513' },
  ];

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
          <h2 className="text-xl font-semibold text-woodBrown dark:text-lightWood">Pricing Plans</h2>
          <Button color="primary" endContent={<Icon icon="lucide:plus" />} onPress={handleAddNew}>
            Add New Plan
          </Button>
        </CardHeader>
        <CardBody>
          {pricingPlans.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No pricing plans found. Add your first plan!
            </div>
          ) : (
            <Table aria-label="Pricing plans table" className="border-collapse w-full" removeWrapper>
              <TableHeader className="[&>tr]:first:shadow-sm">
                <TableColumn className="text-left py-3 px-4 font-semibold text-sm">
                  PLAN
                </TableColumn>
                <TableColumn className="text-left py-3 px-4 font-semibold text-sm">
                  PRICE
                </TableColumn>
                <TableColumn className="text-left py-3 px-4 font-semibold text-sm">
                  FEATURES
                </TableColumn>
                <TableColumn className="text-center py-3 px-4 font-semibold text-sm">
                  POPULAR
                </TableColumn>
                <TableColumn className="text-right py-3 px-4 font-semibold text-sm">
                  ACTIONS
                </TableColumn>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                {pricingPlans.map((plan) => (
                  <TableRow key={plan.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700" 
                          style={{ backgroundColor: plan.backgroundColor }} 
                        />
                        <span className="font-medium">{plan.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="font-semibold">
                        {plan.currency}{plan.price}
                      </span>
                      <span className="text-default-500 text-xs"> {plan.period}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {plan.features.slice(0, 2).map((feature, index) => (
                          <Chip key={index} size="sm" variant="flat">
                            {feature}
                          </Chip>
                        ))}
                        {plan.features.length > 2 && (
                          <Chip size="sm" variant="flat">
                            +{plan.features.length - 2} more
                          </Chip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      {plan.isPopular ? (
                        <Chip color="primary" variant="solid" size="sm">Popular</Chip>
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
                            onPress={() => handleView(plan)}
                            className="text-blue-600 dark:text-blue-400"
                          >
                            <Icon icon="lucide:eye" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Edit plan">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            onPress={() => handleEdit(plan)}
                            className="text-yellow-600 dark:text-yellow-400"
                          >
                            <Icon icon="lucide:edit" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete plan" color="danger">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            color="danger" 
                            onPress={() => handleDelete(plan.id)}
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
              <ModalHeader>{currentPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Input label="Plan Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Basic Package" variant="bordered" />
                    <div className="flex gap-2">
                      <Input label="Currency" name="currency" value={formData.currency} onChange={handleInputChange} placeholder="$" variant="bordered" className="w-20" />
                      <Input label="Price" name="price" type="number" value={formData.price.toString()} onChange={handleInputChange} placeholder="99" variant="bordered" className="flex-1" />
                    </div>
                    <Input label="Period" name="period" value={formData.period} onChange={handleInputChange} placeholder="e.g. per month, per project" variant="bordered" />
                    <Checkbox isSelected={formData.isPopular} onValueChange={handleCheckboxChange}>Mark as Popular</Checkbox>
                  </div>
                  <div className="space-y-4">
                    <Textarea 
                      label="Features (one per line)" 
                      name="features" 
                      value={formData.features} 
                      onChange={handleInputChange} 
                      placeholder="4 Hours of Coverage\n100 Digital Images\nOnline Gallery" 
                      variant="bordered" 
                      minRows={5} 
                    />
                    <div>
                      <p className="text-sm mb-2">Background Color:</p>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <Button 
                            key={color.value} 
                            className="w-10 h-10 p-0 min-w-0" 
                            style={{ backgroundColor: color.value }} 
                            isIconOnly 
                            variant={formData.backgroundColor === color.value ? "bordered" : "flat"} 
                            onPress={() => setFormData({ ...formData, backgroundColor: color.value })}
                          >
                            {formData.backgroundColor === color.value && (
                              <Icon icon="lucide:check" className="text-white" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={handleSubmit}>{currentPlan ? 'Update' : 'Add'}</Button>
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
                <Icon icon="lucide:list-checks" className="text-primary" />
                <span>Pricing Plan Details</span>
              </ModalHeader>
              <ModalBody>
                {viewingPlan && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md" 
                        style={{ backgroundColor: viewingPlan.backgroundColor }}
                      />
                      <div>
                        <h3 className="text-xl font-bold">{viewingPlan.title}</h3>
                        {viewingPlan.isPopular && (
                          <Chip color="primary" variant="solid" size="sm" className="mt-1">
                            Popular Choice
                          </Chip>
                        )}
                      </div>
                    </div>

                    <Divider />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                        <p className="text-2xl font-bold">
                          {viewingPlan.currency}{viewingPlan.price}
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> {viewingPlan.period}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Features</p>
                        <p className="text-lg font-semibold">{viewingPlan.features.length} included</p>
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <p className="text-sm font-medium mb-2">Included Features:</p>
                      <ul className="space-y-2">
                        {viewingPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Icon icon="lucide:check-circle" className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
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