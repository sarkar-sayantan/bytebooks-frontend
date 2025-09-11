// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Entry Types
export interface Entry {
  id: string;
  type: 'income' | 'expense';
  category: Category;
  amount: number;
  description: string;
  date: string;
  email: string;
  phone: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryRequest {
  type: 'income' | 'expense';
  categoryId: string;
  amount: number;
  description?: string;
  date: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
}

// Employee Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  salary: number;
  role: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phone: string;
  salary: number;
  roleId: string;
}

// Dashboard Types
export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
}

export interface ChartData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// Form Types
export interface FormState {
  isLoading: boolean;
  error: string | null;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

// Table Types
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

// Filter Types
export interface EntryFilters {
  type?: 'income' | 'expense';
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface CustomerFilters {
  search?: string;
}

export interface EmployeeFilters {
  search?: string;
  role?: string;
}
