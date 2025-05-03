import React, { useEffect } from 'react';
import {
  Card, CardBody, CardHeader, Button, Input, Textarea, Table,
  TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Checkbox, Chip
} from "@heroui/react";
import { Icon } from '@iconify/react';
import { db } from '../firebase'; // your firebase setup file
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import { PricingPlan } from '../types/data-types';

export const PricingManager: React.FC = () => {
  const [pricingPlans, setPricingPlans] = React.useState<PricingPlan[]>([]);
  const [currentPlan, setCurrentPlan] = React.useState<PricingPlan | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
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
    const data = await getDocs(pricingRef);
    const plans = data.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      price: parseFloat(doc.data().price),
      features: doc.data().features || []
    })) as PricingPlan[];
    setPricingPlans(plans);
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
    onOpen();
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
    onOpen();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "pricingPlans", id));
    fetchPricingPlans();
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
        price: formData.price.toString(), // as string for Firebase
        currency: formData.currency,
        period: formData.period,
        features,
        isPopular: formData.isPopular,
        backgroundColor: formData.backgroundColor,
      };

      if (currentPlan) {
        const planDoc = doc(db, "pricingPlans", currentPlan.id);
        await updateDoc(planDoc, payload);
      } else {
        await addDoc(pricingRef, payload);
      }

      onClose();
      fetchPricingPlans();
    }
  };

  const colorOptions = [
    { name: 'Light Wood', value: '#f9eadb' },
    { name: 'Medium Wood', value: '#ebc08f' },
    { name: 'Dark Wood', value: '#deb887' },
    { name: 'Brown', value: '#b5651d' },
    { name: 'Deep Brown', value: '#8b4513' },
  ];

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
          <Table aria-label="Pricing plans table">
            <TableHeader>
              <TableColumn>PLAN</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>FEATURES</TableColumn>
              <TableColumn>POPULAR</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {pricingPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: plan.backgroundColor }} />
                      <span className="font-medium">{plan.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      {plan.currency}{plan.price}
                    </span>
                    <span className="text-default-500 text-xs"> {plan.period}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {plan.features.slice(0, 2).map((feature, index) => (
                        <Chip key={index} size="sm" variant="flat">{feature}</Chip>
                      ))}
                      {plan.features.length > 2 && (
                        <Chip size="sm" variant="flat">+{plan.features.length - 2} more</Chip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {plan.isPopular ? (
                      <Chip color="primary" variant="solid">Popular</Chip>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Tooltip content="Edit plan">
                        <Button isIconOnly size="sm" variant="light" onPress={() => handleEdit(plan)}>
                          <Icon icon="lucide:edit" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete plan" color="danger">
                        <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(plan.id)}>
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
                    <Textarea label="Features (one per line)" name="features" value={formData.features} onChange={handleInputChange} placeholder="4 Hours of Coverage\n100 Digital Images\nOnline Gallery" variant="bordered" minRows={5} />
                    <div>
                      <p className="text-sm mb-2">Background Color:</p>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <Button key={color.value} className="w-10 h-10 p-0 min-w-0" style={{ backgroundColor: color.value }} isIconOnly variant={formData.backgroundColor === color.value ? "bordered" : "flat"} onPress={() => setFormData({ ...formData, backgroundColor: color.value })}>
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
    </div>
  );
};
