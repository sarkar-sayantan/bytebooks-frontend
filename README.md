# ByteBooks Frontend

A modern, responsive frontend application for ByteBooks - a small business accounting app built with Next.js, TypeScript, and TailwindCSS.

## Features

- **Dashboard**: Overview with financial statistics and charts
- **Entries Management**: Add, view, and manage income/expense entries
- **Customer Management**: Add and manage customer information
- **Employee Management**: Add and manage employee records
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Built with shadcn/ui components and TailwindCSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bytebooks-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:5000](http://localhost:5000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page and layout
│   ├── entries/           # Entries page and layout
│   ├── customers/         # Customers page and layout
│   ├── employees/         # Employees page and layout
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects to dashboard)
├── components/            # Reusable components
│   ├── forms/            # Form components
│   ├── tables/           # Table components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── services/             # API service layer
├── types/                # TypeScript type definitions
└── lib/                  # Utility functions
```

## API Integration

The application is designed to work with a backend API that provides the following endpoints:

### Entries
- `GET /entries` - Get all entries for a tenant
- `POST /entries` - Create a new entry
- `GET /entries/stats` - Get dashboard statistics
- `GET /entries/chart` - Get chart data

### Customers
- `GET /customers` - Get all customers for a tenant
- `POST /customers` - Create a new customer

### Employees
- `GET /employees` - Get all employees for a tenant
- `POST /employees` - Create a new employee

## Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production, update the API URL to your actual backend domain.

## Available Scripts

- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run start` - Start production server (port 5000)
- `npm run lint` - Run ESLint

## Features Overview

### Dashboard
- Financial overview with total income, expenses, and net balance
- Monthly statistics
- Interactive charts showing income vs expenses and balance trends

### Entries
- Add income/expense entries with categories
- Filter entries by type and search
- View all entries in a responsive table
- Delete entries with confirmation

### Customers
- Add customer information (name, email, phone)
- Search customers
- View customer list in a table
- Delete customers with confirmation

### Employees
- Add employee information (name, email, phone, role, salary)
- Filter employees by role
- Search employees
- View employee list in a table
- Delete employees with confirmation

## Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.