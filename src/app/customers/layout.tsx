import { Layout } from '@/components/layout/Layout';

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
