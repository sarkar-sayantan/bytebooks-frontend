'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateCustomer } from '@/hooks/useCustomers';
import { CreateCustomerRequest } from '@/types';
import { toast } from 'sonner';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .refine((val) => val.length === 10, 'Phone number must be exactly 10 digits')
    .refine((val) => /^\d+$/.test(val), 'Phone number must contain only digits'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSuccess?: () => void;
}

export function CustomerForm({ onSuccess }: CustomerFormProps) {
  const createCustomer = useCreateCustomer();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      const customerData: CreateCustomerRequest = {
        ...data,
      };

      await createCustomer.mutateAsync(customerData);
      toast.success('Customer created successfully!');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create customer');
      console.error('Error creating customer:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter customer name"
              {...register('name')}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit phone number"
              maxLength={10}
              {...register('phone', {
                onChange: (e) => {
                  // Only allow numeric input
                  const value = e.target.value.replace(/\D/g, '');
                  e.target.value = value;
                }
              })}
            />
            <p className="text-xs text-gray-500">Must be exactly 10 digits</p>
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={createCustomer.isPending}>
            {createCustomer.isPending ? 'Creating...' : 'Create Customer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
