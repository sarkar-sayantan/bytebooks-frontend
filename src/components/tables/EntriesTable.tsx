'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EntryFilters } from '@/types';
import { useEntries, useDeleteEntry } from '@/hooks/useEntries';
import { format } from 'date-fns';
import { Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export function EntriesTable() {
  const [filters, setFilters] = useState<EntryFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: entries = [], isLoading } = useEntries(filters);
  const deleteEntry = useDeleteEntry();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteEntry.mutateAsync(id);
        toast.success('Entry deleted successfully');
      } catch {
        toast.error('Failed to delete entry');
      }
    }
  };

  const filteredEntries = entries.filter((entry) =>
    entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading entries...</div>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Entries</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) =>
              setFilters({ ...filters, type: value === 'all' ? undefined : value as 'income' | 'expense' })
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No entries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {format(new Date(entry.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={entry.type.toLowerCase() === 'income' ? 'default' : 'destructive'}>
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.category.name}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell className="text-right">
                      <span className={entry.type.toLowerCase() === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {entry.type.toLowerCase() === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        disabled={deleteEntry.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
