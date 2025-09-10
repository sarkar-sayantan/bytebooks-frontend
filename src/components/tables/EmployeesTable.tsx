'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployees, useDeleteEmployee } from '@/hooks/useEmployees';
import { Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useEmployeeRoles } from '@/hooks/useEmployeeRoles';

export function EmployeesTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const { data: employees = [], isLoading } = useEmployees(searchTerm, roleFilter === 'all' ? undefined : roleFilter);
  const deleteEmployee = useDeleteEmployee();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee.mutateAsync(id);
        toast.success('Employee deleted successfully');
      } catch {
        toast.error('Failed to delete employee');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const { data: roles = [], isLoading: isRolesLoading } = useEmployeeRoles();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading employees...</div>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>

            {isRolesLoading ? (
              <SelectItem value="loading" disabled>Loading...</SelectItem>
            ) : (
              roles.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Salary</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(employee.salary)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
                        disabled={deleteEmployee.isPending}
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
