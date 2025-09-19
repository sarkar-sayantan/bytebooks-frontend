'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateEntry } from '@/hooks/useEntries';
import { useCategories, useCreateCategory } from '@/hooks/useCategories';
import { CreateEntryRequest } from '@/types';
import { toast } from 'sonner';

const entrySchema = z.object({
  type: z.enum(['income', 'expense']),
  categoryName: z.string().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),

});

type EntryFormData = z.infer<typeof entrySchema>;

interface EntryFormProps {
  onSuccess?: () => void;
}

// Categories are fetched dynamically via useCategories

export function EntryForm({ onSuccess }: EntryFormProps) {
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('income');
  const createEntry = useCreateEntry();
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories(selectedType);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      type: 'income',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const createCategory = useCreateCategory();

  const onSubmit = async (data: EntryFormData) => {
    try {
      console.log("Form data:", data);

      // Step 1: resolve category
      let categoryId: string | null = null;
      const existingCategory = categories.find(
        (c) => c.name.toLowerCase() === data.categoryName.toLowerCase()
      );

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const newCategory = await createCategory.mutateAsync({
          name: data.categoryName,
          type: selectedType
        });
        categoryId = newCategory.id;
      }

      // Step 2: create entry with categoryId
      const entryData: CreateEntryRequest = {
        ...data,
        categoryId,
        description: data.description || undefined,
      };
      delete (entryData as any).categoryName; // remove helper field

      await createEntry.mutateAsync(entryData);
      toast.success("Entry created successfully!");
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create entry");
      console.error("Error creating entry:", error);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, (formErrors) => {
    console.log("Form validation errors:", formErrors);
  })} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={selectedType}
                onValueChange={(value: 'income' | 'expense') => {
                  setSelectedType(value);
                  setValue('type', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="Type or select category"
              list="category-list"
              {...register('categoryName')}
            />
            <datalist id="category-list">
              {categories.map((category) => (
                <option key={category.id} value={category.name} />
              ))}
            </datalist>
            {errors.categoryName && (
              <p className="text-sm text-red-500">{errors.categoryName.message}</p>
            )}
          </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter description..."
              {...register('description')}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>



          <Button type="submit" className="w-full" disabled={createEntry.isPending}>
            {createEntry.isPending ? 'Creating...' : 'Create Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
