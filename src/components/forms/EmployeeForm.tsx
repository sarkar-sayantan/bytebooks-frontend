'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateEmployee } from '@/hooks/useEmployees';
import { useEmployeeRoles } from '@/hooks/useEmployeeRoles';
import { CreateEmployeeRequest } from '@/types';
import { toast } from 'sonner';

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .refine((val) => val.length === 10, 'Phone number must be exactly 10 digits')
    .refine((val) => /^\d+$/.test(val), 'Phone number must contain only digits'),
  salary: z.number().min(0, 'Salary must be positive'),
  roleId: z.string().min(1, 'Role is required'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  onSuccess?: () => void;
}

export function EmployeeForm({ onSuccess }: EmployeeFormProps) {
  const createEmployee = useCreateEmployee();
  const { data: roles = [], isLoading: isRolesLoading } = useEmployeeRoles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const employeeData: CreateEmployeeRequest = {
        ...data,
      };

      await createEmployee.mutateAsync(employeeData);
      toast.success('Employee created successfully!');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create employee');
      console.error('Error creating employee:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Employee</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter employee name"
              {...register('name')}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Enter phone number"
                maxLength={10}
                {...register('phone', {
                  onChange: (e) => {
                    // Only allow numeric input
                    const value = e.target.value.replace(/\D/g, '');
                    e.target.value = value;
                  }
                })}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => setValue('roleId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {isRolesLoading ? (
                    <SelectItem value="loading" disabled>Loading roles...</SelectItem>
                  ) : (
                    roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.roleId && (
                <p className="text-sm text-red-500">{errors.roleId.message}</p>
              )}
            </div>
          
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('salary', { valueAsNumber: true })}
              />
              {errors.salary && <p className="text-sm text-red-500">{errors.salary.message}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={createEmployee.isPending}>
            {createEmployee.isPending ? 'Creating...' : 'Create Employee'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
